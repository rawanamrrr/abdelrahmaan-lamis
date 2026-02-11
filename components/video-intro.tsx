"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface VideoIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Preload the invitation video in parallel so it is ready immediately after skipping
    const preloadVideo = document.createElement("video");
    preloadVideo.preload = "auto";
    preloadVideo.muted = true;
    preloadVideo.playsInline = true;
    preloadVideo.src = "/invitation-design.mp4";
    preloadVideo.load();

    const video = videoRef.current;
    if (!video) return;

    // Simple autoplay attempt - let the browser handle it
    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay blocked - browser will handle it
      });
    };

    // Try when video can play
    if (video.readyState >= 3) {
      playVideo();
      return;
    }

    video.addEventListener("canplay", playVideo, { once: true });

    return () => {
      video.removeEventListener("canplay", playVideo);
    };
  }, []);

  const finishIntro = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleVideoEnd = () => {
    finishIntro();
  };

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
      onClick={(e) => {
        e.stopPropagation();
        const video = videoRef.current;
        video?.pause();
        finishIntro();
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="w-full h-full flex items-center justify-center bg-black">
        <video 
          ref={videoRef}
          className="h-auto max-h-full w-auto max-w-full object-contain"
          playsInline={true}
          muted={true}
          autoPlay={true}
          onEnded={handleVideoEnd}
          preload="auto"
          disablePictureInPicture
          loop={false}
        >
          <source src="/engagement-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

    </div>
  );
}
