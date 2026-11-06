"use client";

import { useEffect } from "react";

// tells the inline script in layout.tsx that the app hydrated, so it keeps `js`
export default function MotionReady() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);
  return null;
}
