import React from 'react';
interface Entry2Props {
  // Potential prop: title (currently "Real-time Visual Debugger")
  // Potential prop: imageSrc — replace hardcoded Stitch image URLs
}

export default function Entry2(_props: Entry2Props) {
  return (
    <section className="relative mb-32 group">
      <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-outline-variant ring-8 ring-background group-hover:bg-primary transition-all duration-300">
        </div>
        <div className="md:w-1/2 md:pr-16 md:text-right order-1">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-on-surface-variant mb-2 block">
            February 28, 2024
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">
            Real-time Visual Debugger
          </h2>
        </div>
        <div className="md:w-1/2 md:pl-16 mt-2 md:mt-0 order-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-surface-container-highest text-on-surface-variant border border-outline-variant/30">
            v4.0.8
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-xl bg-surface-container shadow-2xl">
            <img className="w-full aspect-video object-cover" alt="Sophisticated node-based visual debugging interface with glowing connection lines and intricate data flow diagrams on a dark background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbhXR8kTLKrg3lWf1RWw1amIB7FSMc2XciRLk8VFJu0QQDRmFXcPwI_o_ix3YCua4KYYrSoPD_-4DHqAT3lmMHUVGANvU-cjRX-h6hl7o8Ydy6tpAau8jLyvMyG_Lmn_SYC_d1XULpoSGOFlupOm0ZievjeFC4nGHqFWemsLjRbkf9rpH_aYryJ-HayS-Am2vX5uFQuefUKXL0_LAniWd9UvNLK6UsqsUI3cMidwm6IFcrtWOyfQSPlVPDS61wpCgX_xvU1uMiVMhQ" />
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <p className="text-on-surface-variant leading-relaxed">
              Experience your data flows visually. The new Debugger allows for point-in-time playback of state mutations with zero performance overhead.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-surface-container-highest px-2 py-1 rounded text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">
                Node-Graph
              </span>
              <span className="bg-surface-container-highest px-2 py-1 rounded text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">
                State-Diff
              </span>
              <span className="bg-surface-container-highest px-2 py-1 rounded text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">
                Live-Reload
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
