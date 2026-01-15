import { LuImageOff } from "react-icons/lu";
import useImageFallback from "../../hooks/useImageFallback";
import { memo } from "react";

const ProductImage = ({
  src,
  alt,
  size = 18,
  className,
  cover = "contain",
}) => {
  const { render } = useImageFallback(src, {
    fallbackSrc: "",
    fallbackIcon: LuImageOff,
  });

  return render({
    alt,
    className: `w-${size} h-${size} object-${cover} rounded-md ${
      className || ""
    }`,
  });
};
export default memo(ProductImage);
