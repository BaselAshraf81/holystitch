import React from 'react';
import type { Metadata } from 'next';
import TopNavBar from '../../components/TopNavBar';
import HeroSectionPricingPlan from '../../components/HeroSectionPricingPlan';
import PricingGrid from '../../components/PricingGrid';
import CompareTable from '../../components/CompareTable';
import FAQSection from '../../components/FAQSection';
import BoldFooterCTA from '../../components/BoldFooterCTA';
import FooterPricingPlan from '../../components/FooterPricingPlan';

export const metadata: Metadata = {
  title: 'Pricing Plan',
};

export default function Page() {
  return (
    <>
<TopNavBar />
<main className="pt-32">
<HeroSectionPricingPlan />
<PricingGrid />
<CompareTable />
<FAQSection />
<BoldFooterCTA />
</main>
<FooterPricingPlan />
</>
  );
}
