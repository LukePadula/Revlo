interface PageCardProps {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerVariant?: "brand" | "neutral";
  headerActions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
}

export default function PageCard({
  icon,
  title,
  subtitle,
  headerVariant,
  headerActions,
  className = "",
  bodyClassName = "",
  children,
}: PageCardProps) {
  // Using more sophisticated colors and subtle transitions
  const headerVariantClasses =
    headerVariant === "brand"
      ? "bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white border-b border-blue-800"
      : "bg-gray-50/50 text-slate-900 border-b border-gray-100";

  return (
    <section
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ${className}`}
    >
      {(headerVariant || title) && (
        <div
          className={`flex items-center justify-between w-full gap-4 px-6 py-5 ${headerVariantClasses}`}
        >
          <div className="flex items-center gap-4">
            {icon && (
              <div
                className={`flex-shrink-0 ${
                  headerVariant === "brand" ? "text-white" : "text-blue-600"
                }`}
              >
                {icon}
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="text-base font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p
                  className={`text-xs mt-0.5 font-medium ${
                    headerVariant === "brand"
                      ? "text-blue-100/90"
                      : "text-gray-500"
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {headerActions && (
            <div className="flex items-center gap-2">{headerActions}</div>
          )}
        </div>
      )}

      {/* Increased padding for a more "breathable" body */}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
