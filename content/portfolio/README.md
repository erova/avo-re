# Editing the home page copy

Everything you read on the home page lives in these files (plus `content/cases/` for the five case studies and `content/quotes/` for quotes). Edit, save, and the page updates. No code involved.

| To change | Edit |
|---|---|
| Section headings ("Selected work", "How I lead"...) | `sections.md` |
| Name, headline, intro paragraph, hero links, portrait | `hero.md` |
| "At a glance" rows | `glance.md` (each `##` is a term, the text under it is the detail) |
| A case study | `../cases/<name>.md` |
| Earlier jobs | `earlier/*.md` (one file per job; `order` sets the sequence) |
| "Leadership principles" heading and Clarity / Consistency / Curiosity | `lead.md` |
| "Growing leaders" (a pull quote plus a paragraph) | `people.md` |
| The speaking stage (photo, card, video) and the talk paragraph | `speaking.md` |
| Earlier talks | `talks.md` |
| Liftoff! (the book beside Essays) | `publications.md` |
| Contact links and closing lines | `contact.md` |
| Quotes | one file per quote in `../quotes/` (fields: quote, name, title, relationship, order) |
| Essays | the existing `content/writing/` posts |

## Writing rules

- It's plain Markdown: `*italic*`, `**bold**`, `[link text](https://...)`, `- list items`.
- Frontmatter is the block between the `---` lines at the top. It holds short fields (titles, links, image paths). Keep the `key: value` shape. Wrap a value in quotes if it contains a colon.
- In `hero.md`, wrap one word of the headline in `*asterisks*` to set it in the pink italic.
- To show a literal asterisk, write `\*`.
- To add a line break inside a paragraph, end the line with two spaces.
- `[DECIDE: ...]` is a visible placeholder. Search for `DECIDE` to find everything still open.
- To add an earlier job, copy a file in `earlier/`, change `title` and `order`.
- Images go in `public/` and are referenced by path (`/images/...`).
