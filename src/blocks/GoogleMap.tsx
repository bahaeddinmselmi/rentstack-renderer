export interface GoogleMapProps {
  id: string;
  address?: string;
  lat?: string | number;
  lng?: string | number;
  zoom?: number;
  height?: "sm" | "md" | "lg";
  title?: string;
}

const heightMap = { sm: 280, md: 400, lg: 520 };

export default function GoogleMap({
  address = "",
  lat,
  lng,
  zoom = 14,
  height = "md",
  title = "Notre localisation",
}: GoogleMapProps) {
  const query = lat && lng ? `${lat},${lng}` : encodeURIComponent(address);
  const src = `https://maps.google.com/maps?q=${query}&z=${zoom}&output=embed&hl=fr`;
  const h = heightMap[height] || 400;

  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-5xl">
        {title ? (
          <h2 className="mb-6 font-headline text-2xl font-extrabold text-gray-900">{title}</h2>
        ) : null}
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm" style={{ height: h }}>
          <iframe
            src={src}
            width="100%"
            height={h}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title || "Map"}
          />
        </div>
        {address ? (
          <p className="mt-3 text-sm text-gray-500 text-center">{address}</p>
        ) : null}
      </div>
    </section>
  );
}
