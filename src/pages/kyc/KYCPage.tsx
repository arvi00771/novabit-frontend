import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  ShieldCheck, 
  Upload, 
  User, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';

type Step = 'start' | 'personal' | 'address' | 'document' | 'pending';

export default function KYCPage() {
  const [step, setStep] = useState<Step>('start');

  const renderStep = () => {
    switch (step) {
      case 'start':
        return (
          <div className="text-center space-y-8 max-w-lg mx-auto py-12">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
              <ShieldCheck size={40} />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-gray-900">Identity Verification</h1>
              <p className="text-gray-500 font-medium">To comply with financial regulations and protect your account, please verify your identity.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl text-left space-y-4 border border-blue-100">
               <h4 className="font-bold text-blue-900 flex items-center gap-2">
                 <CheckCircle2 size={18} /> Verification Benefits
               </h4>
               <ul className="text-sm text-blue-700 space-y-2">
                 <li>• Higher withdrawal limits (up to 100 BTC/day)</li>
                 <li>• Access to Fiat on-ramps and off-ramps</li>
                 <li>• Enhanced account recovery options</li>
                 <li>• Priority customer support</li>
               </ul>
            </div>
            <Button className="w-full py-7 text-lg font-bold" onClick={() => setStep('personal')}>
              Start Verification <ArrowRight className="ml-2" />
            </Button>
          </div>
        );

      case 'personal':
        return (
          <div className="max-w-xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
               <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>
            <Card className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" />
                <Input label="Last Name" placeholder="Doe" />
              </div>
              <Input label="Date of Birth" type="date" />
              <Input label="Nationality" placeholder="e.g. United States" />
              <Button className="w-full" onClick={() => setStep('address')}>Continue</Button>
            </Card>
          </div>
        );

      case 'address':
        return (
          <div className="max-w-xl mx-auto space-y-8">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
               <h2 className="text-2xl font-bold text-gray-900">Residential Address</h2>
            </div>
            <Card className="space-y-6">
              <Input label="Street Address" placeholder="123 Main St" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" placeholder="San Francisco" />
                <Input label="Postal Code" placeholder="94105" />
              </div>
              <Input label="Country" placeholder="United States" />
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep('personal')}>Back</Button>
                <Button className="flex-[2]" onClick={() => setStep('document')}>Continue</Button>
              </div>
            </Card>
          </div>
        );

      case 'document':
        return (
          <div className="max-w-xl mx-auto space-y-8">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
               <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
            </div>
            <Card className="space-y-6">
              <p className="text-sm text-gray-500">Upload a high-quality photo of your government-issued ID (Passport, Driver's License, or National ID).</p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center space-y-4 hover:border-blue-400 cursor-pointer transition-colors group">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <Upload size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Click to upload ID Front</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center space-y-4 hover:border-blue-400 cursor-pointer transition-colors group">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <User size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Upload Selfie with ID</p>
                    <p className="text-xs text-gray-400 mt-1">Ensure your face is clearly visible</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep('address')}>Back</Button>
                <Button className="flex-[2]" onClick={() => setStep('pending')}>Submit Verification</Button>
              </div>
            </Card>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center space-y-8 max-w-lg mx-auto py-12">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto text-yellow-600">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-gray-900">Verification Pending</h1>
              <p className="text-gray-500 font-medium">Your documents have been submitted and are currently being reviewed by our team.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl text-left border border-gray-100">
               <p className="text-sm text-gray-600 leading-relaxed">
                 Review usually takes between **2-24 hours**. We will notify you via email once your status has been updated.
               </p>
            </div>
            <Button className="w-full py-6 font-bold" variant="secondary" onClick={() => window.location.href = '/dashboard'}>
              Back to Dashboard
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col justify-center">
      {renderStep()}
    </div>
  );
}
