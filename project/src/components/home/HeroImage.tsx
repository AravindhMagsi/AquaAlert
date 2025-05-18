import React from 'react';

const HeroImage: React.FC = () => {
  return (
    <div className="relative w-full max-w-md">
      <img 
        src="https://img.freepik.com/premium-vector/waste-water-unnecessarily-hand-closes-tap-saving-water-world-water-day_530733-2626.jpg" 
        alt="Water infrastructure" 
        className="w-full h-auto rounded-lg shadow-xl"
      />
      <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg animate-bounce-slow">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-600 font-semibold">100% Success Rate</span>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg animate-pulse-slow">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
          <span className="text-sky-600 font-semibold">24/7 Support</span>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;