import Header from '@/components/common/Header';
import Sidebar from '@/components/Sidebar';
// import { Sidebar } from 'lucide-react';
import React from 'react';

const Feed: React.FC = () => {

  return (
    <div className="feed-container">
      <Header/>
      welcome to insta feed
      {/* <Sidebar/> */}
      <Sidebar/>
    </div>
  );
};

export default Feed;