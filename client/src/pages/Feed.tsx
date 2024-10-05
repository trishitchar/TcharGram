import MainFeed from '@/components/middleFeed/MainFeed';
import SuggestionPage from '@/components/rightFeed/SuggestionPage';
import React from 'react';

const Feed: React.FC = () => {

  return (
    <div>
      <div className="flex h-screen bg-gray-50">
        <div className="flex flex-1">
          <MainFeed />
          <SuggestionPage />
        </div>
      </div>
    </div>
  );
};

export default Feed;