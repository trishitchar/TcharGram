// src/pages/Landing.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthMiddleware } from '@/middleware/useAuthMiddleware';

const Landing: React.FC = () => {
    // useAuthMiddleware()
    const navigate = useNavigate(); 

    const handleLoginClick = () => {
        navigate('/login'); 
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between bg-gray-500">
        <div>logo</div>
        <div>sitename</div>
        <div>
          <Button onClick={handleLoginClick}>Login</Button>
          <Button onClick={handleSignUpClick}>SignUp</Button>
        </div>
      </div>
      <div className="bg-pink-400">
        <div>
          main content in short
        </div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo aliquam ut laborum deserunt hic minus natus laudantium fugiat animi? Quidem fuga itaque praesentium voluptatum nam, est fugit dolore repellendus vitae?34 Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat maiores quidem consequuntur fuga modi, veritatis voluptates aut officia? Officia pariatur mollitia voluptates expedita veniam ab neque eos quae dolor! Qui nesciunt nobis sed deleniti, ratione natus necessitatibus nulla. Voluptatibus natus aspernatur aliquam suscipit neque molestiae rerum, quaerat repellat veniam ad illo. Odit quam repellendus autem!
        </div>
      </div>
      <div>footer</div>
    </div>
  );
};

export default Landing;
