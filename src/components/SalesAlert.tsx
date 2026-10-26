import React, { useState, useEffect } from "react";
import { SALES_ALERTS, PRODUCT_NAME } from "../data/content";

export const SalesAlert: React.FC = () => {
  // Randomise which name shows first so repeat visitors see different names
  const [index, setIndex] = useState(() => Math.floor(Math.random() * SALES_ALERTS.length));
  const [status, setStatus] = useState<"visible" | "fading" | "paused">("visible");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status === "visible") {
      // Shows for 4 seconds
      timer = setTimeout(() => {
        setStatus("fading");
      }, 4000);
    } else if (status === "fading") {
      // Fades out in 0.5 seconds
      timer = setTimeout(() => {
        setStatus("paused");
        // Cycle in order then loop
        setIndex((prev) => (prev + 1) % SALES_ALERTS.length);
      }, 500);
    } else if (status === "paused") {
      // Pauses for 1.5 seconds before next fades in
      timer = setTimeout(() => {
        setStatus("visible");
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [status]);

  const handleClose = () => {
    // Closes current notification, but comes back with the next name automatically after pause
    setStatus("fading");
  };

  const buyer = SALES_ALERTS[index];

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "60px",
        left: "14px",
        zIndex: 9999,
        width: "280px",
        background: "#ffffff",
        borderLeft: "4px solid #0B7A6E",
        borderRadius: "12px",
        boxShadow: "0 12px 30px rgba(20, 33, 61, 0.18)",
        padding: "12px 14px",
        fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
        opacity: status === "visible" ? 1 : 0,
        transform: status === "visible" ? "translateY(0)" : "translateY(-8px)",
        transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
        pointerEvents: status === "visible" ? "auto" : "none",
        borderTop: "1px solid #F1F3F7",
        borderRight: "1px solid #F1F3F7",
        borderBottom: "1px solid #F1F3F7",
      }}
    >
      {/* Tiny X button to close (comes back with next name automatically) */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close notification"
        style={{
          position: "absolute",
          top: "6px",
          right: "8px",
          border: 0,
          background: "none",
          fontSize: "16px",
          color: "#9AA2B1",
          cursor: "pointer",
          lineHeight: 1,
          padding: "2px",
        }}
      >
        ×
      </button>

      {/* Row 1: Green pulsing dot + "Recent Purchase" in BRAND_COLOR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          fontSize: "11px",
          fontWeight: 800,
          color: "#0B7A6E",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        <span
          className="pulse-dot"
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#16A34A",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span>Recent Purchase</span>
      </div>

      {/* Row 2: Buyer's name and city in bold 14px dark text */}
      <div
        style={{
          fontWeight: 800,
          fontSize: "14px",
          color: "#14213D",
          marginTop: "4px",
          lineHeight: 1.25,
        }}
      >
        {buyer.name}, {buyer.city}
      </div>

      {/* Row 3: "just purchased PRODUCT_NAME · [time]" in 12px grey text */}
      <div
        style={{
          fontSize: "12px",
          color: "#5B6474",
          marginTop: "3px",
          lineHeight: 1.3,
        }}
      >
        just purchased {PRODUCT_NAME} · {buyer.time}
      </div>
    </div>
  );
};
