import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { CheckCircle2, Clock, AlertTriangle, Wrench, Loader2, ArrowLeft, MapPin } from 'lucide-react';

const statusConfig = {
  'pending': {
    icon: <Clock className="w-5 h-5 text-amber-500" />,
    color: 'bg-amber-100 text-amber-800',
    label: 'Pending Review',
    description: 'Your complaint has been received and is awaiting review by our team.'
  },
  'under-review': {
    icon: <AlertTriangle className="w-5 h-5 text-blue-500" />,
    color: 'bg-blue-100 text-blue-800',
    label: 'Under Review',
    description: 'Our team is currently reviewing your complaint and assessing the next steps.'
  },
  'in-progress': {
    icon: <Wrench className="w-5 h-5 text-indigo-500" />,
    color: 'bg-indigo-100 text-indigo-800',
    label: 'In Progress',
    description: 'Maintenance team has been dispatched and is working to resolve the issue.'
  },
  'resolved': {
    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    color: 'bg-green-100 text-green-800',
    label: 'Resolved',
    description: 'The reported issue has been successfully resolved. Thank you for your report!'
  }
};

// Simulated timeline events based on status
const generateTimeline = (status: string, createdAt: Date) => {
  const events = [];
  const createdDate = new Date(createdAt);
  
  // Always add the submission event
  events.push({
    title: 'Complaint Submitted',
    description: 'Your water issue report has been successfully submitted to our system.',
    timestamp: createdDate,
    isCompleted: true
  });
  
  // Add review event
  const reviewDate = new Date(createdDate);
  reviewDate.setHours(reviewDate.getHours() + 2);
  events.push({
    title: 'Initial Assessment',
    description: 'Our team will review your complaint and assess its severity and priority.',
    timestamp: reviewDate,
    isCompleted: ['under-review', 'in-progress', 'resolved'].includes(status)
  });
  
  // Add dispatch event
  const dispatchDate = new Date(reviewDate);
  dispatchDate.setHours(dispatchDate.getHours() + 24);
  events.push({
    title: 'Maintenance Team Dispatched',
    description: 'A team will be sent to inspect and address the reported issue.',
    timestamp: dispatchDate,
    isCompleted: ['in-progress', 'resolved'].includes(status)
  });
  
  // Add resolution event
  const resolutionDate = new Date(dispatchDate);
  resolutionDate.setHours(resolutionDate.getHours() + 48);
  events.push({
    title: 'Issue Resolution',
    description: 'The water issue will be fixed and the complaint will be marked as resolved.',
    timestamp: resolutionDate,
    isCompleted: status === 'resolved'
  });
  
  return events;
};

