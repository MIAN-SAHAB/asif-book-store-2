import { Preloader } from "@/components/Preloader";
import { Header } from "@/components/header/Header";
import { AccountModal } from "@/components/overlays/AccountModal";
import { CartDrawer } from "@/components/overlays/CartDrawer";
import { SearchModal } from "@/components/overlays/SearchModal";
import { SizeGuideModal } from "@/components/overlays/SizeGuideModal";
import { Toast } from "@/components/overlays/Toast";
import { TrackOrderModal } from "@/components/overlays/TrackOrderModal";
import { Bookshelf } from "@/components/sections/Bookshelf";
import { BooksCatalog } from "@/components/sections/BooksCatalog";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { SchoolFinder } from "@/components/sections/SchoolFinder";
import { TrustSection } from "@/components/sections/TrustSection";
import { UniformsCatalog } from "@/components/sections/UniformsCatalog";
import { ButtonFx } from "@/components/ui/ButtonFx";
import { StoreProvider } from "@/context/StoreContext";

export default function Home() {
  return (
    <StoreProvider>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <SchoolFinder />
        <Bookshelf />
        {/* <BooksCatalog /> */}
        {/* <UniformsCatalog /> */}
        <TrustSection />
      </main>
      <Footer />
      <CartDrawer />
      <SizeGuideModal />
      <TrackOrderModal />
      <SearchModal />
      <AccountModal />
      <Toast />
      <ButtonFx />
    </StoreProvider>
  );
}
