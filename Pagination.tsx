import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 mt-16" aria-label="Pagination">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        className={`px-3 py-2 text-sm border border-line ${page === 1 ? "pointer-events-none opacity-40" : "hover:bg-ink hover:text-cream"}`}
      >
        Prev
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`h-9 w-9 flex items-center justify-center text-sm border ${
            p === page ? "bg-ink text-cream border-ink" : "border-line hover:bg-sand"
          }`}
        >
          {p}
        </Link>
      ))}
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        className={`px-3 py-2 text-sm border border-line ${page === totalPages ? "pointer-events-none opacity-40" : "hover:bg-ink hover:text-cream"}`}
      >
        Next
      </Link>
    </nav>
  );
}
