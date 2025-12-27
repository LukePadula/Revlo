interface PageCardProps {
  listItemIcon?: React.ReactNode;
  title: string;
  items: string[];
}

export default function RequestDetailsList({
  listItemIcon,
  title,
  items,
}: PageCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Title with slightly better tracking and color */}
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
        {title}
      </h2>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-gray-700 text-sm flex items-start group"
          >
            {listItemIcon && (
              <div className="mr-3 mt-0.5 flex-shrink-0 transition-transform group-hover:scale-110">
                {listItemIcon}
              </div>
            )}
            <span className="leading-relaxed font-medium text-gray-800">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
