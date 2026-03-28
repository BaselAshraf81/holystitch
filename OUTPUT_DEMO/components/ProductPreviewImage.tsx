import React from 'react';
interface ProductPreviewImageProps {
  // Potential prop: imageSrc — replace hardcoded Stitch image URLs
}

export default function ProductPreviewImage(_props: ProductPreviewImageProps) {
  return (
    <section className="max-w-[1200px] mx-auto px-8 mb-40">
      <div className="relative rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl bg-surface-container-lowest p-1 md:p-4">
        <div className="aspect-video bg-surface-container-low rounded-xl relative overflow-hidden">
          <img className="w-full h-full object-cover opacity-80 mix-blend-screen" alt="Modern high-fidelity dark mode software interface with minimalist graphs, code blocks, and architectural diagrams in deep purple and obsidian tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD_7UyDjaRMATSSbNPwm34l2rxKfwT3jkxVLyNzowt_aW7gqjwPtOTKuXiy0Vo8u61T688DLc54l5RF3Wyerb-gUKHxLCVpnw3d8yQ1rP_Oew1qCn6ydj5O2IH8YUWBzTFolP7p6Ujnkqy657pcyPY1eVIlmSV-7TbE76-_Vd5uB1buy3rJukKccGDfCTmgaQkKMz0sRKaPdllA3X4ABvS94GNPVxFBOAvitjJgMRXO-TYQR_-DczkkEKL4KHXoU20yfGtngEPAKDB" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent">
          </div>
        </div>
      </div>
    </section>
  );
}
