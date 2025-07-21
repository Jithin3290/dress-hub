import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import RecentlyWatchedContext from "../../Context/RecentlyWatchedContext";

function RecentlyWatched() {
  const { recentlyWatched } = useContext(RecentlyWatchedContext);
  const navigate = useNavigate();

  if (!recentlyWatched || recentlyWatched.length === 0) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Recently Watched</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {recentlyWatched.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg h-100 shadow hover:shadow-md cursor-pointer transition"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-78 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold truncate">{item.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentlyWatched;
