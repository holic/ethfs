type Props = {
  children: string;
};

export const PendingPlaceholder = ({ children }: Props) => (
  <span className="animate-pulse">
    {children.split(/\s+/).map((word, i) => (
      <>
        {i > 0 ? " " : null}
        <span key={`${i}-${word}`} title={word} className="Skeleton-word" />
      </>
    ))}
    <style jsx>{`
      .Skeleton-word {
        background: currentColor;
        border-radius: 0.25em;
        opacity: 0.5;
      }
      .Skeleton-word::before {
        content: attr(title);
        color: transparent;
      }
    `}</style>
  </span>
);
