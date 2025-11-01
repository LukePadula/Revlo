import Button from "./button";
import Checkbox from "./checkbox";

export default function SubmissionConfirmation() {
  return (
    <div className="flex flex-col items-center md:items-end space-y-4 mx-6">
      <Checkbox></Checkbox>
      <div className="flex flex-col md:flex-row w-full max-w-sm items-center justify-center">
        <small className="text-gray-500 w-full">
          0 of 4 documents uploaded
        </small>
        <Button
          iconName="send"
          variant="brand"
          label="Submit Documents"
          fullWidth={true}
        />
      </div>
    </div>
  );
}
