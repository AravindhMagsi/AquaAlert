import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplet, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import HeroImage from '../components/home/HeroImage';
import { useComplaints } from '../context/ComplaintContext';

const HomePage: React.FC = () => {
  const { complaints } = useComplaints();
  
  // Calculate statistics
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending' || c.status === 'under-review').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'in-progress').length;
  
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-700 to-sky-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Report Water Issues <span className="text-sky-300">Instantly</span>
              </h1>
              <p className="text-xl mb-8 text-sky-100">
                Help us maintain our community's water infrastructure by reporting leaks,
                quality issues, and other water-related problems.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/complaint"
                  className="bg-white text-sky-800 hover:bg-sky-100 font-semibold py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  Report an Issue
                  <ArrowRight size={18} className="ml-2" />
                </Link>
                <a
                  href="#how-it-works"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-sky-800 font-semibold py-3 px-6 rounded-full transition-all flex items-center justify-center"
                >
                  Learn How It Works
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <HeroImage />
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="w-full h-16 md:h-24 bg-white wave-top"></div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              icon={<Droplet size={32} className="text-sky-600" />}
              title="Total Reports"
              value={totalComplaints}
              description="Water-related issues reported by citizens"
            />
            <StatCard 
              icon={<CheckCircle size={32} className="text-green-600" />}
              title="Issues Resolved"
              value={resolvedComplaints}
              description="Successfully addressed and fixed"
            />
            <StatCard 
              icon={<Clock size={32} className="text-amber-600" />}
              title="In Progress"
              value={inProgressComplaints + pendingComplaints}
              description="Currently being addressed by authorities"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Reporting water issues has never been easier. Follow these simple steps to help
              maintain our community's water infrastructure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProcessStep 
              number={1} 
              title="Report the Issue" 
              description="Fill out a simple form with details about the water issue you've encountered."
            />
            <ProcessStep 
              number={2} 
              title="Provide Evidence" 
              description="Upload photos and share your location to help us identify and address the problem."
            />
            <ProcessStep 
              number={3} 
              title="Track Progress" 
              description="Receive updates and track the status of your reported issue until resolution."
            />
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/complaint"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Report an Issue Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Types of Issues Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Types of Issues We Address</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our system is designed to handle various water-related concerns that affect
              our community. Here are some common issues you can report:
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <IssueCard 
              title="Water Leaks" 
              description="Report leaking pipes, hydrants, or any water wastage in public areas."
              icon={<Droplet className="h-10 w-10 text-sky-600" />}
            />
            <IssueCard 
              title="Water Quality" 
              description="Concerns about discoloration, odor, taste, or other quality issues."
              icon={<AlertTriangle className="h-10 w-10 text-amber-600" />}
            />
            <IssueCard 
              title="Drainage Problems" 
              description="Clogged drains, flooding, or improper water drainage in your area."
              icon={<Clock className="h-10 w-10 text-red-600" />}
            />
            <IssueCard 
              title="Infrastructure Damage" 
              description="Damaged water mains, meters, or other water infrastructure."
              icon={<Clock className="h-10 w-10 text-indigo-600" />}
            />
            <IssueCard 
              title="Service Disruption" 
              description="Report unexpected water outages or scheduled maintenance issues."
              icon={<Droplet className="h-10 w-10 text-purple-600" />}
            />
            <IssueCard 
              title="Conservation Concerns" 
              description="Report water waste or suggest water conservation improvements."
              icon={<AlertTriangle className="h-10 w-10 text-green-600" />}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-sky-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Report a Water Issue?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your reports help us maintain our community's water infrastructure and
            ensure clean, safe water for everyone.
          </p>
          <Link
            to="/complaint"
            className="bg-white text-sky-800 hover:bg-sky-100 font-semibold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
          >
            Report Now
          </Link>
        </div>
      </section>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transform transition hover:shadow-lg">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-3">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ number, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-2xl mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

interface IssueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const IssueCard: React.FC<IssueCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default HomePage;