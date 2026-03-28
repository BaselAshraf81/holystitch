'use client';

import React from 'react';
interface Entry1Props {
  // Potential prop: title (currently "Architectural Core Refactor")
  // Potential prop: imageSrc — replace hardcoded Stitch image URLs
}

export default function Entry1(_props: Entry1Props) {
  return (
    <section className="relative mb-32 group">
      <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
        {/* Desktop Center Node */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-8 ring-background group-hover:ring-primary/20 transition-all duration-300">
        </div>
        <div className="md:w-1/2 md:pr-16 md:text-right">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-2 block">
            March 14, 2024
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">
            Architectural Core Refactor
          </h2>
        </div>
        <div className="md:w-1/2 md:pl-16 mt-2 md:mt-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-primary-container/20 text-primary border border-primary/30">
            v4.1.0
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <p className="text-on-surface-variant leading-relaxed mb-4">
              We've completely overhauled the database indexing engine. Queries are now up to 40% faster on large datasets.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]">
                </span>
                <span>
                  Parallel execution for complex schema migrations.
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]">
                </span>
                <span>
                  New memory-mapped storage engine for hot paths.
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]">
                </span>
                <span>
                  Native support for WASM plugins in the runtime.
                </span>
              </li>
            </ul>
          </div>
          <button className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-on-surface transition-colors self-start">
            Read technical deep-dive
            <span className="material-symbols-outlined text-sm">
            </span>
          </button>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-xl bg-surface-container shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none">
            </div>
            <img className="w-full aspect-video object-cover" alt="Technical code editor interface showing high-performance database optimization metrics and performance charts in a dark mode UI dashboard." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnbgKF9mQSgB5XwzvdT_HDHk8ODR-a3f04aDGGwVZhPVijo8r6-wqpiBG1tcMmTQFfUq1TvBfvkNlJffd1WCUEyX8ioy-2eDXLbhntH7CxBkFNxpR-uXKndacP0tKW_wcl01G2IgnNYG96iOYwX4VlfBaPvdXNlaCLoounBZFrA6KBL1UfHcgxDllMv_PLfvHMiUDeqS8PePg4TpjFMM4pY_EsNaMsEISch72kIXTCpTR8018d3izyjn-o6b8XqYMKKvVZhnuJ6X30" />
          </div>
        </div>
      </div>
    </section>
  );
}
