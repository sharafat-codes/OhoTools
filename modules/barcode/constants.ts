export const BARCODE_FORMATS = [
  { value: "code128", label: "Code 128", example: "ABC-12345" },
  { value: "code39", label: "Code 39", example: "ABC123" },
  { value: "code93", label: "Code 93", example: "ABC123" },
  { value: "ean13", label: "EAN-13", example: "5901234123457" },
  { value: "ean8", label: "EAN-8", example: "96385074" },
  { value: "upca", label: "UPC-A", example: "036000291452" },
  { value: "upce", label: "UPC-E", example: "01234565" },
  { value: "itf14", label: "ITF-14", example: "15400141288763" },
  { value: "codabar", label: "Codabar", example: "A40156B" },
  { value: "datamatrix", label: "Data Matrix (2D)", example: "Hello world" },
  { value: "pdf417", label: "PDF417 (2D)", example: "Hello world" },
] as const;

export const BARCODE_FORMAT_VALUES = BARCODE_FORMATS.map((f) => f.value);

export type BarcodeFormat = (typeof BARCODE_FORMATS)[number]["value"];
