import React from 'react';
import type { Metadata } from 'next';
import TopNavBar from '../components/TopNavBar';
import HeroSection from '../components/HeroSection';
import ProductPreviewImage from '../components/ProductPreviewImage';
import CustomerLogos from '../components/CustomerLogos';
import BentoGridFeatures from '../components/BentoGridFeatures';
import HighFidelityUIShowcase from '../components/HighFidelityUIShowcase';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Linear Kinetic Landing Page',
};

export default function Page() {
  return (
    <>
<TopNavBar />
<main className="pt-32">
<HeroSection />
<ProductPreviewImage />
<CustomerLogos />
<BentoGridFeatures />
<HighFidelityUIShowcase />
<FinalCTA />
</main>
<Footer />
</>
  );
}
