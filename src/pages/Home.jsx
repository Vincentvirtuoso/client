import React from "react";
import RecommendedProducts from "../section/home/RecommendedProducts";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="section">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Welcome to our shop
          </h1>
          <p className="text-gray-600 mb-8">
            Hand-picked products just for you.
          </p>

          <RecommendedProducts />
        </section>
      </main>
    </div>
  );
};

export default Home;
