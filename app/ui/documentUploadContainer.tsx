import DocumentIcon from "./documentIcon";
import Button from "./button";
import { InputDocument } from "../types";
import { dynamicIconImports } from "lucide-react/dynamic";
type IconName = keyof typeof dynamicIconImports;

interface props {
  inputDocuments: InputDocument[];
  hasCamera: boolean;
}

export default function DocumentUploadContainer({
  inputDocuments,
  hasCamera,
}: props) {
  const cameraEnabledInput = (
    <div>
      <Button label="Take Photo" variant="brand" iconName="camera" />
      <Button label="Choose File" variant="neutral" iconName="upload" />
    </div>
  );
  const cameraDisabledInput = (
    <div>
      <Button label="Choose File" variant="brand" iconName="upload" />
    </div>
  );

  return (
    <div className="flex flex-wrap m-2 mr-12 ml-12 justify-center">
      {inputDocuments.map((item) => (
        <div key={item.label} className="w-full sm:w-1/2 p-2">
          <div className="border-dashed border-gray-300 border-2 p-3 flex flex-col justify-center items-center rounded aspect-3/2">
            <DocumentIcon
              iconName={item.icon as IconName}
              colourVariant={item.colourVariant}
            />
            <h1 className="text-md font-semibold mt-2">{item.label}</h1>
            <small className="text-gray-500 mb-4">{item.description}</small>

            {hasCamera ? cameraEnabledInput : cameraDisabledInput}

            <small className="text-gray-400 mt-2">
              PDF, JPG, PNG (Max 10MB)
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
