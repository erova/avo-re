import { MDXRemote } from "next-mdx-remote/rsc";
import { PrimaryCta, OutlineSection } from "@/components/now/patterns";
import { getNowSource } from "@/lib/now";

export default async function Page() {
  const source = getNowSource("onboarding");

  return (
    <article className="prose prose-invert max-w-none">
      <MDXRemote
        source={source}
        components={{
          PrimaryCta,
          OutlineSection,
        }}
      />
    </article>
  );
}