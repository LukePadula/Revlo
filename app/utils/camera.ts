export default async function detectCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return false;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === "videoinput");
  } catch (err) {
    console.error("Error detecting camera:", err);
    return false;
  }
}
