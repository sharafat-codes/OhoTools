import {
  CreditCardIcon,
  GiftIcon,
  HistoryIcon,
  KeyIcon,
  LayoutDashboardIcon,
  QrCodeIcon,
  ScanBarcodeIcon,
  SettingsIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Tools not yet shipped (Phase 2). Rendered disabled with a "Soon" badge. */
  soon?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { label: "All Tools", href: "/tools", icon: WrenchIcon },
  { label: "QR Codes", href: "/dashboard/qr", icon: QrCodeIcon },
  { label: "Dynamic Links", href: "/dashboard/links", icon: ZapIcon },
  { label: "Barcodes", href: "/dashboard/barcodes", icon: ScanBarcodeIcon },
  { label: "Cards", href: "/dashboard/cards", icon: GiftIcon },
  { label: "History", href: "/dashboard/history", icon: HistoryIcon },
  { label: "API Keys", href: "/dashboard/api-keys", icon: KeyIcon },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCardIcon },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];
