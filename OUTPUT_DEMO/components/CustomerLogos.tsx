import React from 'react';
interface CustomerLogosProps {}

export default function CustomerLogos(_props: CustomerLogosProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-8 mb-40 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-12">
        Powering the next generation of giants
      </p>
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        <span className="text-2xl font-black italic tracking-tighter">
          VERTEX
        </span>
        <span className="text-2xl font-black italic tracking-tighter">
          NEXUS
        </span>
        <span className="text-2xl font-black italic tracking-tighter">
          QUANTUM
        </span>
        <span className="text-2xl font-black italic tracking-tighter">
          SYNAPSE
        </span>
        <span className="text-2xl font-black italic tracking-tighter">
          ORBIT
        </span>
      </div>
    </section>
  );
}
