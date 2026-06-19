import Marquee from "@/components/Marquee";
import type { RenderContext } from "./context";

// ═══════════════════════════════════════════════════════════════════
// Reviews — reproduces the legacy google-reviews.tsx: a header with a
// Google rating badge, then an auto-scrolling row of review cards.
// layout "grid" renders a static 3-col grid instead of the carousel.
// Fed by live tenant `reviews`.
// ═══════════════════════════════════════════════════════════════════

export interface ReviewsProps {
  id: string;
  label?: string;
  title?: string;
  layout?: "carousel" | "grid";
  ratingValue?: number;
  ratingCount?: number;
}

function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  const n = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4"
          style={{ color: i < n ? "#FBBC04" : "#e0e3e6" }}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({
  author,
  city,
  rating,
  text,
}: {
  author: string;
  city?: string | null;
  rating: number;
  text: string;
}) {
  return (
    <div className="flex w-80 flex-shrink-0 flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#191c1e]">{author}</p>
          {city ? <p className="text-xs text-gray-400">{city}</p> : null}
        </div>
        <GoogleLogo size={18} />
      </div>
      <Stars rating={rating} />
      <p className="flex-1 text-sm leading-relaxed text-gray-600">“{text}”</p>
    </div>
  );
}

export default function Reviews(
  { label, title, layout = "carousel", ratingValue = 4.9, ratingCount = 200 }: ReviewsProps,
  ctx: RenderContext,
) {
  const reviews = ctx.reviews;
  if (!reviews.length) return null;

  const header = (
    <div className="mx-auto mb-12 max-w-screen-2xl px-6 md:px-12">
      {label ? (
        <p
          className="mb-2 font-body text-sm font-bold uppercase tracking-widest"
          style={{ color: "var(--site-primary)" }}
        >
          {label}
        </p>
      ) : null}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-headline text-3xl font-extrabold text-[#191c1e] md:text-4xl">
          {title}
        </h2>
        <div className="inline-flex shrink-0 items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-6 py-4 shadow-sm">
          <GoogleLogo size={28} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline text-2xl font-extrabold text-[#191c1e]">
                {ratingValue}
              </span>
              <Stars rating={ratingValue} />
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{ratingCount}+</span> avis Google
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-white py-24">
      {header}
      {layout === "grid" ? (
        <div className="mx-auto grid max-w-screen-2xl gap-6 px-6 sm:grid-cols-2 md:px-12 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} author={r.author} city={r.city} rating={r.rating} text={r.text} />
          ))}
        </div>
      ) : (
        <Marquee speed={0.5} fadeColor="#ffffff" gapClassName="gap-6">
          {reviews.map((r) => (
            <ReviewCard key={r.id} author={r.author} city={r.city} rating={r.rating} text={r.text} />
          ))}
        </Marquee>
      )}
    </section>
  );
}
