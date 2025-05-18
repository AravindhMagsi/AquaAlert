import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, AlertTriangle, Info, ArrowRight, Loader2, X } from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import toast from 'react-hot-toast';

// Categories for water issues
const categories = [
  { value: 'leak', label: 'Water Leak' },
  { value: 'quality', label: 'Water Quality Issue' },
  { value: 'pressure', label: 'Low Water Pressure' },
  { value: 'drainage', label: 'Drainage Problem' },
  { value: 'infrastructure', label: 'Infrastructure Damage' },
  { value: 'service', label: 'Service Disruption' },
  { value: 'other', label: 'Other' }
];

// Severity levels
const severityLevels = [
  { value: 'low', label: 'Low - Not urgent, can be fixed when convenient' },
  { value: 'medium', label: 'Medium - Should be addressed soon' },
  { value: 'high', label: 'High - Needs prompt attention' },
  { value: 'critical', label: 'Critical - Immediate action required' }
];

const ComplaintForm: React.FC = () => {
  const navigate = useNavigate();
  const { addComplaint } = useComplaints();
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Location state
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modified location fetching
  const fetchLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'WaterComplaintSystem/1.0'
              }
            }
          );
          const data = await response.json();
          if (data.display_name) {
            setAddress(data.display_name);
          }
        } catch (error) {
          console.error('Error fetching address:', error);
          setAddress(`${latitude}, ${longitude}`);
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Please enable location access to continue');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again');
            break;
          default:
            setLocationError('An unknown error occurred');
        }
      },
      options
    );
  };
  
  // Modified image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Validate file types and size
      const validFiles = newFiles.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          return false;
        }
        return true;
      });
      
      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
        
        // Create preview URLs
        validFiles.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImages(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    }
  };
  
  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Validate form for each step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!title.trim()) newErrors.title = 'Title is required';
      if (!description.trim()) newErrors.description = 'Description is required';
      if (!category) newErrors.category = 'Please select a category';
      if (!severity) newErrors.severity = 'Please select severity level';
    }
    
    if (step === 2) {
      if (!address.trim() && !coordinates) {
        newErrors.location = 'Please provide location details';
      }
    }
    
    if (step === 3) {
      if (!name.trim()) newErrors.name = 'Name is required';
      if (!email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!phone.trim()) newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Navigate between steps
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Modified form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Add complaint to context/storage
      const complaintId = addComplaint({
        title,
        description,
        category,
        severity,
        location: {
          address,
          coordinates
        },
        images,
        contactDetails: {
          name,
          email,
          phone
        }
      });
      
      // Send SMS notification using Twilio
      const twilioResponse = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message: `Your complaint has been registered with ID: ${complaintId}. Track your complaint at: ${window.location.origin}/alert/${complaintId}`
        })
      });

      if (!twilioResponse.ok) {
        console.error('Failed to send SMS notification');
      }
      
      toast.success('Complaint submitted successfully!');
      
      // Show success modal and redirect
      navigate(`/success/${complaintId}`);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  // Get location on component mount if user permits
  useEffect(() => {
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);
  
  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-sky-700 p-6 text-white">
            <h1 className="text-2xl font-bold">Report a Water Issue</h1>
            <p className="text-sky-100">
              Fill out the form below to report a water-related problem in your area
            </p>
            
            {/* Progress steps */}
            <div className="mt-8 flex justify-between">
              <ProgressStep 
                number={1} 
                title="Issue Details" 
                isActive={currentStep === 1} 
                isCompleted={currentStep > 1} 
              />
              <ProgressStep 
                number={2} 
                title="Location & Evidence" 
                isActive={currentStep === 2} 
                isCompleted={currentStep > 2} 
              />
              <ProgressStep 
                number={3} 
                title="Contact Info" 
                isActive={currentStep === 3} 
                isCompleted={currentStep > 3} 
              />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Step 1: Issue Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Brief title of the issue"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>
                
                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <div className="space-y-2">
                    {severityLevels.map((level) => (
                      <div key={level.value} className="flex items-start">
                        <input
                          type="radio"
                          id={`severity-${level.value}`}
                          name="severity"
                          value={level.value}
                          checked={severity === level.value}
                          onChange={() => setSeverity(level.value)}
                          className="mt-1 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                        />
                        <label htmlFor={`severity-${level.value}`} className="ml-3">
                          <span className="block text-sm font-medium text-gray-700">{level.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.severity && <p className="mt-1 text-sm text-red-600">{errors.severity}</p>}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe the issue in detail..."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
              </div>
            )}
            
            {/* Step 2: Location & Evidence */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Location
                  </label>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    {isLoadingLocation ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 text-sky-600 animate-spin mr-2" />
                        <span>Detecting your location...</span>
                      </div>
                    ) : coordinates ? (
                      <div className="flex items-start">
                        <MapPin className="text-sky-600 w-5 h-5 mt-1 flex-shrink-0" />
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-800">
                            {address || 'Location detected'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Coordinates: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-700">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <span>{locationError || 'Location not detected'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={fetchLocation}
                      className="px-4 py-2 border border-sky-600 text-sky-600 rounded-lg hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {coordinates ? 'Refresh Location' : 'Detect My Location'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => document.getElementById('address-input')?.focus()}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors flex items-center"
                    >
                      Enter Manually
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="address-input" className="block text-sm font-medium text-gray-700 mb-1">
                      Address (Manual Entry)
                    </label>
                    <textarea
                      id="address-input"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      rows={2}
                      placeholder="Enter the full address where the issue is located"
                    />
                  </div>
                  
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images (Optional)
                  </label>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-sky-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <Upload className="w-10 h-10 text-sky-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-700">Click to upload images</p>
                    <p className="text-xs text-gray-500 mt-1">
                      You can upload multiple images (Max 5MB each)
                    </p>
                  </div>
                  
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {images.map((src, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={src}
                            alt={`Uploaded ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                  <Info className="text-sky-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-sky-800">Why include images?</h4>
                    <p className="text-sm text-sky-700 mt-1">
                      Clear photos help authorities understand the problem's severity and exact nature,
                      leading to faster and more accurate resolution.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 flex items-start">
                  <Info className="text-amber-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-amber-800">Privacy Notice</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Your contact information will only be used to update you on your complaint's progress
                      and will not be shared with third parties.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Previous
                </button>
              ) : (
                <div></div> // Empty div to maintain layout
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="px-5 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors flex items-center"
                >
                  Next Step
                  <ArrowRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Complaint'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface ProgressStepProps {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

const ProgressStep: React.FC<ProgressStepProps> = ({ number, title, isActive, isCompleted }) => {
  return (
    <div className="flex flex-col items-center w-1/3">
      <div 
        className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 transition-colors ${
          isCompleted 
            ? 'bg-sky-300 text-sky-800' 
            : isActive 
              ? 'bg-white text-sky-700' 
              : 'bg-sky-800 text-sky-300'
        }`}
      >
        {isCompleted ? <Check /> : number}
      </div>
      <span className={`text-sm ${isActive || isCompleted ? 'text-white' : 'text-sky-200'}`}>
        {title}
      </span>
    </div>
  );
};

const Check: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export default ComplaintForm;