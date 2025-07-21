import React, { createContext, useEffect, useState } from "react";

const RecentlyWatchedContext = createContext();

export const RecentlyWatchedProvider = ({ children }) => {
  const [recentlyWatched, setRecentlyWatched] = useState(() => {
    const stored = sessionStorage.getItem("recentlyWatched");
    return stored ? JSON.parse(stored) : [];
  });

  const addToRecentlyWatched = (product) => {
    setRecentlyWatched((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 4); 
      sessionStorage.setItem("recentlyWatched", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <RecentlyWatchedContext.Provider value={{ recentlyWatched, addToRecentlyWatched }}>
      {children}
    </RecentlyWatchedContext.Provider>
  );
};

export default RecentlyWatchedContext;
