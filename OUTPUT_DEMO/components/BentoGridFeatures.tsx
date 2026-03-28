import React from 'react';
import LargeCard from './LargeCard';
import SmallCard from './SmallCard';
import MidCard from './MidCard';
import LargeCard2 from './LargeCard2';
interface BentoGridFeaturesProps {}

export default function BentoGridFeatures(_props: BentoGridFeaturesProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-8 mb-40">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <LargeCard />
        <SmallCard />
        <MidCard />
        <LargeCard2 />
      </div>
    </section>
  );
}
