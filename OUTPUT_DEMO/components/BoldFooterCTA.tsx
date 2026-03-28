'use client';

import React from 'react';
import BackgroundImageDecoration from './BackgroundImageDecoration';
interface BoldFooterCTAProps {
  // Potential prop: title (currently "Ready to deploy the future?")
}

export default function BoldFooterCTA(_props: BoldFooterCTAProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-8 mb-20">
      <div className="relative bg-surface-container-high py-20 px-8 text-center overflow-hidden">
        <BackgroundImageDecoration />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface mb-8">
            Ready to deploy the future?
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button className="px-8 py-4 bg-primary text-on-primary font-bold text-sm rounded-lg hover:scale-95 transition-transform duration-200">
              Get Started for Free
            </button>
            <button className="px-8 py-4 bg-transparent border border-outline-variant text-on-surface font-bold text-sm hover:bg-surface-container transition-colors">
              Talk to Engineering
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
