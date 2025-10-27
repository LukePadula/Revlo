export default function Checkbox() {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className="w-7 aspect-square accent-brand cursor-pointer"
      />
      <span className="text-gray-700 text-sm ml-3">
        I confirm that all uploaded documents and provided information is
        authentic and I consent to the processing of this information for the
        stated purpose.
      </span>
    </label>
  );
}
