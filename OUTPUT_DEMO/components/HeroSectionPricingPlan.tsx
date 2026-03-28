import React from 'react';
interface HeroSectionPricingPlanProps {}

export default function HeroSectionPricingPlan(_props: HeroSectionPricingPlanProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-8 mb-20 text-center">
      <span className="inline-block px-3 py-1 bg-surface-container border border-outline-variant/20 rounded-full text-[10px] font-semibold tracking-[0.1em] text-primary uppercase mb-6">
        Transparent Architecture
      </span>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-6 leading-tight">
        Plans for the
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">
          Precision-Minded
        </span>
        .
      </h1>
      <p className="text-on-surface-variant text-lg max-w-2xl mx-auto font-medium">
        Infrastructure built for scale, designed for speed. Choose the environment that fits your deployment lifecycle.
      </p>
    </section>
  );
}
