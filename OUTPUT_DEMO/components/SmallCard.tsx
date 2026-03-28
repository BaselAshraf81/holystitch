import React from 'react';
interface SmallCardProps {
  // Potential prop: title (currently "Built for Speed")
}

export default function SmallCard(_props: SmallCardProps) {
  return (
    <div className="md:col-span-4 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 hover:border-primary/30 transition-colors">
      <div className="flex flex-col h-full">
        <span className="material-symbols-outlined text-tertiary mb-6 text-4xl">
        </span>
        <h3 className="text-3xl font-bold mb-4 tracking-tight">
          Built for Speed
        </h3>
        <p className="text-on-surface-variant leading-relaxed mb-8">
          Zero-latency interactions. Every action is performed in less than 50ms.
        </p>
        <div className="mt-auto p-6 bg-surface-container-highest/50 rounded-xl font-mono text-xs text-primary">
          <div className="flex justify-between mb-2">
            <span>
              query_time:
            </span>
            <span>
              0.002s
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span>
              render_pass:
            </span>
            <span>
              0.014s
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              status:
            </span>
            <span className="text-green-400">
              OPTIMIZED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
