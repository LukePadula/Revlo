"use client";

import { useEffect, useRef, useState } from "react";

export default function IDCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsReady(true);
        }
      } catch (error) {
        console.error("Camera access denied:", error);
      }
    }
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setPhoto(dataUrl);
  };

  return (
    <div className="relative w-full h-[80vh] bg-black overflow-hidden flex items-center justify-center rounded-lg">
      {!photo && (
        <>
          {/* Camera preview */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute w-full h-full object-cover"
          />

          {/* ID frame overlay */}
          <div className="absolute w-[85%] aspect-[85.6/54] border-4 border-white rounded-md shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]" />

          {/* Capture button */}
          {isReady && (
            <button
              onClick={takePhoto}
              className="absolute bottom-8 bg-white text-black px-6 py-2 rounded-full font-semibold shadow-lg"
            >
              Capture
            </button>
          )}
        </>
      )}

      {/* Show captured photo */}
      {photo && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
          <img src={photo} alt="Captured" className="w-[85%] rounded-md" />
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setPhoto(null)}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Retake
            </button>
            <button
              onClick={() => alert("Photo saved!")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Use Photo
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
