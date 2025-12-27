import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { OtpRecord } from "@/server/types";

export const otpConverter = {
  toFirestore(otp: OtpRecord) {
    return otp;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): OtpRecord {
    return snapshot.data() as OtpRecord;
  },
};
