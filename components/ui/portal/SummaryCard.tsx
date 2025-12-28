import PageCard from "../core/pageCard";
import DocumentIcon from "../core/documentIcon";

interface props {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export default function SummaryCard({ title, value, icon }: props) {
  return (
    <div className="flex-1 max-w-[250px]">
      <PageCard>
        <div className="p-2 flex gap-4 place-items-center-safe justify-around">
          <div>
            <small className="text-md text-gray-500">{title} </small>
            <h1 className="font-bold text-xl">{value}</h1>
          </div>
          {icon}
        </div>
      </PageCard>
    </div>
  );
}
