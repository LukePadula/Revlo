import React, { useRef, useState } from "react";
import { DocListType } from "@/types";
import iconMap from "@/utils/iconConfig";
import { DynamicIcon } from "lucide-react/dynamic";
import { useRequestStore } from "@/store/requestStore";
import { X, FileText, Upload } from "lucide-react";

export default function UploadArea({ docType }: { docType: DocListType }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get data and setters from Zustand
  const fileData = useRequestStore((s) => s.fileData);
  const setFileData = useRequestStore((s) => s.setFileData);
  const removeFile = useRequestStore((s) => s.removeFile);

  // Get all files for this document type (array of files)
  const uploadedFiles = fileData ? fileData[docType.id] || [] : [];
  const hasFiles = uploadedFiles.length > 0;

  const iconProperties = (iconMap as any)(docType.id);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      // Basic validation: 10MB limit
      if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    // Show error for invalid files
    if (invalidFiles.length > 0) {
      alert(
        `The following file(s) are too large (Max 10MB):\n${invalidFiles.join(
          "\n"
        )}`
      );
    }

    // Add valid files
    validFiles.forEach((file) => {
      setFileData(docType.id, file);
    });
  };

  const handleFileAction = (file: File | undefined) => {
    if (file) {
      handleFiles([file] as any);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteFile = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    removeFile(docType.id, index);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative border-2 border-dashed rounded-xl transition-all min-h-[200px] flex flex-col
        ${
          isDragging
            ? "border-blue-500 bg-blue-50 scale-[1.01]"
            : hasFiles
            ? "border-green-400 bg-green-50/30"
            : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        className="hidden"
      />

      {/* Header Info */}
      <div className="w-full flex items-center justify-between p-4 border-b border-gray-200/50">
        <div className="flex items-center gap-2">
          <DynamicIcon
            width="20"
            color={hasFiles ? "#10b981" : "#99A1AF"}
            name={iconProperties.name as any}
          />
          <h1 className="text-sm font-semibold text-gray-700">
            {docType.label}
          </h1>
          {hasFiles && (
            <span className="text-xs text-gray-500 font-medium">
              ({uploadedFiles.length})
            </span>
          )}
        </div>

        {!hasFiles && (
          <div className="bg-red-100 rounded-full flex items-center px-2 py-0.5">
            <span className="text-red-700 text-[10px] font-bold uppercase tracking-wider">
              Required
            </span>
          </div>
        )}
      </div>

      {/* File List or Upload Area */}
      <div className="flex-1 p-4">
        {hasFiles ? (
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 bg-green-100 p-2 rounded-lg">
                    <FileText className="text-green-600" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteFile(e, index)}
                  className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label={`Delete ${file.name}`}
                  title="Delete file"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center h-full cursor-pointer py-8"
          >
            <div className="w-full flex justify-center mb-3">
              {isDragging ? (
                <Upload className="text-blue-500" size={40} />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  width="40"
                  fill={isDragging ? "#3b82f6" : "#90A1B9"}
                  className="transition-colors"
                >
                  <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                </svg>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              {isDragging
                ? "Drop files to upload"
                : "Click to upload or drag & drop"}
            </h3>
            <small className="text-xs text-gray-500">
              PDF, JPG, PNG (Max 10MB per file)
            </small>
            <small className="text-xs text-gray-400 mt-1">
              Multiple files supported
            </small>
          </div>
        )}
      </div>

      {/* Add More Button (when files exist) */}
      {hasFiles && (
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-4 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            Add More Files
          </button>
        </div>
      )}
    </div>
  );
}
