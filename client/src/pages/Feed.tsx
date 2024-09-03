import Header from '@/components/common/Header';
import MainFeed from '@/components/MainFeed';
import Sidebar from '@/components/Sidebar';
// import { Sidebar } from 'lucide-react';
import React from 'react';

const Feed: React.FC = () => {

  return (
    <div className="feed-container flex flex-col" >
      <Header/>
      welcome to insta feed
      {/* <Sidebar/> */}
      <Sidebar/>
      <MainFeed/>
    </div>
  );
};

export default Feed;