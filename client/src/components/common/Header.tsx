import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate(); 

    const handleLoginClick = () => {
        navigate('/login'); 
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };
    
    return <div className="flex justify-between bg-gray-600 items-center p-2 text-2xl font-bold">
        <div>logo</div>
        <div>website</div>
        <div >
            <Button  className="mx-2" onClick={handleLoginClick}>Login</Button>
            <Button onClick={handleSignUpClick}>SignUp</Button>
        </div>
    </div>
}

export default Header