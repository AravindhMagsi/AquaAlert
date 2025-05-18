import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to alert page after 5 seconds
    const timer = setTimeout(() => {
      navigate(`/alert/${id}`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, navigate]);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Complaint Registered Successfully!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your complaint has been registered with ID: <br />
            <span className="font-mono font-medium text-gray-800">{id?.substring(0, 8)}</span>
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-blue-800 text-sm">
              We've sent a confirmation SMS to your registered phone number with tracking details.
            </p>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to tracking page in 5 seconds...
          </p>
          
          <button
            onClick={() => navigate(`/alert/${id}`)}
            className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center"
          >
            Track Complaint Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;