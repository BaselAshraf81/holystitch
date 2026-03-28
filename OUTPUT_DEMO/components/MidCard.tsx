import React from 'react';
interface MidCardProps {
  // Potential prop: title (currently "Command Palette")
}

export default function MidCard(_props: MidCardProps) {
  return (
    <div className="md:col-span-4 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 hover:border-primary/30 transition-colors">
      <span className="material-symbols-outlined text-primary-container mb-6 text-4xl">
      </span>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">
        Command Palette
      </h3>
      <p className="text-on-surface-variant leading-relaxed">
        Control your entire workflow without leaving the keyboard. CMD+K to unlock everything.
      </p>
    </div>
  );
}
