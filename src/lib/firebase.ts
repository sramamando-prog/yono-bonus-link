import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import firebaseConfigRaw from '../../firebase-applet-config.json';

const rawStorageBucket = firebaseConfigRaw.storageBucket || '';
// In Firebase projects, the default bucket name can be either <project-id>.firebasestorage.app or <project-id>.appspot.com
const primaryBucket = rawStorageBucket || `${firebaseConfigRaw.projectId}.firebasestorage.app`;
const fallbackBucket = `${firebaseConfigRaw.projectId}.appspot.com`;

const firebaseConfig = {
  apiKey: firebaseConfigRaw.apiKey,
  authDomain: firebaseConfigRaw.authDomain,
  projectId: firebaseConfigRaw.projectId,
  storageBucket: primaryBucket,
  messagingSenderId: firebaseConfigRaw.messagingSenderId,
  appId: firebaseConfigRaw.appId,
  measurementId: firebaseConfigRaw.measurementId,
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google OAuth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firestore
const customDbId = (firebaseConfigRaw as { firestoreDatabaseId?: string }).firestoreDatabaseId;
export const db = customDbId && customDbId !== '(default)'
  ? getFirestore(app, customDbId)
  : getFirestore(app);

// Primary Storage instance with primaryBucket
export const storage = getStorage(app, `gs://${primaryBucket}`);
// Fallback Storage instance with appspot.com in case bucket was provisioned with appspot.com domain
export const fallbackStorage = getStorage(app, `gs://${fallbackBucket}`);

export const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5 MB (5 * 1024 * 1024 bytes)
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

/**
 * Perform a single upload attempt to a specific Firebase Storage instance.
 */
function attemptUploadToStorage(
  storageInstance: any,
  file: File,
  storagePath: string,
  timeoutMs: number,
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storageInstance, storagePath);
    let isFinished = false;

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'image/png',
      cacheControl: 'public, max-age=31536000',
    });

    const timer = setTimeout(() => {
      if (!isFinished) {
        isFinished = true;
        try {
          uploadTask.cancel();
        } catch (e) {
          // ignore
        }
        reject(new Error('TIMEOUT'));
      }
    }, timeoutMs);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (isFinished) return;
        if (snapshot.totalBytes > 0) {
          const progress = Math.min(
            99,
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
          if (onProgress) {
            onProgress(progress);
          }
        }
      },
      (error) => {
        if (isFinished) return;
        isFinished = true;
        clearTimeout(timer);
        reject(error);
      },
      async () => {
        if (isFinished) return;
        isFinished = true;
        clearTimeout(timer);
        try {
          if (onProgress) {
            onProgress(100);
          }
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (downloadErr: any) {
          reject(downloadErr);
        }
      }
    );
  });
}

/**
 * Upload an image file directly to Firebase Storage with real-time progress.
 * Enforces <= 5MB and JPG/PNG/WEBP formats.
 * Checks both <project>.firebasestorage.app and <project>.appspot.com bucket addresses.
 * Provides clear diagnostic errors when Cloud Storage is not activated in Firebase Console.
 */
export async function uploadAppLogo(
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  // 1. Authentication check
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required: Please sign in as an authorized admin before uploading.');
  }

  const userEmail = (currentUser.email || '').trim().toLowerCase();
  if (userEmail !== 'akashramamando@gmail.com') {
    throw new Error('Unauthorized: Only akashramamando@gmail.com can upload app logos.');
  }

  // 2. Validate file size
  if (file.size > MAX_LOGO_SIZE) {
    throw new Error('Logo size must be 5 MB or less.');
  }

  // 3. Validate file type
  const isAllowedType =
    ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|webp)$/i.test(file.name);

  if (!isAllowedType) {
    throw new Error('Invalid image format. Supported formats: JPG/JPEG, PNG, WEBP.');
  }

  // 4. Generate clean storage path
  const timestamp = Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const storagePath = `app_logos/${timestamp}_${cleanName}`;

  // Try primary bucket first with a 12-second window
  try {
    return await attemptUploadToStorage(storage, file, storagePath, 12000, onProgress);
  } catch (firstErr: any) {
    console.warn('Primary storage bucket attempt failed/timed out, attempting fallback bucket...', firstErr);

    // If unauthorized, do not bother retrying fallback bucket with wrong credentials
    if (firstErr?.code === 'storage/unauthorized') {
      throw new Error(
        'Unauthorized: Storage permission denied. Please verify your admin account session (akashramamando@gmail.com).'
      );
    }

    // Try fallback bucket with a 12-second window
    try {
      return await attemptUploadToStorage(fallbackStorage, file, storagePath, 12000, onProgress);
    } catch (secondErr: any) {
      console.error('All Firebase Storage upload attempts failed:', secondErr);

      if (secondErr?.code === 'storage/unauthorized') {
        throw new Error(
          'Unauthorized: Storage permission denied. Please verify your admin account session.'
        );
      }

      // If both timed out or gave bucket/network errors, Firebase Cloud Storage has not been enabled in the console yet
      throw new Error(
        `Firebase Storage is not enabled or the bucket is not active for project "${firebaseConfigRaw.projectId}". ` +
        `Firebase Cloud Storage must be activated in your Firebase Console under Build > Storage.`
      );
    }
  }
}
