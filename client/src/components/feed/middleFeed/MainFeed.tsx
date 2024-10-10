import React from 'react';
import Stories from './Stories';
import Posts from './Posts';

const MainFeed: React.FC = () => {
  return (
    <div className="space-y-4">
      <Stories />
      <Posts />
    </div>
  );
};

export default MainFeed;