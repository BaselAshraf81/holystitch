import React from 'react';
interface BackgroundImageDecorationProps {
  // Potential prop: imageSrc — replace hardcoded Stitch image URLs
}

export default function BackgroundImageDecoration(_props: BackgroundImageDecorationProps) {
  return (
    <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
      <img alt="Abstract network of glowing blue lines and data points against a dark cosmic background symbolizing global connectivity" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA8CfLrqkFEPTl2E7tVBQueieA5DQCl6eBmWqAr14O78kXp4E8YrTFqEmYTS4M-lEs4wS2NXBhrSVoDIanIXErB3_2zGDE7i8Z7K5Pg9sBXkfq8fQZrUK1pmB8IIgU3SLpkXSyL-fwGWbJ7vfYYCyE6SUAw8S0KIrS-Y7VzZxVXB7GLYaS4aWYhKD2GARpBNz6cJGww9IeNI_dsXigs_GpyJ-tVqwv1COD_iwsSc8Ny43a4_SKuZmxOpptLqkW7C8kRDBQ_JfSEkPF" />
    </div>
  );
}
