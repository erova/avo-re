// Stand-in for real exported images (brief §8, step 6). Remove when assets land.
export function Placeholder({
  label,
  ratio = "16 / 9",
}: {
  label: string;
  ratio?: string;
}) {
  if (!label) return null;
  return (
    <figure className="media">
      <div className="placeholder" style={{ aspectRatio: ratio }} role="img" aria-label={`Placeholder: ${label}`}>
        <span>{label}</span>
      </div>
    </figure>
  );
}
