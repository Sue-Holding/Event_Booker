import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      width: "100%",
      backgroundColor: "#ffcc00",
      color: "#000",
      textAlign: "center",
      padding: "0.5rem",
      zIndex: 9999
    }}>
      You’re offline 😕 Your changes will sync when back online.
    </div>
  );
}
