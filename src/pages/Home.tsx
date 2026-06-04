import { motion } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import NewArrivalsBar from "@/components/home/NewArrivalsBar";
import BrowseByType from "@/components/home/BrowseByType";
import BrandsSection from "@/components/home/BrandsSection";
import StatsTrust from "@/components/home/StatsTrust";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import StepsSection from "@/components/home/StepsSection";
import TradeInBanner from "@/components/home/TradeInBanner";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import ReviewsSection from "@/components/home/ReviewsSection";
import AwardsBar from "@/components/home/AwardsBar";
import FAQSection from "@/components/home/FAQSection";
import CTABanner from "@/components/home/CTABanner";
import SubscribeSection from "@/components/home/SubscribeSection";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <HeroSection />
      <NewArrivalsBar />
      <BrowseByType />
      <BrandsSection />
      <StatsTrust />
      <ProductsShowcase />
      <StepsSection />
      <TradeInBanner />
      <FeaturesGrid />
      <ReviewsSection />
      <AwardsBar />
      <FAQSection />
      <CTABanner />
      <SubscribeSection />
    </motion.div>
  );
}