// Format date for display
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const AlertPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getComplaint, updateComplaintStatus } = useComplaints();
  const [complaint, setComplaint] = useState(id ? getComplaint(id) : undefined);
  const [loading, setLoading] = useState(true);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  
  // Simulated status updates for demo
  useEffect(() => {
    if (complaint) {
      setLoading(false);
      setTimelineEvents(generateTimeline(complaint.status, complaint.createdAt));
      
      // For demo purposes only - simulate status changes over time
      if (complaint.status === 'pending') {
        const timer = setTimeout(() => {
          updateComplaintStatus(complaint.id, 'under-review');
          setComplaint(getComplaint(complaint.id));
        }, 10000); // 10 seconds
        
        return () => clearTimeout(timer);
      }
      
      if (complaint.status === 'under-review') {
        const timer = setTimeout(() => {
          updateComplaintStatus(complaint.id, 'in-progress');
          setComplaint(getComplaint(complaint.id));
        }, 15000); // 15 seconds
        
        return () => clearTimeout(timer);
      }
      
      if (complaint.status === 'in-progress') {
        const timer = setTimeout(() => {
          updateComplaintStatus(complaint.id, 'resolved');
          setComplaint(getComplaint(complaint.id));
        }, 20000); // 20 seconds
        
        return () => clearTimeout(timer);
      }
    } else {
      setLoading(false);
    }
  }, [complaint, id, getComplaint, updateComplaintStatus]);
  
  // Re-generate timeline when status changes
  useEffect(() => {
    if (complaint) {
      setTimelineEvents(generateTimeline(complaint.status, complaint.createdAt));
    }
  }, [complaint]);
  
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-600 animate-spin" />
      </div>
    );
  }
  
  if (!complaint) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-lg py-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complaint Not Found</h1>
            <p className="text-gray-600 mb-6">
              The complaint you're looking for doesn't exist or may have been removed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const statusInfo = statusConfig[complaint.status];
  
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center mb-6 text-sky-600 hover:text-sky-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-sky-700 p-6 text-white">
              <h1 className="text-2xl font-bold">Complaint Status</h1>
              <p className="text-sky-100">
                Track the progress of your water issue report
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <span className="text-sm text-gray-500">Reference ID</span>
                <p className="font-mono text-lg font-medium">{complaint.id.substring(0, 8)}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{complaint.title}</h2>
                <p className="text-gray-700 mb-4">{complaint.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm">
                    {categories.find(c => c.value === complaint.category)?.label || complaint.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {severityLevels.find(s => s.value === complaint.severity)?.label.split(' - ')[0] || complaint.severity}
                  </span>
                </div>
                
                {complaint.location.address && (
                  <div className="flex items-start mb-4 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-2">{complaint.location.address}</span>
                  </div>
                )}
                
                {complaint.images.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Attached Images</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {complaint.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Report evidence ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Current Status */}
                <div className={`px-4 py-3 ${statusInfo.color} rounded-lg flex items-center mb-6`}>
                  {statusInfo.icon}
                  <div className="ml-3">
                    <h3 className="font-medium">{statusInfo.label}</h3>
                    <p className="text-sm">{statusInfo.description}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Name</span>
                        <p className="font-medium">{complaint.contactDetails.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Phone</span>
                        <p className="font-medium">{complaint.contactDetails.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="font-medium">{complaint.contactDetails.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Complaint Timeline</h3>
                  <div className="space-y-6">
                    {timelineEvents.map((event, index) => (
                      <div key={index} className="flex">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            event.isCompleted ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {event.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>
                          {index < timelineEvents.length - 1 && (
                            <div className={`w-0.5 h-14 ${
                              event.isCompleted ? 'bg-sky-300' : 'bg-gray-200'
                            }`}></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className={`font-medium ${
                            event.isCompleted ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {event.description}
                          </p>
                          <p className={`text-sm ${
                            event.isCompleted ? 'text-sky-600' : 'text-gray-400'
                          } mt-1`}>
                            {event.isCompleted ? 
                              `Completed on ${formatDate(event.timestamp)}` : 
                              `Expected by ${formatDate(event.timestamp)}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feedback or support */}
          
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Further Assistance?</h3>
            <p className="text-blue-700 mb-4">
              If you need updates or have questions about this complaint,
              please contact our support team with your reference ID.
            </p>
                     <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button className="px-4 py-2 bg-white text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                 <a href="https://twilio-fn92.onrender.com/">
                send Alert 
                   </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Categories for water issues (copied from ComplaintForm for reference)
const categories = [
  { value: 'leak', label: 'Water Leak' },
  { value: 'quality', label: 'Water Quality Issue' },
  { value: 'pressure', label: 'Low Water Pressure' },
  { value: 'drainage', label: 'Drainage Problem' },
  { value: 'infrastructure', label: 'Infrastructure Damage' },
  { value: 'service', label: 'Service Disruption' },
  { value: 'other', label: 'Other' }
];

// Severity levels (copied from ComplaintForm for reference)
const severityLevels = [
  { value: 'low', label: 'Low - Not urgent, can be fixed when convenient' },
  { value: 'medium', label: 'Medium - Should be addressed soon' },
  { value: 'high', label: 'High - Needs prompt attention' },
  { value: 'critical', label: 'Critical - Immediate action required' }
];

export default AlertPage;