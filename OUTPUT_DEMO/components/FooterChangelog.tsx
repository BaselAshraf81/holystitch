import React from 'react';
interface FooterChangelogProps {
  // Potential prop: links — replace placeholder href values
}

export default function FooterChangelog(_props: FooterChangelogProps) {
  return (
    <footer className="bg-[#121315] w-full py-16 px-8 mt-20 border-t border-[#454652]/10">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-12 max-w-[1400px] mx-auto">
        <div className="col-span-2">
          <span className="text-lg font-black text-[#E3E2E3] block mb-4">
            Obsidian Architect
          </span>
          <p className="text-[#C6C5D5] text-sm max-w-xs leading-relaxed opacity-80">
            Forging precision-engineered tools for the modern digital era. Built for developers, by architects.
          </p>
        </div>
        <div>
          <h4 className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#5E6AD2] mb-6">
            Product
          </h4>
          <div className="flex flex-col gap-3">
            <a className="text-[#C6C5D5] text-xs font-medium hover:text-[#BDC2FF] transition-colors opacity-80 hover:opacity-100" href="#">
              Twitter
            </a>
            <a className="text-[#C6C5D5] text-xs font-medium hover:text-[#BDC2FF] transition-colors opacity-80 hover:opacity-100" href="#">
              GitHub
            </a>
            <a className="text-[#C6C5D5] text-xs font-medium hover:text-[#BDC2FF] transition-colors opacity-80 hover:opacity-100" href="#">
              Discord
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#5E6AD2] mb-6">
            Resources
          </h4>
          <div className="flex flex-col gap-3">
            <a className="text-[#C6C5D5] text-xs font-medium hover:text-[#BDC2FF] transition-colors opacity-80 hover:opacity-100" href="#">
              Documentation
            </a>
            <a className="text-[#C6C5D5] text-xs font-medium hover:text-[#BDC2FF] transition-colors opacity-80 hover:opacity-100" href="#">
              Tutorials
            </a>
            <a className="text-[#C6C5D5] text-xs font-medium hover:text-[#BDC2FF] transition-colors opacity-80 hover:opacity-100" href="#">
              API
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#5E6AD2] mb-6">
            Legal
          </h4>
          <div className="flex flex-col gap-3">
            <a className="text-[#C6C5D5] text-xs font-medium hover:text-[#BDC2FF] transition-colors opacity-80 hover:opacity-100" href="#">
              Terms
            </a>
            <a className="text-[#C6C5D5] text-xs font-medium hover:text-[#BDC2FF] transition-colors opacity-80 hover:opacity-100" href="#">
              Privacy
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-[#454652]/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#C6C5D5]">
          © 2024 Obsidian Architect. Built for precision.
        </p>
        <div className="flex gap-6">
          <span className="w-1 h-1 bg-primary rounded-full">
          </span>
          <span className="w-1 h-1 bg-primary rounded-full">
          </span>
          <span className="w-1 h-1 bg-primary rounded-full">
          </span>
        </div>
      </div>
    </footer>
  );
}
