import React from "react";
import ProductCard from "../../components/common/ProductCard";
import products from "../../data/products";

const RecommendedProducts = () => {
  const [favorites, setFavorites] = React.useState(new Set());
  const [cart, setCart] = React.useState([]);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert(`Added "${product.name}" to cart!`);
  };

  const handleQuickView = (product) => {
    alert(`Quick view: ${product.name}`);
  };

  const handleToggleFavorite = (product) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(product.id)) {
      newFavorites.delete(product.id);
    } else {
      newFavorites.add(product.id);
    }
    setFavorites(newFavorites);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <a className="text-sm text-red-500 hover:underline" href="#">
          See all
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.has(product.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedProducts;
