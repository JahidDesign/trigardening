// src/components/ProductCard.tsx
import Image from "next/image";

interface ProductCardProps {
  id?: number;
  image: string;
  name: string;
  price: string;
  oldPrice?: string;
  rating?: number;
}

export default function ProductCard({
  image,
  name,
  price,
  oldPrice,
  rating = 5,
}: ProductCardProps) {
  // Ensure rating stays within 0–5
  const safeRating = Math.max(0, Math.min(5, rating));

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden w-[240px]">
      {/* Product Image */}
      <div className="w-full h-40 relative">
        <Image
          src={image}
          alt={name}
          fill
          sizes="240px"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Product Info */}
      <div className="p-4 text-center">
        <h3 className="font-semibold text-pine">{name}</h3>

        {/* Price Section */}
        <div className="mt-2 text-sm text-gray-700 flex justify-center gap-2">
          <span className="text-orange-500 font-bold">{price}</span>
          {oldPrice && (
            <span className="line-through text-gray-400">{oldPrice}</span>
          )}
        </div>

        {/* Rating Stars */}
        <div className="flex justify-center mt-2 text-yellow-500">
          {"★".repeat(safeRating)}
          {"☆".repeat(5 - safeRating)}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-center gap-2">
          <button className="bg-accent text-white px-4 py-2 rounded-full text-sm hover:opacity-90 transition">
            Add to Cart
          </button>
          <button className="border border-accent text-accent px-4 py-2 rounded-full text-sm hover:bg-accent hover:text-white transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
