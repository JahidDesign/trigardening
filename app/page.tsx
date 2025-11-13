
import Hero from "@/app/components/Hero";
import CategoryCard from "@/app/components/CategoryCard";
import Products from "@/app/components/Products";

export default function Home() {
  return (
    <>
    

      <main className="pt-20"> {/* top padding so navbar doesn’t overlap hero */}
        <Hero />

        {/* Shop by Category Section */}
        <section className="max-w-6xl mx-auto py-12 px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0E2D1B]">
            Shop by Category
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            <CategoryCard
              title="Plants"
              subtitle="Indoor & Outdoor Plants"
              icon="/images/icons/plant.svg"
            />
            <CategoryCard
              title="Medicine"
              subtitle="Natural Plant Care"
              icon="/images/icons/medicine.svg"
            />
            <CategoryCard
              title="Equipment"
              subtitle="Gardening Tools"
              icon="/images/icons/tool.svg"
            />
            <CategoryCard
              title="Fertilizers"
              subtitle="Safe Plant Protection"
              icon="/images/icons/fertilizer.svg"
            />
          </div>
        </section>
      </main>
      <Products />
    </>
  );
}
