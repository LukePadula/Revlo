import clsx from "clsx";

interface Props {
  headers: string[];
  data: string[][];
  emptyMessage?: string;
  onRowClick?: (index: number) => void;
}

const getStatusBadgeClass = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower === "open" || statusLower === "active") {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }
  if (statusLower === "pending" || statusLower === "review") {
    return "bg-orange-100 text-orange-700 border-orange-200";
  }
  if (statusLower === "closed" || statusLower === "completed") {
    return "bg-green-100 text-green-700 border-green-200";
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const formatStatus = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function Table({ headers, data, emptyMessage = "No data available.", onRowClick }: Props) {
  const isEmpty = data.length === 0;

  return (
    <div className="overflow-hidden">
      {isEmpty ? (
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">No requests found</p>
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(i)}
                  className={`hover:bg-gray-50 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {row.map((value, j) => {
                    const isStatusColumn = headers[j]?.toLowerCase() === "status";
                    return (
                      <td key={j} className="px-6 py-4 whitespace-nowrap">
                        {isStatusColumn ? (
                          <span
                            className={clsx(
                              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                              getStatusBadgeClass(value)
                            )}
                          >
                            {formatStatus(value)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-900">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
