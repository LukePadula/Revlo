interface PageCardProps {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerVariant?: "brand" | "neutral";
  children?: React.ReactNode;
}

export default function PageCard({
  icon,
  title,
  subtitle,
  headerVariant,
  children,
}: PageCardProps) {
  return (
    <section className="bg-white border border-gray-300 rounded-xl">
      <div
        className={`flex p-4 rounded-tl-xl rounded-tr-xl items-center gap-2 mb-6 ${
          headerVariant == "brand" ? "bg-brand text-white" : ""
        }`}
      >
        {icon}

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && <small>{subtitle}</small>}
        </div>
      </div>
      <div className="pb-4 pl-4 pr-4">{children}</div>
    </section>
  );
}
