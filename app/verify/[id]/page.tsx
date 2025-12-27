"use client";
import { useUIStore } from "@/store/uiStore";
import Nav from "../../../components/ui/nav";
import Modal from "@/components/ui/core/Modal";
import OneTimePasscode from "@/components/ui/documentAuth/OneTimePasscode";
import SendVerification from "@/components/ui/documentAuth/SendVerification";

export default function Page() {
  const { verifyInputPage, setVerifyInputPage } = useUIStore();

  return (
    <div>
      <Nav></Nav>
      <div className="w-full flex justify-center items-center mt-[6vw]">
        <div className="">
          <Modal>
            {verifyInputPage === "send" ? (
              <SendVerification />
            ) : (
              <OneTimePasscode />
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}
