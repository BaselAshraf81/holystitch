import React from 'react';
interface HeaderSectionProps {
  // Potential prop: title (currently "Changelog")
}

export default function HeaderSection(_props: HeaderSectionProps) {
  return (
    <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-4">
          Changelog
        </h1>
        <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
          The architectural record of Obsidian. Constant evolution, technical precision, and performance-first updates.
        </p>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant/10">
        <span className="material-symbols-outlined text-primary text-sm">
        </span>
        <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          Stay updated
        </span>
      </div>
    </header>
  );
}
