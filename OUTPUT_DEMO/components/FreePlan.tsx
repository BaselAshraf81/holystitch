'use client';

import React from 'react';
interface FreePlanProps {
  // Potential prop: title (currently "Free")
}

export default function FreePlan(_props: FreePlanProps) {
  return (
    <div className="bg-surface-container-low p-8 flex flex-col h-full border border-outline-variant/10">
      <div className="mb-8">
        <h3 className="text-on-surface text-xl font-bold tracking-tight mb-2">
          Free
        </h3>
        <p className="text-on-surface-variant text-sm">
          For independent architects exploring the foundations.
        </p>
      </div>
      <div className="mb-8">
        <span className="text-4xl font-extrabold text-on-surface">
          $0
        </span>
        <span className="text-on-surface-variant text-sm font-medium">
          /mo
        </span>
      </div>
      <ul className="space-y-4 mb-12 flex-grow">
        <li className="flex items-start gap-3 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-lg">
          </span>
          <span>
            Single project instance
          </span>
        </li>
        <li className="flex items-start gap-3 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-lg">
          </span>
          <span>
            500MB storage capacity
          </span>
        </li>
        <li className="flex items-start gap-3 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-lg">
          </span>
          <span>
            Standard API latency
          </span>
        </li>
      </ul>
      <button className="w-full py-3 px-6 bg-surface-container-highest text-on-surface text-sm font-bold tracking-tight border border-outline-variant/30 hover:bg-surface-bright transition-colors">
        Start Building
      </button>
    </div>
  );
}
