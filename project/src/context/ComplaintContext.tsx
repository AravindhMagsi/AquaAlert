import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    } | null;
  };
  images: string[];
  status: 'pending' | 'under-review' | 'in-progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  contactDetails: {
    name: string;
    email: string;
    phone: string;
  };
};

type ComplaintContextType = {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => string;
  getComplaint: (id: string) => Complaint | undefined;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
};

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const savedComplaints = localStorage.getItem('complaints');
    if (savedComplaints) {
      try {
        const parsed = JSON.parse(savedComplaints);
        return parsed.map((complaint: any) => ({
          ...complaint,
          createdAt: new Date(complaint.createdAt),
          updatedAt: new Date(complaint.updatedAt)
        }));
      } catch (e) {
        console.error('Error parsing saved complaints', e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }, [complaints]);

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const id = uuidv4();
    
    const newComplaint: Complaint = {
      ...complaintData,
      id,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };
    
    setComplaints(prev => [...prev, newComplaint]);
    return id;
  };

  const getComplaint = (id: string) => {
    return complaints.find(complaint => complaint.id === id);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id 
          ? { ...complaint, status, updatedAt: new Date() } 
          : complaint
      )
    );
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, getComplaint, updateComplaintStatus }}>
      {children}
    </ComplaintContext.Provider>
  );
};