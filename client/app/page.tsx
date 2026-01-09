"use client";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [data, setData] = useState("Data is loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = await fetch("http://localhost:8000/");
        const res = await api.json();
        if (!res.success) {
          setData("Failed to fetch data from server");
        }
        setData(res.message);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>{data}</h1>
    </div>
  );
};

export default Home;
