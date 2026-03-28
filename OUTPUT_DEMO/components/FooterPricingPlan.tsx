import React from 'react';
interface FooterPricingPlanProps {
  // Potential prop: links — replace placeholder href values
}

export default function FooterPricingPlan(_props: FooterPricingPlanProps) {
  return (
    <footer className="bg-[#121315] w-full py-16 px-8 mt-20 border-t border-[#454652]/10">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-12 max-w-[1400px] mx-auto">
        <div className="col-span-2 md:col-span-1">
          <div className="text-lg font-black text-[#E3E2E3] mb-6">
            Obsidian
          </div>
          <p className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#5E6AD2]">
            © 2024 Obsidian Architect. Built for precision.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <span className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#5E6AD2]">
            Social
          </span>
          <a className="text-[12px] text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
            Twitter
          </a>
          <a className="text-[12px] text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
            GitHub
          </a>
          <a className="text-[12px] text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
            Discord
          </a>
        </div>
        <div className="flex flex-col space-y-4">
          <span className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#5E6AD2]">
            Legal
          </span>
          <a className="text-[12px] text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
            Terms
          </a>
          <a className="text-[12px] text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
            Privacy
          </a>
        </div>
        <div className="flex flex-col space-y-4">
          <span className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#5E6AD2]">
            Resources
          </span>
          <a className="text-[12px] text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
            Documentation
          </a>
          <a className="text-[12px] text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
            Status
          </a>
        </div>
        <div className="flex flex-col space-y-4">
          <span className="font-['Inter'] uppercase tracking-[0.05em] text-[10px] font-semibold text-[#5E6AD2]">
            Contact
          </span>
          <a className="text-[12px] text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
            Support
          </a>
          <a className="text-[12px] text-[#C6C5D5] hover:text-[#BDC2FF] transition-colors" href="#">
            Sales
          </a>
        </div>
      </div>
    </footer>
  );
}
