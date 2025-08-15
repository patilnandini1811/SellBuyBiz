"use client";
import { useRouter } from "next/navigation";

export default function BackArrow() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className="fixed left-4 top-4 z-50 rounded-full p-2 text-white/90 hover:bg-white/10 focus:outline-none"
      title="Back"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
