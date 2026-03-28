'use client';

import React from 'react';
interface TopNavBarProps {
  // Potential prop: links — replace placeholder href values
}

export default function TopNavBar(_props: TopNavBarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#121315]/70 backdrop-blur-xl border-b border-[#454652]/20 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between px-8 py-4 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-12">
          <span className="text-xl font-bold tracking-tighter text-[#E3E2E3]">
            Obsidian
          </span>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-['Inter'] font-medium tracking-tight text-sm text-[#BDC2FF] font-semibold hover:text-[#E3E2E3] hover:bg-[#1F2021]/50 transition-all px-3 py-1 rounded" href="#">
              Method
            </a>
            <a className="font-['Inter'] font-medium tracking-tight text-sm text-[#C6C5D5] hover:text-[#E3E2E3] hover:bg-[#1F2021]/50 transition-all px-3 py-1 rounded" href="#">
              Customer
            </a>
            <a className="font-['Inter'] font-medium tracking-tight text-sm text-[#C6C5D5] hover:text-[#E3E2E3] hover:bg-[#1F2021]/50 transition-all px-3 py-1 rounded" href="#">
              Changelog
            </a>
            <a className="font-['Inter'] font-medium tracking-tight text-sm text-[#C6C5D5] hover:text-[#E3E2E3] hover:bg-[#1F2021]/50 transition-all px-3 py-1 rounded" href="#">
              Pricing
            </a>
            <a className="font-['Inter'] font-medium tracking-tight text-sm text-[#C6C5D5] hover:text-[#E3E2E3] hover:bg-[#1F2021]/50 transition-all px-3 py-1 rounded" href="#">
              Contact
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="font-['Inter'] font-medium tracking-tight text-sm text-[#C6C5D5] hover:text-[#E3E2E3] transition-all">
            Log in
          </button>
          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-1.5 rounded-lg text-sm font-semibold hover:scale-95 duration-200 ease-in-out">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}
