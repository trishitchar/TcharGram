import React from "react";

const Stories: React.FC = ()=> {
    return (
        <div className="flex space-x-4 mb-4 overflow-x-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
          ))}
        </div>
    )
}

export default Stories;