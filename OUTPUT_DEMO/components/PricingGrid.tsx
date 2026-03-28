import React from 'react';
import FreePlan from './FreePlan';
import ProPlan from './ProPlan';
import EnterprisePlan from './EnterprisePlan';
interface PricingGridProps {}

export default function PricingGrid(_props: PricingGridProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
      <FreePlan />
      <ProPlan />
      <EnterprisePlan />
    </section>
  );
}
