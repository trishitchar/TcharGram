// import Header from '@/components/common/Header';
import Header from '@/components/common/Header';
import MainFeed from '@/components/middleFeed/MainFeed';
import Sidebar from '@/components/Sidebar';
import SuggestionPage from '@/components/SuggestionPage';
// import { Sidebar } from 'lucide-react';
import React from 'react';

const Feed: React.FC = () => {

  return (
    <div>
      <Header/>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1">
          <MainFeed />
          <SuggestionPage />
        </div>
      </div>
    </div>
  );
};

export default Feed;