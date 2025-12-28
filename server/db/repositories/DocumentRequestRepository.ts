import { db } from "../firebase";
import { OtpRecord } from "../../types";
import { documentRequestConverter } from "../converters/documentRequestConverter";

export class OtpRepository {
  collectionName = "document_requests";

  get collectionRef() {
    return db
      .collection(this.collectionName)
      .withConverter(documentRequestConverter);
  }

  async save(otp: OtpRecord & { id?: string }) {
    if (otp.id) {
      await this.collectionRef.doc(otp.id).set(otp, { merge: true });
    } else {
      await this.collectionRef.add(otp);
    }
  }

  async get(documentRequestId: string) {
    const docRef = this.collectionRef.doc(documentRequestId);

    const snapshot = await docRef.get();

    if (!snapshot.exists) return null;

    return { id: snapshot.id, ...snapshot.data() };
  }

  async getAll() {
    const snapshot = await this.collectionRef.get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async delete(otps: string[]) {
    const deletions = otps.map((o) => this.collectionRef.doc(o).delete());
    await Promise.all(deletions);
  }
}
