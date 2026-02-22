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
    <div className="group relative rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#f9bd78]/40 bg-white hover:-translate-y-1">
      <div className="inline-flex p-3 rounded-xl bg-[#f6175d] text-white mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-text mb-3">{title}</h4>
      <p className="text-text/80 leading-relaxed">{description}</p>
    </div>
  );
}
