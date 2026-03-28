import React from 'react';
interface FooterProps {
  // Potential prop: links — replace placeholder href values
}

export default function Footer(_props: FooterProps) {
  return (
    <footer className="w-full py-16 px-8 mt-20 bg-[#121315] border-t border-[#454652]/10">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-12 max-w-[1400px] mx-auto">
        <div className="col-span-2">
          <span className="text-lg font-black text-[#E3E2E3] block mb-6">
            Obsidian
          </span>
          <p className="text-[#C6C5D5] font-['Inter'] text-sm leading-relaxed max-w-xs mb-8">
            The next-generation architecture platform for high-velocity software teams. Built for precision.
          </p>
          <p className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#5E6AD2]">
            © 2024 Obsidian Architect. Built for precision.
          </p>
        </div>
        <div>
          <h5 className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-bold text-[#E3E2E3] mb-6">
            Product
          </h5>
          <ul className="space-y-4">
            <li>
              <a className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
                Method
              </a>
            </li>
            <li>
              <a className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
                Pricing
              </a>
            </li>
            <li>
              <a className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
                Changelog
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-bold text-[#E3E2E3] mb-6">
            Social
          </h5>
          <ul className="space-y-4">
            <li>
              <a className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
                Twitter
              </a>
            </li>
            <li>
              <a className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
                GitHub
              </a>
            </li>
            <li>
              <a className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
                Discord
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-bold text-[#E3E2E3] mb-6">
            Legal
          </h5>
          <ul className="space-y-4">
            <li>
              <a className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
                Terms
              </a>
            </li>
            <li>
              <a className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
                Privacy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
