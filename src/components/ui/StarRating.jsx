import { LuStar, LuStarHalf } from "react-icons/lu";

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <LuStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <LuStarHalf key="half" className="w-4 h-4 text-yellow-400 fill-current" />
    );
  }

  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<LuStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default StarRating;
