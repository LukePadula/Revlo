"use client";

import DocumentIcon from "./documentIcon";
import Button from "./button";
import IDCamera from "./Camera";
import { InputDocument } from "../../../types";
import { dynamicIconImports } from "lucide-react/dynamic";
import { useRef, useState, ChangeEvent } from "react";

type IconName = keyof typeof dynamicIconImports;

interface Props {
  inputDocuments: InputDocument[];
  hasCamera: boolean;
}

export default function DocumentUploadContainer({
  inputDocuments,
  hasCamera,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file.name);
    }
  };

  const handleTakePhotoClick = () => {
    setShowCamera(true);
  };

  const handlePhotoCaptured = (photoDataUrl: string) => {
    // You can convert this to a File if needed:
    // const file = dataURLtoFile(photoDataUrl, "captured.png");
    console.log("Captured photo:", photoDataUrl);
    setShowCamera(false);
  };

  const handleCancelCamera = () => setShowCamera(false);

  // Helper (optional) if you want to turn the captured image into a File:
  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  if (showCamera) {
    return (
      <div className="p-4">
        <IDCamera
          onCapture={handlePhotoCaptured}
          onCancel={handleCancelCamera}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap m-2 mr-2 ml-2 md:mr-8 md:ml-8 justify-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {inputDocuments.map((item) => (
        <div key={item.label} className="w-full sm:w-1/2 p-2">
          <div className="border-dashed border-gray-300 border-2 p-3 flex flex-col justify-center items-center rounded">
            <DocumentIcon
              iconName={item.icon as IconName}
              colourVariant={item.colourVariant}
            />
            <h1 className="text-md font-semibold mt-2">{item.label}</h1>
            <small className="text-gray-500 mb-4">{item.description}</small>

            <div className="flex-col">
              {hasCamera && (
                <Button
                  label="Take Photo"
                  variant="brand"
                  iconName="camera"
                  onClick={handleTakePhotoClick}
                />
              )}
              <Button
                label="Choose File"
                variant={hasCamera ? "neutral" : "brand"}
                iconName="upload"
                onClick={handleUploadClick}
              />
            </div>

            {selectedFile && (
              <p className="text-xs text-gray-600 mt-2">
                Selected: {selectedFile.name}
              </p>
            )}
            <small className="text-gray-400 mt-4">
              PDF, JPG, PNG (Max 10MB)
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
