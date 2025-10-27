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
    <div className="flex flex-col gap-3 mb-2">
      <h2 className="text-md font-semibold">{title}</h2>
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            className="text-gray-800 text-sm flex items-center mb-1"
          >
            {listItemIcon && <span>{listItemIcon}</span>}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
