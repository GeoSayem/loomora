// The brand's signature motif: a single continuous thread that knots across
// the page, echoing the hand-knotting process behind every Loomora rug.
// Used as a section divider instead of a generic <hr>.
export function WeaveDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center py-2 ${className}`} aria-hidden="true">
      <svg width="220" height="20" viewBox="0 0 220 20" fill="none">
        <path
          d="M0 10 C 18 0, 36 20, 54 10 S 90 0, 108 10 S 144 20, 162 10 S 198 0, 220 10"
          stroke="#AD8347"
          strokeWidth="1.5"
          strokeDasharray="240"
          className="opacity-70"
        />
        {[0, 55, 110, 165, 220].map((cx) => (
          <circle key={cx} cx={cx} cy="10" r="2" fill="#AD8347" />
        ))}
      </svg>
    </div>
  );
}
