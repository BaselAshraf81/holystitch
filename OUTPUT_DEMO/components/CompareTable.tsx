import React from 'react';
interface CompareTableProps {
  // Potential prop: title (currently "Compare features")
}

export default function CompareTable(_props: CompareTableProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-8 mb-32">
      <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-12 text-center">
        Compare features
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="py-6 px-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Architecture
              </th>
              <th className="py-6 px-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Free
              </th>
              <th className="py-6 px-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Pro
              </th>
              <th className="py-6 px-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            <tr>
              <td className="py-6 px-4 text-sm font-medium text-on-surface">
                API Rate Limiting
              </td>
              <td className="py-6 px-4 text-sm text-on-surface-variant">
                1,000/hr
              </td>
              <td className="py-6 px-4 text-sm text-on-surface">
                Unlimited
              </td>
              <td className="py-6 px-4 text-sm text-on-surface">
                Custom Burst
              </td>
            </tr>
            <tr>
              <td className="py-6 px-4 text-sm font-medium text-on-surface">
                Global Edge Cache
              </td>
              <td className="py-6 px-4 text-sm text-on-surface-variant">
                US-East Only
              </td>
              <td className="py-6 px-4 text-sm text-on-surface">
                32 Regions
              </td>
              <td className="py-6 px-4 text-sm text-on-surface">
                Global + On-Prem
              </td>
            </tr>
            <tr>
              <td className="py-6 px-4 text-sm font-medium text-on-surface">
                RBAC Permissions
              </td>
              <td className="py-6 px-4 text-sm text-on-surface-variant">
                Basic
              </td>
              <td className="py-6 px-4 text-sm text-on-surface">
                Advanced
              </td>
              <td className="py-6 px-4 text-sm text-on-surface">
                Custom Logic
              </td>
            </tr>
            <tr>
              <td className="py-6 px-4 text-sm font-medium text-on-surface">
                Log Retention
              </td>
              <td className="py-6 px-4 text-sm text-on-surface-variant">
                24 Hours
              </td>
              <td className="py-6 px-4 text-sm text-on-surface">
                30 Days
              </td>
              <td className="py-6 px-4 text-sm text-on-surface">
                Indefinite
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
