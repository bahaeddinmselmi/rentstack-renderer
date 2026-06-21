export interface PricingPlan {
  label: string;
  pricePerDay?: string;
  pricePerWeek?: string;
  pricePerMonth?: string;
  tag?: string;
  highlighted?: boolean;
}

export interface PricingTableProps {
  id: string;
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
  currency?: string;
}

export default function PricingTable({
  title = "Nos Tarifs",
  subtitle = "Location sans carte bancaire · Livraison incluse",
  plans = [],
  currency = "DT",
}: PricingTableProps) {
  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="font-headline text-3xl font-extrabold text-gray-900">{title}</h2>
          {subtitle ? <p className="mt-2 text-gray-500">{subtitle}</p> : null}
        </div>
        <div className={`grid gap-6 ${plans.length <= 2 ? "sm:grid-cols-2" : plans.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlighted
                  ? "border-[var(--site-primary)] bg-[var(--site-primary)] text-white shadow-xl shadow-[var(--site-primary)]/20 scale-105"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            >
              {plan.tag ? (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold ${plan.highlighted ? "bg-white text-[var(--site-primary)]" : "bg-[var(--site-primary)] text-white"}`}>
                  {plan.tag}
                </span>
              ) : null}
              <p className={`text-sm font-semibold uppercase tracking-widest ${plan.highlighted ? "text-white/80" : "text-gray-500"}`}>
                {plan.label}
              </p>
              <div className="mt-4 space-y-2">
                {plan.pricePerDay ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold">{plan.pricePerDay}</span>
                    <span className={`text-sm ${plan.highlighted ? "text-white/70" : "text-gray-500"}`}>{currency} / jour</span>
                  </div>
                ) : null}
                {plan.pricePerWeek ? (
                  <p className={`text-sm ${plan.highlighted ? "text-white/70" : "text-gray-400"}`}>
                    {plan.pricePerWeek} {currency} / semaine
                  </p>
                ) : null}
                {plan.pricePerMonth ? (
                  <p className={`text-sm ${plan.highlighted ? "text-white/70" : "text-gray-400"}`}>
                    {plan.pricePerMonth} {currency} / mois
                  </p>
                ) : null}
              </div>
              <a
                href="#contact"
                className={`mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold transition ${
                  plan.highlighted
                    ? "bg-white text-[var(--site-primary)] hover:bg-white/90"
                    : "bg-[var(--site-primary)] text-white hover:opacity-90"
                }`}
              >
                Réserver
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
