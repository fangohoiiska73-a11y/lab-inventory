"use client";
import { useEffect, useRef, useState } from "react";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onClear?: () => void;
  value?: string; // dataUrl foto yang sudah diambil (kalau ada)
  label?: string;
}

// Deklarasi tipe minimal untuk FaceDetector (API eksperimental, baru ada di sebagian browser Chromium)
declare global {
  interface Window {
    FaceDetector?: new (options?: { fastMode?: boolean; maxDetectedFaces?: number }) => {
      detect: (input: CanvasImageSource) => Promise<Array<unknown>>;
    };
  }
}

export default function CameraCapture({ onCapture, onClear, value, label = "Foto Bukti" }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [faceWarning, setFaceWarning] = useState("");
  const faceDetectionSupported = typeof window !== "undefined" && !!window.FaceDetector;

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
    setError("");
    setFaceWarning("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch (err) {
      setError("Tidak bisa mengakses kamera. Pastikan kamu memberi izin akses kamera di browser.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  }

  async function handleCapture() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Verifikasi dasar: cek apakah ada wajah terdeteksi (kalau browser mendukung FaceDetector)
    setChecking(true);
    setFaceWarning("");

    if (faceDetectionSupported && window.FaceDetector) {
      try {
        const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
        const faces = await detector.detect(canvas);
        if (faces.length === 0) {
          setFaceWarning(
            "Wajah tidak terdeteksi pada foto. Pastikan wajah kamu terlihat jelas sambil memegang alat, lalu ambil ulang foto."
          );
          setChecking(false);
          return; // Jangan lanjut simpan foto kalau wajah tidak terdeteksi
        }
      } catch {
        // Kalau deteksi gagal karena alasan teknis, lanjutkan tanpa blokir
        // (supaya user tidak stuck kalau API browser bermasalah)
      }
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    onCapture(dataUrl);
    setChecking(false);
    stopCamera();
  }

  function handleRetake() {
    setFaceWarning("");
    onClear?.();
    startCamera();
  }

  return (
    <div>
      {!value && !active && (
        <button
          type="button"
          onClick={startCamera}
          className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 hover:border-emerald-400/50 hover:bg-white/[0.03] transition py-8 text-sm text-slate-400"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8 text-emerald-400">
            <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
          <span className="font-medium text-slate-200">Aktifkan Kamera</span>
          <span className="text-xs text-slate-500">{label} — foto wajib diambil langsung, tidak bisa upload file</span>
        </button>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
          {error}
        </p>
      )}

      {active && (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-square max-w-xs mx-auto">
            <video ref={videoRef} className="w-full h-full object-cover -scale-x-100" muted playsInline />
          </div>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleCapture}
              disabled={checking}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-600 transition px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {checking ? "Memeriksa..." : "📸 Ambil Foto"}
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="rounded-lg border border-white/10 hover:bg-white/5 transition px-5 py-2.5 text-sm font-medium text-slate-300"
            >
              Batal
            </button>
          </div>
          {faceWarning && (
            <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3.5 py-2.5 max-w-xs mx-auto text-center">
              {faceWarning}
            </p>
          )}
          {!faceDetectionSupported && (
            <p className="text-xs text-slate-500 text-center">
              Catatan: browser ini tidak mendukung deteksi wajah otomatis — foto tetap bisa diambil, verifikasi akhir dilakukan admin.
            </p>
          )}
        </div>
      )}

      {value && (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-emerald-400/30 max-w-xs mx-auto">
            <img src={value} alt="Foto bukti" className="w-full h-full object-cover -scale-x-100" />
            <span className="absolute top-2 right-2 bg-emerald-500 text-[#05070f] text-xs font-semibold px-2 py-0.5 rounded-md">
              ✓ Foto Diambil
            </span>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleRetake}
              className="rounded-lg border border-white/10 hover:bg-white/5 transition px-4 py-2 text-sm font-medium text-slate-300"
            >
              Ambil Ulang
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}