import { clsx } from "clsx";
import StatPill from "./StatPill";

export default function DocumentsHeader({
  total,
  required,
  optional,
  hasErrors,
}: {
  total: number;
  required: number;
  optional: number;
  hasErrors: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between",
        {
          "border-rose-300 bg-rose-100": hasErrors,
          "border-slate-200 bg-slate-50": !hasErrors,
        }
      )}
    >
      <div>
        <p
          className={clsx(
            "text-sm font-semibold ",
            { "text-red-700": hasErrors },
            {
              "text-slate-800": !hasErrors,
            }
          )}
        >
          {total > 0
            ? `Collecting ${total} document${total > 1 ? "s" : ""}`
            : "No documents selected yet"}
        </p>
        <small
          className={clsx("text-xs ", {
            "text-red-600": hasErrors,
            "text-slate-500": !hasErrors,
          })}
        >
          Use a mix of required and optional uploads to speed up reviews.
        </small>
      </div>
      <div className="flex gap-2">
        <StatPill
          label="Required"
          value={required}
          variant={hasErrors ? "error" : "brand"}
        />
        <StatPill
          label="Optional"
          value={Math.max(optional, 0)}
          variant={hasErrors ? "error" : "neutral"}
        />
      </div>
    </div>
  );
}
