import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import ComplaintForm from './pages/ComplaintForm';
import AlertPage from './pages/AlertPage';
import SuccessPage from './pages/SuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ComplaintProvider } from './context/ComplaintContext';

function App() {
  return (
    <ComplaintProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/complaint" element={<ComplaintForm />} />
              <Route path="/success/:id" element={<SuccessPage />} />
              <Route path="/alert/:id" element={<AlertPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ComplaintProvider>
  );
}

export default App;