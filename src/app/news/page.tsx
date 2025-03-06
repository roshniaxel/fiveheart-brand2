"use client";

import React, { useEffect, useState } from "react";
import { News } from "fiveheart-shared-library";

const NewsPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Articles:", data); // Debugging
        setArticles(data);
      })
      .catch((err) => console.error("Error fetching news", err));
  }, []);

  return (
    <div>
      <h1>Welcome to FiveHeart</h1>
      {articles.length > 0 ? <News articles={articles} /> : <p>Loading...</p>}
    </div>
  );
};

export default NewsPage;
