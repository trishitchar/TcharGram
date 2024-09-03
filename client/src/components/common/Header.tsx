import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate(); 

    const handleLoginClick = () => {
        navigate('/login'); 
    };

    const handleSignUpClick = () => {
        navigate('/register');
    };

    const handleFeedClick = () => {
        navigate('/feed');
    };

    // const handleSignUpClick = () => {
    //     navigate('/signup');
    // };
    
    return <div className="flex justify-between bg-gray-600 items-center p-2 text-2xl font-bold">
        <div>logo</div>
        <div>testing button</div>
        <div className="flex justify-between gap-2">
            <Button onClick={handleLoginClick}>Login</Button>
            <Button onClick={handleSignUpClick}>SignUp</Button>
            <Button onClick={handleFeedClick}>Feed</Button>
        </div>
    </div>
}

export default Header