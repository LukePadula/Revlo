import clsx from "clsx";

export default function StatPill({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "brand" | "neutral" | "error";
}) {
  return (
    <span
      className={clsx("inline-flex flex-col rounded-full px-3 py-1 text-xs", {
        "bg-blue-100 text-blue-700": variant === "brand",
        "bg-slate-100 text-slate-700": variant === "neutral",
        "bg-rose-200 text-red-600": variant === "error",
      })}
    >
      <strong
        className={clsx("text-sm leading-tight font-semibold", {
          "text-red-800": variant === "error",
        })}
      >
        {value}
      </strong>
      <span>{label}</span>
    </span>
  );
}
