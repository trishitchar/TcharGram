import React from 'react'

const Post:React.FC = () => {
  return (
    <div className="bg-white border rounded-md mb-4">
          <div className="p-4 flex gap-3">
            <div className='w-8 h-8'>
                <img src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png"  alt="userIcon" className="w-full" />
            </div>
            <p className="font-semibold">trishit.char</p>
          </div>
            <div className='justify-center items-center w-full'>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png"  alt="userIcon" />
            </div>
          <div className="p-4">
            <div className="flex space-x-4 mb-2">
              <button>Like</button>
              <button>Comment</button>
              <button>Share</button>
            </div>
            <p>4,075 likes</p>
            <p><strong>trishitchar</strong> #hellofrom Jaipur ❤️</p>
            <p className="text-gray-500">View all 10 comments</p>
            <input type="text" placeholder="Add a comment..." className="w-full mt-2" />
          </div>
        </div>
  )
}

export default Post