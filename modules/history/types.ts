import type { QRErrorLevel, QRModuleStyle } from "@/modules/qr/validations";

export type QrHistoryItem = {
  kind: "qr";
  id: string;
  name: string | null;
  data: string;
  fgColor: string;
  bgColor: string;
  size: number;
  margin: number;
  ecLevel: QRErrorLevel;
  moduleStyle: QRModuleStyle;
  gradient: boolean;
  fgColor2: string | null;
  logo: string | null;
  createdAt: string;
};

export type BarcodeHistoryItem = {
  kind: "barcode";
  id: string;
  name: string | null;
  data: string;
  format: string;
  scale: number;
  height: number;
  includeText: boolean;
  createdAt: string;
};

export type HistoryItem = QrHistoryItem | BarcodeHistoryItem;
