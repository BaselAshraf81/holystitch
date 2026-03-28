import React from 'react';
interface Entry3Props {
  // Potential prop: title (currently "Obsidian SDK Alpha")
}

export default function Entry3(_props: Entry3Props) {
  return (
    <section className="relative mb-32 group">
      <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-outline-variant ring-8 ring-background group-hover:bg-primary transition-all duration-300">
        </div>
        <div className="md:w-1/2 md:pr-16 md:text-right">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-on-surface-variant mb-2 block">
            January 15, 2024
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">
            Obsidian SDK Alpha
          </h2>
        </div>
        <div className="md:w-1/2 md:pl-16 mt-2 md:mt-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-surface-container-highest text-on-surface-variant border border-outline-variant/30">
            v4.0.0
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <p className="text-on-surface-variant leading-relaxed">
              The long-awaited SDK is here. Build custom components and extensions using our Type-Safe architecture. Full documentation is now live for all early access partners.
            </p>
          </div>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl p-4 border border-outline-variant/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-error/40">
              </div>
              <div className="w-3 h-3 rounded-full bg-tertiary/40">
              </div>
              <div className="w-3 h-3 rounded-full bg-primary/40">
              </div>
            </div>
            <pre className="font-mono text-[13px] leading-relaxed text-on-surface-variant/80 overflow-x-auto">
              <code>
                <span className="text-primary">
                  import
                </span>
                &#123; Architect &#125;
                <span className="text-primary">
                  from
                </span>
                <span className="text-tertiary">
                  '@obsidian/sdk'
                </span>
                ;
                <span className="text-on-surface-variant/40">
                  // Initialize the engine
                </span>
                <span className="text-primary">
                  const
                </span>
                app =
                <span className="text-primary">
                  new
                </span>
                Architect(&#123;
  precision:
                <span className="text-tertiary">
                  'ultra'
                </span>
                ,
  theme:
                <span className="text-tertiary">
                  'obsidian-dark'
                </span>
                &#125;);

app.
                <span className="text-primary">
                  mount
                </span>
                (
                <span className="text-tertiary">
                  '#root'
                </span>
                );
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
