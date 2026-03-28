import React from 'react';
interface FAQSectionProps {}

export default function FAQSection(_props: FAQSectionProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-8 mb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-6">
            Frequently
            <br />
            Architected.
          </h2>
          <p className="text-on-surface-variant">
            Everything you need to know about our scaling logic and billing cycles.
          </p>
        </div>
        <div className="space-y-8">
          <div>
            <h4 className="text-on-surface font-bold text-lg mb-2">
              Can I upgrade at any time?
            </h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Yes. Upgrades are instantaneous. We prorate your billing to the exact millisecond of deployment.
            </p>
          </div>
          <div>
            <h4 className="text-on-surface font-bold text-lg mb-2">
              What happens if I exceed storage?
            </h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              We provide a 10% overflow buffer. Beyond that, we'll notify you to scale your plan or manage your assets.
            </p>
          </div>
          <div>
            <h4 className="text-on-surface font-bold text-lg mb-2">
              Do you offer academic discounts?
            </h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              We support the next generation of architects. Contact our academic outreach team for custom credentials.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
