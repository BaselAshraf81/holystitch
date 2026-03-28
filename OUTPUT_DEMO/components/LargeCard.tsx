import React from 'react';
interface LargeCardProps {
  // Potential prop: title (currently "Kinetic Architecture")
  // Potential prop: imageSrc — replace hardcoded Stitch image URLs
}

export default function LargeCard(_props: LargeCardProps) {
  return (
    <div className="md:col-span-8 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 hover:border-primary/30 transition-colors group">
      <div className="flex flex-col h-full">
        <span className="material-symbols-outlined text-primary mb-6 text-4xl">
        </span>
        <h3 className="text-3xl font-bold mb-4 tracking-tight">
          Kinetic Architecture
        </h3>
        <p className="text-on-surface-variant leading-relaxed max-w-md mb-12">
          Visualize your entire software stack in a dynamic, living graph that updates as your team pushes code.
        </p>
        <div className="mt-auto aspect-video bg-surface-container rounded-xl overflow-hidden">
          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" alt="Abstract 3D network visualization with glowing nodes and connecting lines in deep violet and indigo palette" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoonobcUnFClqLd6mA9pW81uX8S2rbBa2bkJFqr9i8a-Ya9BJp4buYCRVQO19c3LM_6gPOBgR3ch0USnRfttKtiuDHL8KgwCRRhONzm4MPUw7Tz71UvC5baReiB48VAlHFdov96y_7yDTde7jTjVWxgPcDGBfMgPVDKnNiAaa5rxJwVwyn7oTYF1R2-iesnqoa0F1tbmmz-P0NusZDZQjF9J6DJl1i8axEvS_VqwYx-bGV3P5PdZRFu0leGpN-mEi1aLVSvq_D8iFt" />
        </div>
      </div>
    </div>
  );
}
