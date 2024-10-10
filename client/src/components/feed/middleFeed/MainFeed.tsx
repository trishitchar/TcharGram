import React from 'react'
import Stories from './Stories'
import Posts from './Posts'

const MainFeed:React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto mt-8">
        <Stories/>
        <Posts/>
      </div>
    </div>
  );
};

export default MainFeed