"use client";

import { useRef, useState, ChangeEvent } from "react";

export default function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("File selected:", file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("File uploaded successfully!");
        setSelectedFile(null);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while uploading");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Choose File
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {selectedFile && (
        <div className="mt-2">
          <p>Selected: {selectedFile.name}</p>
          <button
            onClick={handleUpload}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
}
