import React from 'react';
interface LargeCard2Props {
  // Potential prop: title (currently "Immutable Security")
  // Potential prop: imageSrc — replace hardcoded Stitch image URLs
}

export default function LargeCard2(_props: LargeCard2Props) {
  return (
    <div className="md:col-span-8 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 hover:border-primary/30 transition-colors group">
      <div className="flex items-center justify-between gap-12 flex-col md:flex-row h-full">
        <div className="flex-1">
          <span className="material-symbols-outlined text-primary mb-6 text-4xl">
          </span>
          <h3 className="text-3xl font-bold mb-4 tracking-tight">
            Immutable Security
          </h3>
          <p className="text-on-surface-variant leading-relaxed">
            Enterprise-grade encryption that never compromises on performance. Your data, locked in obsidian.
          </p>
        </div>
        <div className="flex-1 w-full h-full min-h-[200px] bg-surface-container rounded-xl overflow-hidden">
          <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-40" alt="Digital representation of secure data encryption with neon blue geometric shapes and glowing hardware circuits" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWZXJX2VrnegVW3aWG3mGwXklbXNg1JCPj0PJGV8CIpuXXJLIxGOvZYOoss8-64u1MmHt06zz1HICciOA4fTNRrAh5k5VnqLEYpfqMEOaTdQLz4Lei9cHjtApt3Q3Fe9qAzvtLOR4Oo65G1rXo1aZf4vRy2hsHvqmWP_vvK755TFp_CofjmJ490njRuWbX4KW-hK20pUTC5GD8De_utN_e-MrLq6RrS-Xy8M9qQ-_FX52f9OWf23CopmW2Sastv9QdLAxGotopPuPb" />
        </div>
      </div>
    </div>
  );
}
