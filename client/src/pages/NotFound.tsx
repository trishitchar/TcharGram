import { Button } from '@/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToHomepage = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <Button onClick={handleGoToHomepage} className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
        Go to Login Page
      </Button>
    </div>
  );
};

export default NotFound;
