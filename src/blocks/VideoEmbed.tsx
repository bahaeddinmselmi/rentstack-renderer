export interface VideoEmbedProps {
  id: string;
  url?: string;
  title?: string;
  aspectRatio?: "16:9" | "9:16";
}

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1]! : null;
}

function extractTikTokId(url: string): string | null {
  const m = url.match(/video\/(\d+)/);
  return m ? m[1]! : null;
}

export default function VideoEmbed({
  url = "",
  title = "",
  aspectRatio = "16:9",
}: VideoEmbedProps) {
  if (!url) return null;

  const isVertical = aspectRatio === "9:16";
  const paddingBottom = isVertical ? "177.78%" : "56.25%";

  let src: string | null = null;
  const ytId = extractYouTubeId(url);
  if (ytId) {
    src = `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`;
  } else if (url.includes("tiktok.com")) {
    const ttId = extractTikTokId(url);
    if (ttId) src = `https://www.tiktok.com/embed/v2/${ttId}`;
  }

  if (!src) {
    return (
      <section className="py-8 px-6 text-center text-sm text-gray-400">
        URL vidéo non reconnue (YouTube ou TikTok attendu)
      </section>
    );
  }

  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-4xl">
        {title ? (
          <h2 className="mb-6 font-headline text-2xl font-extrabold text-gray-900 text-center">{title}</h2>
        ) : null}
        <div
          className="relative overflow-hidden rounded-2xl shadow-lg"
          style={{ paddingBottom, height: 0 }}
        >
          <iframe
            src={src}
            title={title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
