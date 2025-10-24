interface PageCardProps {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}

export default function PageCard({ icon, title, children }: PageCardProps) {
  return (
    <section className="bg-white border border-gray-300 p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {children}
    </section>
  );
}
