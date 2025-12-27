interface Props {
  label: string;
  type?: "text" | "number" | string;
  value?: string | number;
  placeholder?: string;
  error?: string;
  required?: boolean;
  onChange: (value: string | number) => void;
}

export default function InputField({
  label,
  type = "text",
  value,
  placeholder = "",
  required = false,
  error,
  onChange,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (type === "number") {
      const num = rawValue === "" ? "" : Number(rawValue);
      onChange(num);
    } else {
      onChange(rawValue);
    }
  };

  return (
    <div className="max-w-sm">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>

      <input
        type={type}
        value={value}
        className={`border text-sm bg-white rounded-md p-2 w-full
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }
        `}
        placeholder={placeholder}
        required={required}
        onChange={handleChange}
      />

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
