import About from "../pages/Landing/About";
import AdvancedFeatures from "../pages/Landing/AdvancedFeatures";
import BenefitsSection from "../pages/Landing/BenefitsSection";
import CountrySlider from "../pages/Landing/CountrySlider";
import CryptoMiningMarketplace from "../pages/Landing/CryptoMiningMarketplace";
import DecentralizedFuture2 from "../pages/Landing/DecentralizedFuture2";
import EarnCard from "../pages/Landing/EarnCard";
import FAQSection from "../pages/Landing/FAQSection";
import FeatureSection from "../pages/Landing/FeatureSection";
import HeroSection from "../pages/Landing/HeroSection";
import { Footer } from "../pages/Landing/Navigation/Footer";
import Navbar from "../pages/Landing/Navigation/Navbar";
import NextGenSection from "../pages/Landing/NextGenSection";
import OurTopIntegration from "../pages/Landing/OurTopIntegration";
import ProductSection from "../pages/Landing/ProductSection";
import ServiceSection from "../pages/Landing/ServiceSection";
import Testimonials from "../pages/Landing/Testimonials";
import Whyprestorix from "../pages/Landing/Whyprestorix";

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar/>
      <main>
        <HeroSection />
        <CountrySlider />
        <Whyprestorix />

        <div className="w-full text-white bg-white">
          <OurTopIntegration />
          {/* <CryptoMiningMarketplace /> */}
          <div className="p-5">
            {/* <ProductSection/> */}
          </div>
          <ServiceSection />

          <FeatureSection />




          <About />
          {/* <EarnCard/> */}
          <AdvancedFeatures />
          <BenefitsSection />

          <NextGenSection />
          <Testimonials />
          <DecentralizedFuture2 />
          <FAQSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
