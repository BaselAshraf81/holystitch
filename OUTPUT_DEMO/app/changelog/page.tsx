import React from 'react';
import type { Metadata } from 'next';
import TopNavBar from '../../components/TopNavBar';
import HeaderSection from '../../components/HeaderSection';
import TimelineContainer from '../../components/TimelineContainer';
import FinalCTAChangelog from '../../components/FinalCTAChangelog';
import FooterChangelog from '../../components/FooterChangelog';

export const metadata: Metadata = {
  title: 'Changelog',
};

export default function Page() {
  return (
    <>
<TopNavBar />
<main className="pt-32 pb-20 px-6 max-w-[1100px] mx-auto">
<HeaderSection />
<TimelineContainer />
<FinalCTAChangelog />
</main>
<FooterChangelog />
</>
  );
}
