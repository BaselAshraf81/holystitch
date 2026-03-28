'use client';

import React from 'react';
interface FinalCTAProps {}

export default function FinalCTA(_props: FinalCTAProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-8 mb-40">
      <div className="bg-gradient-to-br from-surface-container-low to-surface-container rounded-3xl p-12 md:p-24 text-center border border-outline-variant/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48">
        </div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary/5 rounded-full blur-[100px] -ml-48 -mb-48">
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 relative z-10">
          Stop managing.
          <br />
          Start architecting.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <button className="px-10 py-5 bg-on-surface text-surface rounded-xl font-black text-xl hover:scale-105 transition-transform">
            Get Started for Free
          </button>
          <button className="px-10 py-5 bg-transparent text-on-surface border border-outline-variant/30 rounded-xl font-bold text-xl hover:bg-surface-container-high transition-colors">
            Book a Demo
          </button>
        </div>
      </div>
    </section>
  );
}
