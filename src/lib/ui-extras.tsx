import {
  ActivityIcon,
  AmpersandIcon,
  ApertureIcon,
  ArchiveIcon,
  AwardIcon,
  BackpackIcon,
  BalloonIcon,
  BeakerIcon,
  BlocksIcon,
  BookIcon,
  BracesIcon,
} from "lucide-react";
import { hexToRgb } from "./utils";

export const Icons = {
  activity: ActivityIcon,
  archive: ArchiveIcon,
  aperture: ApertureIcon,
  ampersand: AmpersandIcon,
  award: AwardIcon,
  backpack: BackpackIcon,
  balloon: BalloonIcon,
  beaker: BeakerIcon,
  blocks: BlocksIcon,
  book: BookIcon,
  braces: BracesIcon,
} as const;

export const AccentColors = {
  sky: "#7DD3FC", // light sky blue
  cyan: "#67E8F9", // soft cyan glow
  mint: "#6EE7B7", // fresh mint
  emerald: "#A7F3D0", // pastel green
  lime: "#BEF264", // playful lime
  lemon: "#FDE68A", // warm yellow
  peach: "#FDBA74", // peachy pop
  coral: "#FDA4AF", // soft coral
  rose: "#F9A8D4", // bubblegum pink
  lavender: "#DDD6FE", // dreamy purple
  periwinkle: "#C7D2FE", // friendly indigo
  ice: "#E0F2FE", // ultra-soft blue
} as const;

export type IconName = keyof typeof Icons;
export type AccentColorName = keyof typeof AccentColors;

const DEFAULT_ICON = Icons.activity;
const DEFAULT_ACCENT_COLOR = AccentColors.sky;

function hasKey<T extends Record<string, unknown>>(
  obj: T,
  key: string
): key is Extract<keyof T, string> {
  return Object.hasOwn(obj, key);
}

export function getIcon(icon: IconName | string | null | undefined) {
  if (!icon) return DEFAULT_ICON;

  return hasKey(Icons, icon) ? Icons[icon] : DEFAULT_ICON;
}

export function getAccentColor(
  color: AccentColorName | string | null | undefined
) {
  const hex = !color
    ? DEFAULT_ACCENT_COLOR
    : hasKey(AccentColors, color)
    ? AccentColors[color]
    : DEFAULT_ACCENT_COLOR;

  return hexToRgb(hex);
}
