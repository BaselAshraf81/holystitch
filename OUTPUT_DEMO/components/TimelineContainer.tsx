import React from 'react';
import Entry1 from './Entry1';
import Entry2 from './Entry2';
import Entry3 from './Entry3';
interface TimelineContainerProps {}

export default function TimelineContainer(_props: TimelineContainerProps) {
  return (
    <div className="relative">
      {/* Continuous Vertical Line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-outline-variant/20 -translate-x-1/2 hidden md:block">
      </div>
      <Entry1 />
      <Entry2 />
      <Entry3 />
    </div>
  );
}
