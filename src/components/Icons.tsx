export function DuchessMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Duchess crown mark">
      <path d="M8 22 20 34 32 14l12 20 12-12-6 28H14L8 22Z" fill="currentColor" />
      <path d="M16 54h32" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
