import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  profilePicture?: string; 
}

const SuggestionPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchSuggestedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/testsuggested');
      setUsers(response.data.users); 
      console.log()
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, [users]);

  return (
    <div className="w-80 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
          <div>
            <p className="font-semibold">trishit.char</p>
            <p className="text-sm text-gray-500">Trishit Char</p>
          </div>
        </div>
        <button className="text-blue-500">Switch</button>
      </div>
      <div>
        <p className="font-semibold text-gray-500 mb-2">Suggested for you</p>
        <ul className="space-y-3">
          {users.map((user) => (
            <li key={user._id} className="flex items-center justify-between">
              <div className="flex items-center">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                )}
                <p>{user.username}</p>
              </div>
              <button className="text-blue-500">Follow</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuggestionPage;
