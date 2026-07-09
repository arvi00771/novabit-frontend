import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';
import {
  ShieldCheck, Upload, User, CheckCircle2, ArrowRight,
  AlertCircle, AlertTriangle, Loader2, X, FileText,
  ChevronLeft, ChevronRight, Home, RefreshCw, Eye,
  Clock, ShieldAlert
} from 'lucide-react';

type Step = 'start' | 'form' | 'pending' | 'verified' | 'rejected';
type FormStep = 'personal' | 'address' | 'documents';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
}

interface AddressInfo {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  idFront?: string;
  selfie?: string;
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function KYCPage() {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState<Step>('start');
  const [formStep, setFormStep] = useState<FormStep>('personal');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Form state
  const [personal, setPersonal] = useState<PersonalInfo>({
    firstName: '', lastName: '', dateOfBirth: '', nationality: '',
  });
  const [address, setAddress] = useState<AddressInfo>({
    street: '', city: '', postalCode: '', country: '',
  });
  const [idFront, setIdFront] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string>('');
  const [selfiePreview, setSelfiePreview] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Preview modal
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const idFrontRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  // Check KYC status on mount
  const checkStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/kyc/status');
      const status = res.data?.data?.status || res.data?.status || 'UNVERIFIED';
      const reason = res.data?.data?.rejection_reason || res.data?.rejection_reason || '';

      switch (status) {
        case 'PENDING':
          setStep('pending');
          break;
        case 'VERIFIED':
          setStep('verified');
          break;
        case 'REJECTED':
          setStep('rejected');
          setRejectionReason(reason);
          break;
        default:
          setStep('start');
      }
    } catch {
      // If the endpoint doesn't exist yet, default to unverified
      setStep('start');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (idFrontPreview) URL.revokeObjectURL(idFrontPreview);
      if (selfiePreview) URL.revokeObjectURL(selfiePreview);
    };
  }, [idFrontPreview, selfiePreview]);

  const handleFileSelect = (file: File | null, type: 'idFront' | 'selfie') => {
    if (!file) {
      if (type === 'idFront') {
        setIdFront(null);
        setIdFrontPreview('');
      } else {
        setSelfie(null);
        setSelfiePreview('');
      }
      return;
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, [type]: 'Only PNG, JPG, and JPEG files are allowed' }));
      return;
    }
    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, [type]: 'File size must be under 10MB' }));
      return;
    }

    setErrors(prev => ({ ...prev, [type]: undefined }));

    if (type === 'idFront') {
      setIdFront(file);
      setIdFrontPreview(URL.createObjectURL(file));
    } else {
      setSelfie(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const validatePersonal = (): boolean => {
    const newErrors: FormErrors = {};
    if (!personal.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!personal.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!personal.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!personal.nationality.trim()) newErrors.nationality = 'Nationality is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = (): boolean => {
    const newErrors: FormErrors = {};
    if (!address.street.trim()) newErrors.street = 'Street address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!address.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDocuments = (): boolean => {
    const newErrors: FormErrors = {};
    if (!idFront) newErrors.idFront = 'Please upload the front of your ID';
    if (!selfie) newErrors.selfie = 'Please upload a selfie with your ID';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateDocuments()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('first_name', personal.firstName);
      formData.append('last_name', personal.lastName);
      formData.append('date_of_birth', personal.dateOfBirth);
      formData.append('nationality', personal.nationality);
      formData.append('street', address.street);
      formData.append('city', address.city);
      formData.append('postal_code', address.postalCode);
      formData.append('country', address.country);
      if (idFront) formData.append('id_front', idFront);
      if (selfie) formData.append('selfie', selfie);

      const res = await api.post('/kyc/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Update the user's KYC status in auth context
      const newStatus = res.data?.data?.status || res.data?.status || 'PENDING';
      if (user) {
        updateUser({ ...user, kyc_status: newStatus });
      }
      setStep('pending');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit verification. Please try again.';
      setErrors({ idFront: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReApply = () => {
    setStep('start');
    setFormStep('personal');
    setPersonal({ firstName: '', lastName: '', dateOfBirth: '', nationality: '' });
    setAddress({ street: '', city: '', postalCode: '', country: '' });
    setIdFront(null);
    setSelfie(null);
    setIdFrontPreview('');
    setSelfiePreview('');
    setErrors({});
    setRejectionReason('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Checking verification status...</p>
        </div>
      </div>
    );
  }

  // Step: Start (UNVERIFIED)
  const renderStart = () => (
    <div className="text-center space-y-8 max-w-lg mx-auto py-8">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
        <ShieldCheck size={40} />
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-gray-900">Identity Verification</h1>
        <p className="text-gray-500 font-medium">
          To comply with financial regulations and protect your account, please verify your identity.
        </p>
      </div>
      <div className="bg-blue-50 p-6 rounded-2xl text-left space-y-4 border border-blue-100">
        <h4 className="font-bold text-blue-900 flex items-center gap-2 text-sm">
          <CheckCircle2 size={18} /> Verification Benefits
        </h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-start gap-2"><CheckCircle2 size={14} className="shrink-0 mt-0.5" /> Higher withdrawal limits (up to 100 BTC/day)</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={14} className="shrink-0 mt-0.5" /> Access to Fiat on-ramps and off-ramps</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={14} className="shrink-0 mt-0.5" /> Enhanced account recovery options</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={14} className="shrink-0 mt-0.5" /> Priority customer support</li>
        </ul>
      </div>
      <Button
        className="w-full py-7 text-lg font-bold rounded-full"
        onClick={() => { setStep('form'); setFormStep('personal'); }}
      >
        Start Verification <ArrowRight className="ml-2" />
      </Button>
    </div>
  );

  // Step: Form (multi-step)
  const renderForm = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress bar */}
      <div className="flex items-center justify-center gap-2">
        {(['personal', 'address', 'documents'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              formStep === s
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : ['personal', 'address', 'documents'].indexOf(formStep) > i
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {['personal', 'address', 'documents'].indexOf(formStep) > i ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              formStep === s ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {s === 'personal' ? 'Personal' : s === 'address' ? 'Address' : 'Documents'}
            </span>
            {i < 2 && <div className={`w-8 h-0.5 ${['personal', 'address', 'documents'].indexOf(formStep) > i ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Personal Info */}
      {formStep === 'personal' && (
        <Card className="rounded-2xl border border-gray-100">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                value={personal.firstName}
                onChange={(e) => setPersonal(p => ({ ...p, firstName: e.target.value }))}
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={personal.lastName}
                onChange={(e) => setPersonal(p => ({ ...p, lastName: e.target.value }))}
                error={errors.lastName}
              />
            </div>
            <Input
              label="Date of Birth"
              type="date"
              value={personal.dateOfBirth}
              onChange={(e) => setPersonal(p => ({ ...p, dateOfBirth: e.target.value }))}
              error={errors.dateOfBirth}
            />
            <Input
              label="Nationality"
              placeholder="e.g. United States"
              value={personal.nationality}
              onChange={(e) => setPersonal(p => ({ ...p, nationality: e.target.value }))}
              error={errors.nationality}
            />
            <Button
              className="w-full rounded-full py-5 font-bold"
              onClick={() => {
                if (validatePersonal()) setFormStep('address');
              }}
            >
              Continue <ChevronRight className="ml-1" size={18} />
            </Button>
          </div>
        </Card>
      )}

      {/* Address */}
      {formStep === 'address' && (
        <Card className="rounded-2xl border border-gray-100">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Home size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Residential Address</h2>
            </div>
            <Input
              label="Street Address"
              placeholder="123 Main St"
              value={address.street}
              onChange={(e) => setAddress(a => ({ ...a, street: e.target.value }))}
              error={errors.street}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="San Francisco"
                value={address.city}
                onChange={(e) => setAddress(a => ({ ...a, city: e.target.value }))}
                error={errors.city}
              />
              <Input
                label="Postal Code"
                placeholder="94105"
                value={address.postalCode}
                onChange={(e) => setAddress(a => ({ ...a, postalCode: e.target.value }))}
                error={errors.postalCode}
              />
            </div>
            <Input
              label="Country"
              placeholder="United States"
              value={address.country}
              onChange={(e) => setAddress(a => ({ ...a, country: e.target.value }))}
              error={errors.country}
            />
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 rounded-full py-5 font-bold" onClick={() => setFormStep('personal')}>
                <ChevronLeft size={18} /> Back
              </Button>
              <Button className="flex-[2] rounded-full py-5 font-bold" onClick={() => {
                if (validateAddress()) setFormStep('documents');
              }}>
                Continue <ChevronRight className="ml-1" size={18} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Documents */}
      {formStep === 'documents' && (
        <Card className="rounded-2xl border border-gray-100">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Document Upload</h2>
                <p className="text-sm text-gray-500 mt-1">Upload a high-quality photo of your government-issued ID.</p>
              </div>
            </div>

            {/* ID Front */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ID Front (Passport, Driver's License, or National ID)</label>
              {idFrontPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 group">
                  <img src={idFrontPreview} alt="ID Front" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white text-gray-800 rounded-full px-4" onClick={() => setPreviewUrl(idFrontPreview)}>
                      <Eye size={16} className="mr-1" /> Preview
                    </Button>
                    <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white text-red-600 rounded-full px-4" onClick={() => { setIdFront(null); setIdFrontPreview(''); }}>
                      <X size={16} className="mr-1" /> Remove
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg px-2 py-1 text-xs font-medium text-gray-700 flex items-center gap-1">
                    <FileText size={12} /> {idFront?.name} ({formatFileSize(idFront?.size || 0)})
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => idFrontRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center space-y-3 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all group"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                    <Upload size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Click to upload ID Front</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
              <input
                ref={idFrontRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'idFront')}
              />
              {errors.idFront && <p className="mt-2 text-sm text-red-500">{errors.idFront}</p>}
            </div>

            {/* Selfie */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Selfie with ID</label>
              {selfiePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 group">
                  <img src={selfiePreview} alt="Selfie with ID" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white text-gray-800 rounded-full px-4" onClick={() => setPreviewUrl(selfiePreview)}>
                      <Eye size={16} className="mr-1" /> Preview
                    </Button>
                    <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white text-red-600 rounded-full px-4" onClick={() => { setSelfie(null); setSelfiePreview(''); }}>
                      <X size={16} className="mr-1" /> Remove
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg px-2 py-1 text-xs font-medium text-gray-700 flex items-center gap-1">
                    <FileText size={12} /> {selfie?.name} ({formatFileSize(selfie?.size || 0)})
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => selfieRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center space-y-3 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all group"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                    <User size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Upload Selfie with ID</p>
                    <p className="text-xs text-gray-400 mt-1">Ensure your face is clearly visible</p>
                  </div>
                </div>
              )}
              <input
                ref={selfieRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null, 'selfie')}
              />
              {errors.selfie && <p className="mt-2 text-sm text-red-500">{errors.selfie}</p>}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 rounded-full py-5 font-bold" onClick={() => setFormStep('address')}>
                <ChevronLeft size={18} /> Back
              </Button>
              <Button
                className="flex-[2] rounded-full py-5 font-bold"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <><Loader2 className="animate-spin mr-2" size={18} /> Submitting...</>
                ) : (
                  <>Submit Verification <ArrowRight className="ml-1" size={18} /></>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  // Step: PENDING
  const renderPending = () => (
    <div className="text-center space-y-8 max-w-lg mx-auto py-8">
      <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto text-yellow-600">
        <Clock size={40} />
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-gray-900">Verification Pending</h1>
        <p className="text-gray-500 font-medium">
          Your documents have been submitted and are currently being reviewed by our team.
        </p>
      </div>
      <div className="bg-yellow-50 p-6 rounded-2xl text-left border border-yellow-100">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-yellow-800 mb-1">What happens next?</p>
            <p className="text-sm text-yellow-700 leading-relaxed">
              Review usually takes between <strong>2-24 hours</strong>. We will notify you via email once your status has been updated. You can check back here anytime.
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          className="flex-1 rounded-full py-6 font-bold"
          variant="secondary"
          onClick={() => window.location.href = '/dashboard'}
        >
          <Home size={18} className="mr-2" /> Dashboard
        </Button>
        <Button
          className="flex-1 rounded-full py-6 font-bold gap-2"
          variant="outline"
          onClick={checkStatus}
        >
          <RefreshCw size={18} /> Check Status
        </Button>
      </div>
    </div>
  );

  // Step: VERIFIED
  const renderVerified = () => (
    <div className="text-center space-y-8 max-w-lg mx-auto py-8">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={40} className="text-green-500" />
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-gray-900">Identity Verified!</h1>
        <p className="text-gray-500 font-medium">
          Your identity has been verified successfully. Enjoy full access to all NovaBit features.
        </p>
      </div>
      <div className="bg-green-50 p-6 rounded-2xl text-left border border-green-100 space-y-4">
        <h4 className="font-bold text-green-800 flex items-center gap-2 text-sm">
          <ShieldCheck size={18} /> Your upgraded benefits
        </h4>
        <ul className="text-sm text-green-700 space-y-2">
          <li className="flex items-start gap-2"><CheckCircle2 size={14} className="shrink-0 mt-0.5" /> Withdrawal limit: <strong>100 BTC/day</strong></li>
          <li className="flex items-start gap-2"><CheckCircle2 size={14} className="shrink-0 mt-0.5" /> Fiat on-ramps and off-ramps enabled</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={14} className="shrink-0 mt-0.5" /> Enhanced account recovery</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={14} className="shrink-0 mt-0.5" /> Priority customer support</li>
        </ul>
      </div>
      <Button
        className="w-full py-6 font-bold rounded-full"
        onClick={() => window.location.href = '/dashboard'}
      >
        <Home size={18} className="mr-2" /> Go to Dashboard
      </Button>
    </div>
  );

  // Step: REJECTED
  const renderRejected = () => (
    <div className="text-center space-y-8 max-w-lg mx-auto py-8">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600">
        <ShieldAlert size={40} />
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-gray-900">Verification Rejected</h1>
        <p className="text-gray-500 font-medium">
          Unfortunately, your identity verification was not approved.
        </p>
      </div>
      {rejectionReason && (
        <div className="bg-red-50 p-6 rounded-2xl text-left border border-red-100">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800 mb-1">Reason:</p>
              <p className="text-sm text-red-700 leading-relaxed">{rejectionReason}</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gray-50 p-6 rounded-2xl text-left border border-gray-100">
        <p className="text-sm text-gray-600 leading-relaxed">
          Please ensure your documents are clear, all text is readable, and your face is visible in the selfie. Try again with better quality images.
        </p>
      </div>
      <Button
        className="w-full py-6 font-bold rounded-full"
        onClick={handleReApply}
      >
        Re-apply for Verification <RefreshCw className="ml-2" size={18} />
      </Button>
    </div>
  );

  return (
    <div className="h-full flex flex-col justify-center">
      {step === 'start' && renderStart()}
      {step === 'form' && renderForm()}
      {step === 'pending' && renderPending()}
      {step === 'verified' && renderVerified()}
      {step === 'rejected' && renderRejected()}

      {/* Image Preview Modal */}
      <Modal
        isOpen={!!previewUrl}
        onClose={() => setPreviewUrl('')}
        title="Document Preview"
      >
        {previewUrl && (
          <img src={previewUrl} alt="Document" className="w-full rounded-xl" />
        )}
      </Modal>
    </div>
  );
}