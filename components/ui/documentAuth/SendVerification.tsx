"use client";
import { DynamicIcon } from "lucide-react/dynamic";
import DocumentIcon from "../core/documentIcon";
import PageCard from "../core/pageCard";
import Button from "../core/button";
import { useUIStore } from "@/store/uiStore";
import { sendEmailVerification } from "@/app/lib/api/emailVerification";
import { useParams } from "next/navigation";

export default function SendVerification() {
  const { verifyInputPage, setVerifyInputPage } = useUIStore();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const submit = async () => {
    sendEmailVerification(id);
    setVerifyInputPage();
  };

  return (
    <div className="p-8 flex gap-4 flex-col justify-center items-center">
      <DocumentIcon iconName="at-sign" colourVariant="blue" />
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-center">
          Email Verification
        </h1>
        <small className="text-gray-400 text-center">
          We’ll send a verification code to confirm your identity
        </small>

        <div
          className="flex gap-4 p-2 rounded items-center border-gray-200 border"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <div className="p-1">
            <DynamicIcon name="mail" color="#6B7280" size="22" />
          </div>
          <div>
            <div>
              <small className="text-gray-400 text-xs">
                Verification will be sent to
              </small>
            </div>
            <div>
              <small className="font-semibold">luke@test.com</small>
            </div>
          </div>
        </div>
        <Button
          label="Send Verification Code"
          variant="brand"
          iconName="send"
          fullWidth={true}
          onClick={submit}
        />
        <div className="text-center text-sm">
          <small className="text-gray-400">Need help?</small>
          <small> </small>
          <small className="underline brand-text-colour font-bold">
            Contact Sender
          </small>
        </div>
      </div>
    </div>
  );
}
