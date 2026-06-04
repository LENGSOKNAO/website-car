import { useLocation } from "react-router-dom";
import BrandBox from "@/components/brand/BrandBox";
import BrandOne from "@/components/brand/BrandOne";
import BrandSlider from "@/components/brand/BrandSlider";
import BrandTenSlider from "@/components/brand/BrandTenSlider";
import BrandTriple from "@/components/brand/BrandTriple";
import BrandOneLeft from "@/components/brand/BrandOneLeft";
import { BRAND_PAGES } from "@/lib/constants";

export default function BrandPage() {
  const location = useLocation();

  const brandData =
    BRAND_PAGES.find((brand) => brand.route === location.pathname) ||
    BRAND_PAGES[0];

  return (
    <div className="space-y-8">
      <BrandSlider data={brandData} />
      <BrandTriple data={brandData} />
      <BrandOne data={brandData} />
      <BrandBox data={brandData} />
      <BrandOne data={brandData} />
      <BrandOneLeft data={brandData} />
      <BrandTenSlider data={brandData} />
    </div>
  );
}
