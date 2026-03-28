'use client';

import React from 'react';
interface EnterprisePlanProps {
  // Potential prop: title (currently "Enterprise")
}

export default function EnterprisePlan(_props: EnterprisePlanProps) {
  return (
    <div className="bg-surface-container-low p-8 flex flex-col h-full border border-outline-variant/10">
      <div className="mb-8">
        <h3 className="text-on-surface text-xl font-bold tracking-tight mb-2">
          Enterprise
        </h3>
        <p className="text-on-surface-variant text-sm">
          Custom-built compliance and dedicated throughput.
        </p>
      </div>
      <div className="mb-8">
        <span className="text-4xl font-extrabold text-on-surface">
          Custom
        </span>
      </div>
      <ul className="space-y-4 mb-12 flex-grow">
        <li className="flex items-start gap-3 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-tertiary text-lg">
          </span>
          <span>
            SOC2 compliance package
          </span>
        </li>
        <li className="flex items-start gap-3 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-tertiary text-lg">
          </span>
          <span>
            Dedicated 24/7 technical lead
          </span>
        </li>
        <li className="flex items-start gap-3 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-tertiary text-lg">
          </span>
          <span>
            Custom multi-cloud peering
          </span>
        </li>
      </ul>
      <button className="w-full py-3 px-6 bg-surface-container-highest text-on-surface text-sm font-bold tracking-tight border border-outline-variant/30 hover:bg-surface-bright transition-colors">
        Contact Sales
      </button>
    </div>
  );
}
