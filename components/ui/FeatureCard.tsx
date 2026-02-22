export default function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#f9bd78]/40 bg-white hover:-translate-y-1">
      <div className="inline-flex p-2.5 sm:p-3 rounded-xl bg-[#f6175d] text-white mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-text mb-2 sm:mb-3">{title}</h3>
      <p className="text-xs sm:text-sm lg:text-base text-text/80 leading-relaxed">{description}</p>
    </div>
  );
}
