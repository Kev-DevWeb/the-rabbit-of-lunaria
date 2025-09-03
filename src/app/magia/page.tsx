"use client";
import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";
import StarBackground from "@/components/StarBackground";
import Grimoire from "@/components/Grimoire";

const MagiaPage = () => {
  return (
    <div className="bg-black">
      <StarBackground />
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center text-white pt-32">
        <Grimoire />
      </main>
      <AppFooter />
    </div>
  );
};

export default MagiaPage;