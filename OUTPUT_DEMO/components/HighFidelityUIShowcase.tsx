import React from 'react';
interface HighFidelityUIShowcaseProps {
  // Potential prop: imageSrc — replace hardcoded Stitch image URLs
}

export default function HighFidelityUIShowcase(_props: HighFidelityUIShowcaseProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-8 mb-40">
      <div className="flex flex-col md:flex-row items-center gap-20">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter">
            Precision in
            <br />
            Every Pixel.
          </h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                </span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">
                  Layered Organization
                </h4>
                <p className="text-on-surface-variant text-sm">
                  Deep nesting without the clutter. Manage complex hierarchies with intuitive spatial layouts.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 flex-shrink-0 bg-tertiary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">
                </span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">
                  Infinite Versioning
                </h4>
                <p className="text-on-surface-variant text-sm">
                  Travel back in time. Every change is indexed and reversible with a single click.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 flex-shrink-0 bg-primary-container/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container">
                </span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">
                  Real-time Synergy
                </h4>
                <p className="text-on-surface-variant text-sm">
                  See who is building what, where. No more merge conflicts or duplicated efforts.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-tertiary/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200">
            </div>
            <div className="relative bg-surface-container-low rounded-2xl border border-outline-variant/20 overflow-hidden">
              <img className="w-full h-full object-cover" alt="Clean and professional dashboard interface showing complex data analytics with minimalist charts and a dark slate background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc5M_qAWna4TrhU9CN0wpVJxECjSpXklGNC8td2QcYUBSeDSz_PjsKHfb0z1wGrtCsKML_0OQy2OEfQ_hmx-jEFZOy25E1yU9Se9aBn3d8-qFq9gsVz6Ac8mVPaOCYVa8dLRgTJ1xYGIueoyLsoq2suFMsqPoJEC2t_u4SY_jWj-LBi3BIsvCO4Awyee0zNOTrOm7SgEsYbGMv92g73ybHtT_15_LCLc5x5zbqm2F_OiirSg8qn2kgSyyzkmeUlLqBUhIsJVLXGCNe" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
