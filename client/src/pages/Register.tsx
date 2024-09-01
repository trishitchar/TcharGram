import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/user/register',
        { username, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log(response);
      // Handle successful signup here (e.g., redirect, show success message)
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login'); // Redirect to login or another page upon successful signup
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error('Signup failed. Please try again.');
      setError('Signup failed. Please check your details and try again.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          placeholder="Username"
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
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
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
