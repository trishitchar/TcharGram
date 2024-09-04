import React from 'react'

const MainFeed:React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto mt-8">
        <div className="flex space-x-4 mb-4 overflow-x-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
          ))}
        </div>
        <div className="bg-white border rounded-md mb-4">
          <div className="p-4">
            <p className="font-semibold">narentravelgram and 2 others • 1 d</p>
            <p>Jaipur, Rajasthan</p>
          </div>
          <img src="/api/placeholder/600/600" alt="Post" className="w-full" />
          <div className="p-4">
            <div className="flex space-x-4 mb-2">
              <button>Like</button>
              <button>Comment</button>
              <button>Share</button>
            </div>
            <p>4,075 likes</p>
            <p><strong>narentravelgram</strong> #hellofrom Jaipur ❤️</p>
            <p className="text-gray-500">View all 10 comments</p>
            <input type="text" placeholder="Add a comment..." className="w-full mt-2" />
          </div>
        </div>
        <div className="bg-white border rounded-md mb-4">
          <div className="p-4">
            <p className="font-semibold">narentravelgram and 2 others • 1 d</p>
            <p>Jaipur, Rajasthan</p>
          </div>
          <img src="/api/placeholder/600/600" alt="Post" className="w-full" />
          <div className="p-4">
            <div className="flex space-x-4 mb-2">
              <button>Like</button>
              <button>Comment</button>
              <button>Share</button>
            </div>
            <p>4,075 likes</p>
            <p><strong>narentravelgram</strong> #hellofrom Jaipur ❤️</p>
            <p className="text-gray-500">View all 10 comments</p>
            <input type="text" placeholder="Add a comment..." className="w-full mt-2" />
          </div>
        </div>
        <div className="bg-white border rounded-md mb-4">
          <div className="p-4">
            <p className="font-semibold">narentravelgram and 2 others • 1 d</p>
            <p>Jaipur, Rajasthan</p>
          </div>
          <img src="/api/placeholder/600/600" alt="Post" className="w-full" />
          <div className="p-4">
            <div className="flex space-x-4 mb-2">
              <button>Like</button>
              <button>Comment</button>
              <button>Share</button>
            </div>
            <p>4,075 likes</p>
            <p><strong>narentravelgram</strong> #hellofrom Jaipur ❤️</p>
            <p className="text-gray-500">View all 10 comments</p>
            <input type="text" placeholder="Add a comment..." className="w-full mt-2" />
          </div>
        </div>
        <div className="bg-white border rounded-md mb-4">
          <div className="p-4">
            <p className="font-semibold">narentravelgram and 2 others • 1 d</p>
            <p>Jaipur, Rajasthan</p>
          </div>
          <img src="/api/placeholder/600/600" alt="Post" className="w-full" />
          <div className="p-4">
            <div className="flex space-x-4 mb-2">
              <button>Like</button>
              <button>Comment</button>
              <button>Share</button>
            </div>
            <p>4,075 likes</p>
            <p><strong>narentravelgram</strong> #hellofrom Jaipur ❤️</p>
            <p className="text-gray-500">View all 10 comments</p>
            <input type="text" placeholder="Add a comment..." className="w-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeed