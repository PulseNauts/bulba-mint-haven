import { useEffect, useRef } from "react";

export const LoadingAnimation = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <video
        ref={videoRef}
        className="max-w-md w-full rounded-lg"
        src="/animation.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};