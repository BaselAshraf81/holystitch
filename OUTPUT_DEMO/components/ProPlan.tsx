'use client';

import React from 'react';
interface ProPlanProps {
  // Potential prop: title (currently "Pro")
}

export default function ProPlan(_props: ProPlanProps) {
  return (
    <div className="relative bg-surface-container p-10 flex flex-col h-full border-2 border-primary-container shadow-2xl shadow-primary-container/20 overflow-hidden">
      <div className="absolute top-0 right-0 bg-primary-container text-on-primary-container px-4 py-1 text-[10px] font-black tracking-widest uppercase">
        Most Preferred
      </div>
      {/* Subtle Gradient Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none">
      </div>
      <div className="mb-8 relative z-10">
        <h3 className="text-on-surface text-2xl font-bold tracking-tight mb-2">
          Pro
        </h3>
        <p className="text-on-surface-variant text-sm">
          Engineered for high-performance squads and scaling apps.
        </p>
      </div>
      <div className="mb-8 relative z-10">
        <span className="text-5xl font-extrabold text-on-surface">
          $49
        </span>
        <span className="text-on-surface-variant text-sm font-medium">
          /mo
        </span>
      </div>
      <ul className="space-y-4 mb-12 flex-grow relative z-10">
        <li className="flex items-start gap-3 text-sm text-on-surface">
          <span className="material-symbols-outlined text-primary text-lg" style={{fontVariationSettings: "'FILL' 1"}}>
          </span>
          <span className="font-semibold">
            Unlimited active projects
          </span>
        </li>
        <li className="flex items-start gap-3 text-sm text-on-surface">
          <span className="material-symbols-outlined text-primary text-lg">
          </span>
          <span>
            25GB SSD storage allocation
          </span>
        </li>
        <li className="flex items-start gap-3 text-sm text-on-surface">
          <span className="material-symbols-outlined text-primary text-lg">
          </span>
          <span>
            Priority edge-network routing
          </span>
        </li>
        <li className="flex items-start gap-3 text-sm text-on-surface">
          <span className="material-symbols-outlined text-primary text-lg">
          </span>
          <span>
            Advanced telemetry dashboard
          </span>
        </li>
      </ul>
      <button className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary text-sm font-bold tracking-tight rounded-md hover:opacity-90 transition-opacity relative z-10">
        Deploy Now
      </button>
    </div>
  );
}
