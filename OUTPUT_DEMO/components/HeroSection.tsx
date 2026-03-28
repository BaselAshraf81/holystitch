'use client';

import React from 'react';
interface HeroSectionProps {}

export default function HeroSection(_props: HeroSectionProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-8 text-center mb-32">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/20 mb-8 scale-95 md:scale-100">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse">
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Version 4.0 is now live
        </span>
      </div>
      <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-glow">
        Architect the
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-tertiary">
          future of scale.
        </span>
      </h1>
      <p className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl leading-relaxed mb-12 font-medium">
        Obsidian is the command center for high-performance engineering teams. Precision-engineered for clarity, speed, and architectural integrity.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold text-lg shadow-lg shadow-primary/10 hover:scale-[0.98] transition-transform">
          Build your workspace
        </button>
        <button className="w-full sm:w-auto px-8 py-4 bg-surface-container border border-outline-variant/30 text-on-surface rounded-xl font-bold text-lg hover:bg-surface-container-high transition-colors">
          Watch the film
        </button>
      </div>
    </section>
  );
}
