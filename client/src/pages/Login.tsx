import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import { userBaseURL } from '@/data/data';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${userBaseURL}/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log(response)
      if (response.data.success) {
        toast.success(response.data.message);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        // console.log(token)

        console.log(user);
        navigate('/feed');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials and try again.');
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <div>

    
      <Header/>
    <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <Input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      </div>
    </div>
  );
};

export default Login;
