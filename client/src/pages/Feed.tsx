import React from 'react';
import MainFeed from '@/components/feed/middleFeed/MainFeed';
import SuggestionPage from '@/components/feed/rightFeed/SuggestionPage';

const Feed: React.FC = () => {
  return (
    <div className="flex">

      <div className="w-full md:flex-1 h-screen overflow-y-auto pb-16 md:pb-0">
        <div className="max-w-[570px] mx-auto">
          <MainFeed />
        </div>
      </div>
      
      <div className="hidden md:block w-[320px] flex-shrink-0">
        <div className="fixed w-[320px]">
          <SuggestionPage />
        </div>
      </div>
    </div>
  );
};

export default Feed;


/*


import React from 'react';
import MainFeed from '@/components/feed/middleFeed/MainFeed';
import SuggestionPage from '@/components/feed/rightFeed/SuggestionPage';

const Feed: React.FC = () => {
  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="w-full max-w-[470px] md:mr-8">
        <MainFeed />
      </div>
      <div className="hidden lg:block w-[320px]">
        <SuggestionPage />
      </div>
    </div>
  );
};

export default Feed;

*/