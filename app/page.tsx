
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
              icon="https://i.ibb.co.com/pBhZq72z/tree6.jpg"
            />
            <CategoryCard
              title="Medicine"
              subtitle="Natural Plant Care"
              icon="https://i.ibb.co.com/7J9mryMP/tree2.jpg"
            />
            <CategoryCard
              title="Equipment"
              subtitle="Gardening Tools"
              icon="https://i.ibb.co.com/Gv625zmG/tree7.jpg"
            />
            <CategoryCard
              title="Fertilizers"
              subtitle="Safe Plant Protection"
              icon="https://i.ibb.co.com/G4zTZnjD/tree5.jpg"
            />
          </div>
        </section>
      </main>
      <Products />
    </>
  );
}
