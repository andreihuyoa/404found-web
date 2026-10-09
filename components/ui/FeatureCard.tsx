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
    <div className="group relative rounded-2xl border border-[#f9bd78]/40 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 lg:p-8">
      <div className="mb-3 inline-flex rounded-xl bg-[#f6175d] p-2.5 text-white sm:mb-4 sm:p-3">
        {icon}
      </div>
      <h3 className="text-text mb-2 text-base font-semibold sm:mb-3 sm:text-lg lg:text-xl">
        {title}
      </h3>
      <p className="text-text/80 text-xs leading-relaxed sm:text-sm lg:text-base">
        {description}
      </p>
    </div>
  );
}
