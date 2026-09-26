import { renderMark } from "@/lib/brand-mark";

// Home-screen icon on iPhone/iPad.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderMark(180);
}
