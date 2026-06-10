"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

export interface LightboxProps {
  src: string;
  alt: string;
}

export function Lightbox({
  src,
  alt,
  onClose,
}: LightboxProps & { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (!overlayRef.current || !imageRef.current || !closeRef.current) return;

      const tl = gsap.timeline();
      tl.from(overlayRef.current, { autoAlpha: 0, duration: 0.4, ease: "power3.out" })
        .from(
          imageRef.current,
          { autoAlpha: 0, scale: 0.96, y: 10, duration: 0.45, ease: "power3.out" },
          0.05,
        )
        .from(
          closeRef.current,
          { autoAlpha: 0, y: -6, duration: 0.3, ease: "power3.out" },
          0.2,
        );
    },
    { scope: overlayRef },
  );

  const handleClose = useCallback(() => {
    if (!overlayRef.current || !imageRef.current) return;

    gsap
      .timeline({ onComplete: onClose })
      .to(imageRef.current, {
        autoAlpha: 0,
        scale: 0.96,
        y: 10,
        duration: 0.28,
        ease: "power3.in",
      })
      .to(
        overlayRef.current,
        { autoAlpha: 0, duration: 0.22, ease: "power3.in" },
        0.06,
      );
  }, [onClose]);

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleClose();
    },
    [handleClose],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [handleClose]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div ref={imageRef} className="relative h-full w-full cursor-zoom-out">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-contain p-4 md:p-10"
        />
        <Button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={handleButtonClick}
          className="absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
}
