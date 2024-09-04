import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userBaseURL } from "@/data/data";

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

    const handleLogoutClick =async () => {
        try {
            const response = await axios.get(`${userBaseURL}/logout`);
            console.log("response handlelogoutclick " + response)
        } catch (error) {
            
        }
    };
    
    return <div className="flex justify-between bg-gray-600 items-center p-2 text-2xl font-bold">
        <div>logo</div>
        <div>testing button</div>
        <div className="flex justify-between gap-2">
            <Button onClick={handleLoginClick}>Login</Button>
            <Button onClick={handleSignUpClick}>SignUp</Button>
            <Button onClick={handleFeedClick}>Feed</Button>
            <Button onClick={() => handleLogoutClick()}>Logout</Button>
        </div>
    </div>
}

export default Header