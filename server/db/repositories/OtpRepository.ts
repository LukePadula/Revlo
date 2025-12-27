import { db } from "../firebase";
import { OtpRecord } from "../../types";
import { otpConverter } from "../converters/otpConverter";

export class OtpRepository {
  collectionName = "otps";

  get collectionRef() {
    return db.collection(this.collectionName).withConverter(otpConverter);
  }

  async saveOtp(otp: OtpRecord & { id?: string }) {
    if (otp.id) {
      await this.collectionRef.doc(otp.id).set(otp, { merge: true });
    } else {
      await this.collectionRef.add(otp);
    }
  }

  async setOtp(otp: OtpRecord) {
    await this.collectionRef.add(otp);
  }

  async getOtps(documentRequestId: string) {
    const snapshot = await this.collectionRef
      .where("documentRequestId", "==", documentRequestId)
      .where("status", "==", "Active")
      .get();

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  }

  async deleteOtps(otps: string[]) {
    const deletions = otps.map((o) => this.collectionRef.doc(o).delete());

    await Promise.all(deletions);
  }
}
