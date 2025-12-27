import { useDashboardStore, TabType } from "@/store/dashboardStore";
import clsx from "clsx";

export default function TabSelector() {
  const activeTab = useDashboardStore((s) => s.activeTab);
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);

  const tabs: { id: TabType; label: string }[] = [
    { id: "open", label: "Open Requests" },
    { id: "pending", label: "Pending Review" },
    { id: "all", label: "All Requests" },
  ];

  return (
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "px-6 py-4 text-sm font-medium transition-colors relative",
              "hover:text-gray-900",
              isActive
                ? "text-brand"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t" />
            )}
          </button>
        );
      })}
    </div>
  );
}
