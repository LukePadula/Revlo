import Icon from "./icon";

export default function Nav() {
  return (
    <>
      <div className="w-full flex items-center font-semibold px-4 md:px-18 h-14 bg-white">
        <Icon iconName="shield" variant="brand" size="medium" />
        <div className="flex flex-col">
          <h1 className="text-black text-sm">Revlo</h1>
          <small className="text-gray-400 font-medium text-xs">
            Secure document area
          </small>
        </div>
      </div>
    </>
  );
}
