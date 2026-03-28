'use client';

import React from 'react';
interface FinalCTAChangelogProps {
  // Potential prop: title (currently "Ready to build?")
}

export default function FinalCTAChangelog(_props: FinalCTAChangelogProps) {
  return (
    <div className="mt-40 text-center">
      <div className="inline-block p-12 bg-surface-container-low rounded-2xl border border-outline-variant/10 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors">
        </div>
        <h3 className="text-3xl font-bold mb-4 tracking-tight">
          Ready to build?
        </h3>
        <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">
          Join 10k+ architects building the next generation of performance tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
            Get Started
          </button>
          <button className="bg-surface-container-high text-on-surface px-8 py-3 rounded-lg font-semibold border border-outline-variant/30 hover:bg-surface-variant transition-colors">
            View Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}
