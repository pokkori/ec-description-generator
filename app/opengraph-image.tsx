import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EC説明文生成AI｜商品情報を入力するだけでプロ品質の説明文を自動生成";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #4338ca 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 12, display: "flex" }}>🛒</div>
        <div style={{ fontSize: 48, fontWeight: 700, color: "#fff", marginBottom: 12, textAlign: "center", display: "flex" }}>
          EC説明文生成AI
        </div>
        <div style={{ fontSize: 26, color: "#c7d2fe", textAlign: "center", maxWidth: 900, marginBottom: 8, display: "flex" }}>
          商品情報を入力するだけでプロ品質の説明文を自動生成
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {["Amazon対応", "Yahoo!対応", "Mercari対応", "一括10商品生成"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 20px",
                background: "rgba(199,210,254,0.15)",
                border: "1px solid rgba(199,210,254,0.3)",
                borderRadius: 24,
                fontSize: 18,
                color: "#e0e7ff",
                display: "flex",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 32,
            padding: "12px 36px",
            background: "#4338ca",
            borderRadius: 40,
            fontSize: 22,
            color: "#fff",
            fontWeight: 600,
            display: "flex",
          }}
        >
          無料1商品 → ¥980/月〜
        </div>
      </div>
    ),
    { ...size }
  );
}
