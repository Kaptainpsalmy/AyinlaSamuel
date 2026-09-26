import { renderMark } from "@/lib/brand-mark";

// Browser tab icon and manifest icon. Browsers scale it down for the tab.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return renderMark(512);
}
