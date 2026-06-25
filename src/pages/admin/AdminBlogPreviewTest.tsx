import { useState } from 'react';
import { sanitizeHtml } from '@/lib/sanitize';
import { Button } from '@/components/ui/button';

const PROSE_CLASSES = `prose prose-lg dark:prose-invert max-w-none
  prose-headings:font-heading prose-headings:font-bold prose-headings:scroll-mt-24
  prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-5
  prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/40
  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
  prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2
  prose-p:leading-[1.85] prose-p:mb-5 prose-p:text-foreground/90
  prose-strong:text-foreground prose-strong:font-semibold
  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-5 prose-blockquote:py-1
  prose-blockquote:italic prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:my-6
  prose-ul:my-5 prose-ul:space-y-2 prose-ol:my-5 prose-ol:space-y-2
  prose-li:leading-relaxed prose-li:marker:text-primary
  prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
  prose-pre:bg-muted prose-pre:border prose-pre:border-border/40 prose-pre:rounded-xl
  prose-img:rounded-lg prose-img:my-6
  prose-hr:my-10 prose-hr:border-border/60
  [&_table]:w-full [&_table]:my-6 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-border/50
  [&_thead]:bg-primary/10
  [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground
  [&_td]:px-4 [&_td]:py-3 [&_td]:border-t [&_td]:border-border/40
  [&_tbody_tr:nth-child(even)]:bg-muted/30
  [&_mark]:bg-primary/20 [&_mark]:text-foreground [&_mark]:px-1 [&_mark]:rounded`;

type Sample = {
  id: string;
  title: string;
  description: string;
  html: string;
  expects: string[];
};

