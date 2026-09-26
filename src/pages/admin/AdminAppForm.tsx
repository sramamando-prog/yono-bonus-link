import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '../../context/NavigationContext';
import { uploadAppLogo, MAX_LOGO_SIZE } from '../../lib/firebase';
import { AdminLayout } from './AdminLayout';
import { AppLogo } from '../../components/AppLogo';
import { 
  ArrowLeft, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  AlertCircle, 
  Trash2, 
  Eye, 
  EyeOff, 
  Gift, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Loader2,
  ImageIcon,
  ExternalLink
} from 'lucide-react';
import { AppItem, AppType } from '../../types';

interface AdminAppFormProps {
  mode: 'create' | 'edit';
  appId?: string;
}

export const AdminAppForm: React.FC<AdminAppFormProps> = ({ mode, appId }) => {
  const { apps, categories, addApp, updateApp, deleteApp } = useApp();
  const { navigate } = useNavigation();

  // Find existing app if in edit mode
  const existingApp = mode === 'edit' && appId ? apps.find((a) => a.id === appId) : null;

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [category, setCategory] = useState('');
  const [appType, setAppType] = useState<AppType>('Reward App');
  const [bonusText, setBonusText] = useState('');
  const [howItWorks, setHowItWorks] = useState('');
  const [officialUrl, setOfficialUrl] = useState('');
  const [telegramUrl, setTelegramUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'live'>('live');
  const [isNew, setIsNew] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [ageNotice, setAgeNotice] = useState('18+ only. Terms and conditions apply.');
  const [legalNotice, setLegalNotice] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  // Logo upload state with explicit states
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'completed' | 'failed'
  >('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const [isStorageConfigError, setIsStorageConfigError] = useState(false);
  const [logoInputType, setLogoInputType] = useState<'upload' | 'url'>('url');

  // UI state
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load existing data
  useEffect(() => {
    if (existingApp) {
      setName(existingApp.name || '');
      setSlug(existingApp.slug || '');
      const initialLogo = (existingApp.logoUrl || existingApp.imageUrl || '').trim();
      setLogoUrl(initialLogo);
      setShortDescription(existingApp.shortDescription || '');
      setFullDescription(existingApp.fullDescription || '');
      setCategory(existingApp.category || '');
      setAppType(existingApp.appType || 'Reward App');
      setBonusText(existingApp.bonusText || '');
      setHowItWorks(existingApp.howItWorks || '');
      setOfficialUrl(existingApp.officialUrl || '');
      setTelegramUrl(existingApp.telegramUrl || '');
      setStatus(existingApp.status || 'live');
      setIsNew(!!existingApp.isNew);
      setIsFeatured(!!existingApp.isFeatured);
      setAgeNotice(existingApp.ageNotice || '');
      setLegalNotice(existingApp.legalNotice || '');
      setDisplayOrder(existingApp.displayOrder || 1);

      // Default to Image URL tab if the logo is an external URL
      if (initialLogo) {
        setLogoInputType('url');
      }
    } else if (categories.length > 0 && !category) {
      const firstValidCat = categories.find((c) => c.slug !== 'all');
      if (firstValidCat) setCategory(firstValidCat.name);
    }
  }, [existingApp, categories]);

  // Auto-generate slug from name if creating
  const handleNameChange = (val: string) => {
    setName(val);
    if (mode === 'create') {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  };

  // Perform Firebase Storage upload with progress tracking and robust error handling
  const executeUpload = async (file: File) => {
    try {
      setUploadStatus('uploading');
      setUploadProgress(0);
      setUploadErrorMessage(null);
      setIsStorageConfigError(false);

      const downloadUrl = await uploadAppLogo(file, (progress) => {
        setUploadProgress(progress);
      });

      // Set download URL
      const cleanDownloadUrl = (downloadUrl || '').trim();
      setLogoUrl(cleanDownloadUrl);
      setLocalPreviewUrl(null); // Switch to the real download URL
      setUploadProgress(100);
      setUploadStatus('completed');
    } catch (err: any) {
      console.error('Failed to upload logo:', err);
      setUploadStatus('failed');
      const msg = err.message || 'Failed to upload logo to Firebase Storage.';
      setUploadErrorMessage(msg);
      if (
        msg.includes('Firebase Console') ||
        msg.includes('bucket') ||
        msg.includes('timed out')
      ) {
        setIsStorageConfigError(true);
      }
    }
  };

  // Handle Logo File Selection with Client-side Validation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate File Size (Max 5 MB = 5 * 1024 * 1024 bytes)
    if (file.size > MAX_LOGO_SIZE) {
      setUploadStatus('failed');
      setUploadErrorMessage('Logo size must be 5 MB or less.');
      setSelectedFile(null);
      setLocalPreviewUrl(null);
      return;
    }

    // 2. Validate File Type (JPG, JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const isImageValid = validTypes.includes(file.type.toLowerCase()) || 
      /\.(jpe?g|png|webp)$/i.test(file.name);

    if (!isImageValid) {
      setUploadStatus('failed');
      setUploadErrorMessage('Please select a valid image file (JPG, JPEG, PNG, or WEBP).');
      setSelectedFile(null);
      setLocalPreviewUrl(null);
      return;
    }

    // 3. Generate instant preview before & during upload
    const preview = URL.createObjectURL(file);
    setLocalPreviewUrl(preview);
    setSelectedFile(file);
    setUploadErrorMessage(null);

    // 4. Trigger Firebase Storage Upload
    await executeUpload(file);
  };

  // Allow admin to retry failed upload
  const handleRetryUpload = () => {
    if (selectedFile) {
      executeUpload(selectedFile);
    }
  };

  // Validation
  const validateForm = (): boolean => {
    if (!name.trim()) {
      setErrorMessage('App Name is required.');
      return false;
    }
    const cleanLogo = logoUrl.trim();
    if (!cleanLogo) {
      setErrorMessage('App Logo is required. Please upload a logo or enter an Image URL.');
      return false;
    }
    if (uploadStatus === 'uploading') {
      setErrorMessage('Please wait for the logo upload to complete before saving.');
      return false;
    }
    if (!category.trim()) {
      setErrorMessage('Please select or enter a Category.');
      return false;
    }
    if (!officialUrl.trim()) {
      setErrorMessage('Official Website URL is required.');
      return false;
    }
    // Check URL format
    let cleanUrl = officialUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    try {
      new URL(cleanUrl);
    } catch (e) {
      setErrorMessage('Official Website URL must be a valid web address (e.g., https://example.com).');
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ensure valid URL scheme
    let cleanOfficialUrl = officialUrl.trim();
    if (!cleanOfficialUrl.startsWith('http://') && !cleanOfficialUrl.startsWith('https://')) {
      cleanOfficialUrl = `https://${cleanOfficialUrl}`;
    }

    let finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Trim accidental spaces from logoUrl and preserve exact external or storage URL
    const cleanLogoUrl = logoUrl.trim();

    const appData = {
      name: name.trim(),
      slug: finalSlug,
      logoUrl: cleanLogoUrl,
      imageUrl: cleanLogoUrl,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      category: category.trim(),
      appType,
      bonusText: bonusText.trim(),
      howItWorks: howItWorks.trim(),
      officialUrl: cleanOfficialUrl,
      telegramUrl: telegramUrl.trim(),
      status,
      isNew,
      isFeatured,
      ageNotice: ageNotice.trim(),
      legalNotice: legalNotice.trim(),
      displayOrder: Number(displayOrder) || 1,
    };

    try {
      setSaving(true);
      if (mode === 'edit' && appId) {
        await updateApp(appId, appData);
        setSuccessMessage('App updated successfully!');
      } else {
        await addApp(appData);
        setSuccessMessage('App published successfully!');
      }

      setTimeout(() => {
        navigate('/admin/apps');
      }, 1000);
    } catch (err: any) {
      console.error('Failed to save app:', err);
      setErrorMessage(err.message || 'Failed to save application.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!appId) return;
    try {
      setSaving(true);
      await deleteApp(appId);
      navigate('/admin/apps');
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Failed to delete app.');
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  // Helper function for upload progress text
  const getUploadStatusText = () => {
    if (uploadStatus === 'completed') return 'Upload Complete';
    if (uploadStatus === 'failed') return 'Upload Failed';
    if (uploadStatus === 'uploading') {
      if (uploadProgress <= 10) return 'Uploading 0%';
      if (uploadProgress <= 35) return 'Uploading 25%';
      if (uploadProgress <= 65) return 'Uploading 50%';
      if (uploadProgress <= 90) return 'Uploading 75%';
      return `Uploading ${uploadProgress}%`;
    }
    return 'Select Logo';
  };

  // Active preview image source: local file blob during upload, otherwise the direct logoUrl
  const activePreviewSrc = (localPreviewUrl || logoUrl || '').trim();

  return (
    <AdminLayout activeTab={mode === 'create' ? 'new-app' : 'apps'}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/apps')}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-purple-700 bg-white border border-gray-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Apps</span>
          </button>

          {mode === 'edit' && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete App</span>
            </button>
          )}
        </div>

        {/* Heading */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {mode === 'create' ? 'Add New Application' : `Edit: ${name || 'Application'}`}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Fill in verified application details, logo, bonus information, and official link.
              </p>
            </div>

            {/* Quick Status Pill */}
            <button
              type="button"
              onClick={() => setStatus(status === 'live' ? 'draft' : 'live')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                status === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {status === 'live' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="capitalize">{status}</span>
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Section 1: Logo & Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-purple-900 uppercase tracking-wider">
                1. Branding & Identity
              </h3>

              {/* Logo Upload / URL Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-2xl bg-purple-50/40 border border-purple-100">
                {/* Logo Preview */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-white border-2 border-purple-200 overflow-hidden flex items-center justify-center shadow-xs mb-2 relative group">
                    <AppLogo
                      src={activePreviewSrc}
                      alt={name || 'Logo preview'}
                      size="xl"
                      className="w-full h-full object-cover"
                    />

                    {uploadStatus === 'uploading' && (
                      <div className="absolute inset-0 bg-purple-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-1">
                        <Loader2 className="w-6 h-6 animate-spin mb-1 text-amber-300" />
                        <span className="text-[10px] font-black">{uploadProgress}%</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-gray-600">Logo Preview</span>
                </div>

                {/* Logo Input Options */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLogoInputType('url')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        logoInputType === 'url' 
                          ? 'bg-purple-700 text-white shadow-xs' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Image URL (Instant)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoInputType('upload')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        logoInputType === 'upload' 
                          ? 'bg-purple-700 text-white shadow-xs' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Upload File (Max 5 MB)
                    </button>
                  </div>

                  {logoInputType === 'url' ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                          Direct Image Web URL (JPG, PNG, WEBP)
                        </label>
                        <input
                          type="url"
                          value={logoUrl}
                          onChange={(e) => {
                            const trimmed = e.target.value.trim();
                            setLogoUrl(trimmed);
                            setLocalPreviewUrl(null);
                          }}
                          placeholder="https://i.ibb.co/XZ65Kq9Q/logo.png"
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        Paste any direct external image link (e.g. ImgBB, PostImage, CDN). The preview will render immediately.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/*"
                          onChange={handleFileChange}
                          disabled={uploadStatus === 'uploading'}
                          className="w-full text-xs text-gray-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-700 file:text-white hover:file:bg-purple-800 file:cursor-pointer file:transition-all cursor-pointer"
                        />
                        {selectedFile && uploadStatus === 'failed' && (
                          <button
                            type="button"
                            onClick={handleRetryUpload}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                            title="Retry upload"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-purple-700" />
                            <span>Retry</span>
                          </button>
                        )}
                      </div>

                      {/* Explicit Upload States Display */}
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-500">Current Status:</span>
                        <span className={`font-bold px-2 py-0.5 rounded-md ${
                          uploadStatus === 'uploading' ? 'bg-purple-100 text-purple-900 animate-pulse' :
                          uploadStatus === 'completed' ? 'bg-emerald-100 text-emerald-900' :
                          uploadStatus === 'failed' ? 'bg-rose-100 text-rose-900' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {getUploadStatusText()}
                        </span>
                      </div>

                      {/* Upload Progress Bar */}
                      {uploadStatus === 'uploading' && (
                        <div className="bg-white rounded-xl p-3 border border-purple-200 space-y-1.5 shadow-xs">
                          <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                            <span className="flex items-center gap-1.5">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-700" />
                              <span>Uploading to Firebase Storage...</span>
                            </span>
                            <span className="text-purple-700 font-mono">{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 h-2.5 rounded-full transition-all duration-150"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Success Feedback */}
                      {uploadStatus === 'completed' && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>Upload Complete! Download URL saved.</span>
                        </div>
                      )}

                      {/* Error Feedback */}
                      {uploadStatus === 'failed' && uploadErrorMessage && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs space-y-2">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                            <span>Upload Failed</span>
                          </div>
                          <p className="leading-relaxed">{uploadErrorMessage}</p>
                          {isStorageConfigError && (
                            <div className="pt-2 border-t border-rose-200/80 space-y-1.5 text-[11px] text-rose-800">
                              <p className="font-bold">One-time action required in Firebase Console:</p>
                              <ol className="list-decimal list-inside space-y-1">
                                <li>
                                  Open{' '}
                                  <a
                                    href="https://console.firebase.google.com/project/gen-lang-client-0219310736/storage"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold underline text-purple-700 hover:text-purple-900 inline-flex items-center gap-0.5"
                                  >
                                    <span>Firebase Console &gt; Storage</span>
                                    <ExternalLink className="w-3 h-3 inline" />
                                  </a>
                                </li>
                                <li>Click <strong>Get Started</strong> (choose default location and test/production mode).</li>
                                <li>Once activated, return here and click <strong>Retry</strong>!</li>
                              </ol>
                              <div className="pt-1 flex items-center gap-2">
                                <span className="text-gray-500 font-semibold">Or use immediate fallback:</span>
                                <button
                                  type="button"
                                  onClick={() => setLogoInputType('url')}
                                  className="text-purple-800 font-bold underline cursor-pointer hover:text-purple-950"
                                >
                                  Switch to "Image URL" tab
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <p className="text-[11px] text-gray-500 leading-normal">
                        Supports <strong>JPG/JPEG</strong>, <strong>PNG</strong>, and <strong>WEBP</strong>. Maximum file size: <strong>5 MB</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* App Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    App Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Yono Games Official"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    list="category-suggestions"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Select or enter category"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                  />
                  <datalist id="category-suggestions">
                    {categories
                      .filter((c) => c.slug !== 'all')
                      .map((c) => (
                        <option key={c.id || c.slug} value={c.name} />
                      ))}
                    <option value="Reward Apps" />
                    <option value="Gaming Apps" />
                    <option value="Rummy & Cards" />
                    <option value="Task & Survey" />
                    <option value="Earning Apps" />
                  </datalist>
                </div>
              </div>

              {/* App Type & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    App Type
                  </label>
                  <select
                    value={appType}
                    onChange={(e) => setAppType(e.target.value as AppType)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                  >
                    <option value="Reward App">Reward App</option>
                    <option value="Earning App">Earning App</option>
                    <option value="Gaming App">Gaming App</option>
                    <option value="Rummy / Real-Money Gaming">Rummy / Real-Money Gaming</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Descriptions & Bonus Info */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-black text-purple-900 uppercase tracking-wider">
                2. Content & Offers
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Short Description * (1-2 sentences)
                </label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief summary of the app and its primary feature."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Bonus / Offer Information
                </label>
                <div className="relative">
                  <Gift className="w-4 h-4 text-purple-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bonusText}
                    onChange={(e) => setBonusText(e.target.value)}
                    placeholder="e.g. Free 50 Welcome Coins upon OTP verification"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Enter only verified promotional details provided by the operator.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Description & Details
                </label>
                <textarea
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Provide comprehensive details about game modes, redemption options, or rules..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  How It Works
                </label>
                <textarea
                  rows={3}
                  value={howItWorks}
                  onChange={(e) => setHowItWorks(e.target.value)}
                  placeholder="Step 1: Open official link. Step 2: Register mobile number. Step 3: Access practice dashboard."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>
            </div>

            {/* Section 3: Official Links */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-black text-purple-900 uppercase tracking-wider">
                3. Links & Destinations
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Official Website URL * (Must be verified HTTPS link)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-purple-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={officialUrl}
                    onChange={(e) => setOfficialUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Visitors clicking "Visit Official Website" will be redirected safely to this exact URL in a new tab.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  App Telegram URL (Optional)
                </label>
                <input
                  type="url"
                  value={telegramUrl}
                  onChange={(e) => setTelegramUrl(e.target.value)}
                  placeholder="https://t.me/Job_wala_Akash"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>
            </div>

            {/* Section 4: Badges & Status */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-black text-purple-900 uppercase tracking-wider">
                4. Visibility & Badges
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Status */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'live')}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-hidden"
                  >
                    <option value="live">Live (Public)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                {/* New App */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Mark as "NEW"
                  </label>
                  <select
                    value={isNew ? 'yes' : 'no'}
                    onChange={(e) => setIsNew(e.target.value === 'yes')}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-hidden"
                  >
                    <option value="yes">Yes (Show New Badge)</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Featured App */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Mark as "FEATURED"
                  </label>
                  <select
                    value={isFeatured ? 'yes' : 'no'}
                    onChange={(e) => setIsFeatured(e.target.value === 'yes')}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-hidden"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes (Homepage Highlight)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 5: Legal & Responsible Notices */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-black text-purple-900 uppercase tracking-wider">
                5. Legal, Age & Territory Notices
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Age Restriction Notice
                </label>
                <input
                  type="text"
                  value={ageNotice}
                  onChange={(e) => setAgeNotice(e.target.value)}
                  placeholder="e.g. 18+ only. Games involve financial risk. Play responsibly."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Territory / Legal Availability Notice
                </label>
                <input
                  type="text"
                  value={legalNotice}
                  onChange={(e) => setLegalNotice(e.target.value)}
                  placeholder="e.g. Restricted in Andhra Pradesh, Assam, Nagaland, Odisha, Sikkim, Telangana."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/apps')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || uploadStatus === 'uploading'}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-purple-700/25 active:scale-98 transition-all cursor-pointer"
              >
                {saving
                  ? 'Saving App...'
                  : uploadStatus === 'uploading'
                  ? 'Uploading Logo...'
                  : mode === 'create'
                  ? 'Publish Application'
                  : 'Update Application'}
              </button>
            </div>
          </form>
        </div>

        {/* Delete Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-gray-900">Are you sure?</h3>
                <p className="text-xs text-gray-500">
                  Are you sure you want to delete this app? This action is irreversible.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
