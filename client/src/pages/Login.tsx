import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/slices/authSlice';
import { login } from '@/api/user.api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('testuser@tc');
  const [password, setPassword] = useState('Tchar');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login(email,password);

      if (response.success) {
        toast.success(response.message);
        const { token, user } = response;
        dispatch(setAuthUser(user))
        localStorage.setItem('token', token);
        navigate('/feed');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials and try again.');
      setError('Login failed. Please check your credentials and try again');
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
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-purple-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </Button>
              </div>
            </form>
            <p className='mt-2 cursor-pointer hover:text-blue-800' onClick={() => navigate('/register')}>Do not have any account? Sign up</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;