const SAMPLES: Sample[] = [
  {
    id: 'toc-headings',
    title: '1. TOC + H2/H3 hierarchy',
    description: 'Verifies heading sizes, spacing above/below, and section dividers.',
    expects: [
      'H2 larger than H3, both bold',
      'Clear vertical spacing between sections',
      'TOC renders as bulleted list',
    ],
    html: `
      <p>This is the intro paragraph. It should have relaxed line-height and bottom margin.</p>
      <h2>Table of Contents</h2>
      <ul>
        <li>Introduction</li>
        <li>Why It Matters</li>
        <li>How It Works</li>
        <li>Conclusion</li>
      </ul>
      <h2>Why It Matters</h2>
      <p>Body paragraph under an H2.</p>
      <h3>A sub-point</h3>
      <p>Body paragraph under an H3 with <strong>bold text</strong> and <em>italic text</em>.</p>
      <h3>Another sub-point</h3>
      <p>Should have spacing above the H3.</p>
    `,
  },
  {
    id: 'lists-marks',
    title: '2. Lists, marks & inline formatting',
    description: 'Bulleted/numbered lists, highlighted text, inline code.',
    expects: [
      'Bullets use primary-color markers',
      '<mark> highlights with primary tint',
      'Inline <code> styled with muted background',
    ],
    html: `
      <h2>Key Features</h2>
      <ul>
        <li>First bullet with <mark>highlighted insight</mark></li>
        <li>Second bullet with <code>inline code</code></li>
        <li>Third bullet with <strong>bold</strong> and <em>emphasis</em></li>
      </ul>
      <h3>Step-by-step</h3>
      <ol>
        <li>Open the editor</li>
        <li>Upload your file</li>
        <li>Click <strong>AI Blog from File</strong></li>
        <li>Review the generated output</li>
      </ol>
    `,
  },
  {
    id: 'comparison-table',
    title: '3. Comparison table',
    description: 'Validates table borders, header background, zebra striping.',
    expects: [
      'Header row has tinted background',
      'Even rows have subtle striping',
      'Cells have padding and dividers',
    ],
    html: `
      <h2>DIY vs Professional Editing</h2>
      <table>
        <thead>
          <tr><th>Feature</th><th>DIY</th><th>Professional</th></tr>
        </thead>
        <tbody>
          <tr><td>Viewer Retention</td><td>Drop-off</td><td>Optimized hooks</td></tr>
          <tr><td>Brand Perception</td><td>Amateur</td><td>Premium</td></tr>
          <tr><td>Time Investment</td><td>10+ hrs</td><td>Zero</td></tr>
          <tr><td>Conversion</td><td>Weak CTAs</td><td>Precise placement</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'blockquote-hr',
    title: '4. Blockquotes, callouts & dividers',
    description: 'Pro-tip blockquotes, horizontal rules, paragraph rhythm.',
    expects: [
      'Blockquote has left border + tinted background',
      '<hr> shows generous spacing',
      'Paragraphs stay readable',
    ],
    html: `
      <p>Intro paragraph before a callout.</p>
      <blockquote>💡 <strong>Pro Tip:</strong> Always start with a strong hook in the first 3 seconds.</blockquote>
      <p>Paragraph after the blockquote.</p>
      <hr />
      <h2>Next Section</h2>
      <p>Should sit cleanly below the divider with proper spacing.</p>
      <blockquote>⚠️ <strong>Warning:</strong> Skipping QA review can break user trust.</blockquote>
    `,
  },
  {
    id: 'mixed-long',
    title: '5. Mixed long-form article',
    description: 'Combines every element to simulate a full AI-generated post.',
    expects: [
      'All elements render with consistent rhythm',
      'No collapsed margins between sections',
      'Tables, lists, marks and blockquotes coexist',
    ],
    html: `
      <p>A <strong>professional video editor</strong> does more than cut clips — they shape the story.</p>
      <h2>Table of Contents</h2>
      <ul>
        <li>Why It Matters</li>
        <li>Comparison</li>
        <li>Key Takeaways</li>
      </ul>
      <h2>Why It Matters</h2>
      <p>Audiences decide in <mark>under 3 seconds</mark> whether to keep watching.</p>
      <h3>Retention drivers</h3>
      <ol>
        <li>Strong hook</li>
        <li>Tight pacing</li>
        <li>Clear CTA</li>
      </ol>
      <h2>Comparison</h2>
      <table>
        <thead><tr><th>Metric</th><th>Before</th><th>After</th></tr></thead>
        <tbody>
          <tr><td>Watch time</td><td>22%</td><td>61%</td></tr>
          <tr><td>CTR</td><td>1.1%</td><td>4.8%</td></tr>
        </tbody>
      </table>
      <blockquote>💡 <strong>Pro Tip:</strong> Test two thumbnails for every upload.</blockquote>
      <hr />
      <h2>Key Takeaways</h2>
      <ul>
        <li>Hook fast, edit tight</li>
        <li>Always include a CTA</li>
        <li>Measure, then iterate</li>
      </ul>
      <h2>Conclusion</h2>
      <p>Investing in professional editing pays back in retention, brand trust, and conversions.</p>
    `,
  },
];

const AdminBlogPreviewTest = () => {
  const [activeId, setActiveId] = useState<string>('all');
  const visible = activeId === 'all' ? SAMPLES : SAMPLES.filter((s) => s.id === activeId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">Blog Preview — Formatting Tests</h2>
        <p className="text-muted-foreground">
          Visual regression samples. After any change to prose styles or the typography plugin, scroll through
          each sample and confirm the listed expectations still hold.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeId === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveId('all')}
        >
          All
        </Button>
        {SAMPLES.map((s) => (
          <Button
            key={s.id}
            variant={activeId === s.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveId(s.id)}
          >
            {s.title.replace(/^\d+\.\s*/, '')}
          </Button>
        ))}
      </div>

      <div className="space-y-10">
        {visible.map((sample) => (
          <section key={sample.id} className="glass-card rounded-2xl p-6 md:p-8">
            <header className="mb-6 pb-4 border-b border-border/40">
              <h3 className="font-heading text-xl font-bold">{sample.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{sample.description}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {sample.expects.map((e, i) => (
                  <li
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    ✓ {e}
                  </li>
                ))}
              </ul>
            </header>
            <div
              className={PROSE_CLASSES}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(sample.html) }}
            />
          </section>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogPreviewTest;
