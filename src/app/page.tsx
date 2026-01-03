import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";
import Footer from "@/components/home/Footer";

export default async function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
