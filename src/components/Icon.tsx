// ═══════════════════════════════════════════════════════════════════
// Icon — renders a Material Symbols Outlined glyph by ligature name.
// DB content stores icon names like "flight_land" / "credit_card_off",
// so this keeps blocks free of any icon-mapping table.
// ═══════════════════════════════════════════════════════════════════

export default function Icon({
  name,
  className = "",
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
