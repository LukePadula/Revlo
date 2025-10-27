import Button from "./button";
import Checkbox from "./checkbox";

export default function SubmissionConfirmation() {
  return (
    <div className="flex flex-col items-center space-y-4 mx-6">
      <Checkbox></Checkbox>
      <small className="text-gray-500">0 of 4 documents uploaded</small>
      <Button iconName="send" variant="brand" label="Submit Documents" />
    </div>
  );
}
