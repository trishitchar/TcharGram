import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:8080/api/user/${id}/testprofile`);
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            setError(response.data.message);
          }
        } catch (error: any) {
          console.error('Profile fetch failed:', error);
          setError('Failed to fetch profile.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [id]);

  const handleLogout = () => {
    // Define the logout logic or function
    toast.success('Logged out successfully');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {error && <div className="text-red-500">{error}</div>}
      {user && (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          {/* Render more user information as needed */}
        </div>
      )}
      <Link to="/feed">Back to Feed</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
