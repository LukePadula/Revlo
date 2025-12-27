"use client";
import { useState, useEffect } from "react";
import Modal from "../core/Modal";
import Button from "../core/button";
import InputField from "../core/inputs/InputField";
import { DocListType } from "@/types";

interface Props {
  document: DocListType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDocument: DocListType) => void;
}

export default function EditDocumentModal({
  document,
  isOpen,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState(document.label);
  const [description, setDescription] = useState(document.description || "");

  useEffect(() => {
    if (isOpen) {
      setTitle(document.label);
      setDescription(document.description || "");
    }
  }, [isOpen, document]);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }
    onSave({
      ...document,
      label: title.trim(),
      description: description.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div>
        <div className="mt-2 mb-2 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Edit Document
          </h2>
          <p className="text-sm text-gray-600">
            Update the title and description for this document.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <InputField
            label="Title"
            placeholder="Enter document title"
            value={title}
            onChange={setTitle}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            label="Cancel"
            variant="ghost"
            onClick={onClose}
            size="medium"
          />
          <Button
            label="Save Changes"
            variant="brand"
            onClick={handleSave}
            size="medium"
            disabled={!title.trim()}
          />
        </div>
      </div>
    </Modal>
  );
}
