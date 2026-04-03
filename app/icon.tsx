import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#1A1A2E",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#4FC3F7" strokeWidth="2" strokeLinejoin="round" />
        <line x1="3" y1="6" x2="21" y2="6" stroke="#4FC3F7" strokeWidth="2" />
        <path d="M16 10a4 4 0 01-8 0" stroke="#4FC3F7" strokeWidth="2" />
      </svg>
    </div>,
    { ...size }
  );
}
