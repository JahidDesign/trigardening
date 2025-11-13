// src/components/CategoryCard.tsx
import Image from "next/image";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  icon: string;
}

export default function CategoryCard({ title, subtitle, icon }: CategoryCardProps) {
  return (
    <div className="bg-leaf/10 text-center rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-[1.03] transition-transform duration-200 cursor-pointer w-56">
      {/* Icon */}
      <div className="w-16 h-16 mx-auto flex items-center justify-center bg-white rounded-full shadow">
        <img src={icon} alt={`${title} icon`} width={36} height={36} />
      </div>

      {/* Title & Subtitle */}
      <h3 className="mt-4 text-lg font-semibold text-pine">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
    </div>
  );
}
