interface Props {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: Props) {
  return (
    <div className="flex items-center justify-between mt-6">
      <div>
        <h1 className="font-bold text-xl">{title}</h1>
        {subtitle && (
          <small className="text-md text-gray-500">{subtitle}</small>
        )}
      </div>

      <div className="flex gap-2">{children}</div>
    </div>
  );
}
