import { MDXRemote } from "next-mdx-remote/rsc";

// Plain markdown: no JSX or {braces} to trip over when writing copy.
const options = { mdxOptions: { format: "md" as const } };
const unwrap = { p: ({ children }: { children?: React.ReactNode }) => <>{children}</> };

/** Block markdown (paragraphs, lists, links). */
export function Md({ source, className }: { source: string; className?: string }) {
  if (!source) return null;
  return (
    <div className={className}>
      <MDXRemote source={source} options={options} />
    </div>
  );
}

/** Inline markdown only (italics, links), for use inside headings, <dd>, <summary>. */
export function MdInline({ source }: { source: string }) {
  return <MDXRemote source={source} options={options} components={unwrap} />;
}

/** Turns "a *word* here" into a pink italic word. For headings. */
export function Emph({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*(.+?)\*/g).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}
    </>
  );
}
