interface SectionHeaderProps {
  label?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
}

export default function SectionHeader({
  label,
  title,
  titleHighlight,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div>
      {label && <div className="section-label">{label}</div>}
      <h2 className="section-title">
        {titleHighlight ? (
          <>
            {title} <em className="not-italic text-brand">{titleHighlight}</em>
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  );
}
