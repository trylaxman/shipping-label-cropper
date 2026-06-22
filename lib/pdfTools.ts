import { PDFDocument } from "pdf-lib";

export type Marketplace = "amazon" | "flipkart";

const FLIPKART_FALLBACK_SPLIT_RATIO = 0.54;

async function getFlipkartDottedLineRatio(file: File): Promise<number | null> {
  try {
    if (typeof window === "undefined") return null;

    const pdfjsLib = await import("pdfjs-dist");

    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
    }).promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context) return null;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    let bestY = -1;
    let bestScore = 0;

    const minY = Math.floor(height * 0.35);
    const maxY = Math.floor(height * 0.75);

    for (let y = minY; y < maxY; y++) {
      let darkPixels = 0;
      let transitions = 0;
      let previousDark = false;

      for (let x = Math.floor(width * 0.02); x < Math.floor(width * 0.98); x++) {
        const index = (y * width + x) * 4;

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        const brightness = (r + g + b) / 3;
        const isDark = brightness < 90;

        if (isDark) darkPixels++;

        if (x > 0 && isDark !== previousDark) {
          transitions++;
        }

        previousDark = isDark;
      }

      const scanWidth = width * 0.96;
      const darkRatio = darkPixels / scanWidth;

      /**
       * Dotted/dashed separator line:
       * - enough dark pixels
       * - many black/white transitions
       * - not a solid text/table line
       */
      const score = darkRatio * transitions;

      if (darkRatio > 0.03 && darkRatio < 0.45 && transitions > 20) {
        if (score > bestScore) {
          bestScore = score;
          bestY = y;
        }
      }
    }

    if (bestY === -1) return null;

    /**
     * Canvas Y starts from top.
     * PDF Y starts from bottom.
     *
     * We need ratio from PDF bottom.
     */
    const ratioFromTop = bestY / height;
    const ratioFromBottom = 1 - ratioFromTop;

    if (ratioFromBottom < 0.35 || ratioFromBottom > 0.75) {
      return null;
    }

    return ratioFromBottom;
  } catch {
    return null;
  }
}

export async function validatePdfSelection(
  file: File,
  marketplace: Marketplace
) {
  try {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const pageCount = pdf.getPageCount();

    if (marketplace === "amazon") {
      if (pageCount < 2 || pageCount % 2 !== 0) {
        throw new Error(
          "Invalid Amazon PDF. Amazon file should have shipping labels on odd pages and invoices on even pages."
        );
      }
    }

    if (marketplace === "flipkart") {
      if (pageCount < 1) {
        throw new Error("Invalid Flipkart PDF.");
      }

      const firstPage = pdf.getPages()[0];
      const { width, height } = firstPage.getSize();

      if (height <= width) {
        throw new Error(
          "Invalid Flipkart PDF. Flipkart file should be a portrait PDF with shipping label and invoice on the same page."
        );
      }
    }

    return true;
  } catch (error: any) {
    if (error?.message) throw error;
    throw new Error("Corrupt or unsupported PDF file.");
  }
}

export async function splitAmazonPdf(file: File) {
  const buffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(buffer);

  const shippingPdf = await PDFDocument.create();
  const invoicePdf = await PDFDocument.create();

  const pageCount = sourcePdf.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    if (i % 2 === 0) {
      const [copiedPage] = await shippingPdf.copyPages(sourcePdf, [i]);
      shippingPdf.addPage(copiedPage);
    } else {
      const [copiedPage] = await invoicePdf.copyPages(sourcePdf, [i]);
      invoicePdf.addPage(copiedPage);
    }
  }

  return {
    shippingBytes: await shippingPdf.save(),
    invoiceBytes: await invoicePdf.save(),
  };
}

export async function cropFlipkartPdf(file: File) {
  const detectedSplitRatio = await getFlipkartDottedLineRatio(file);

  const splitRatio = detectedSplitRatio ?? FLIPKART_FALLBACK_SPLIT_RATIO;

  const buffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(buffer);

  const shippingPdf = await PDFDocument.create();
  const invoicePdf = await PDFDocument.create();

  const pages = sourcePdf.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    const splitY = height * splitRatio;

    /**
     * Shipping label area:
     * top-center area above dotted separator
     */
    const labelLeft = width * 0.31;
    const labelRight = width * 0.69;
    const labelTop = height * 0.97;
    const labelBottom = splitY;

    /**
     * Invoice area:
     * full-width area below dotted separator
     */
    const invoiceTop = splitY;
    const invoiceBottom = 0;

    const shippingEmbedded = await shippingPdf.embedPage(page, {
      left: labelLeft,
      bottom: labelBottom,
      right: labelRight,
      top: labelTop,
    });

    const invoiceEmbedded = await invoicePdf.embedPage(page, {
      left: 0,
      bottom: invoiceBottom,
      right: width,
      top: invoiceTop,
    });

    const shippingWidth = labelRight - labelLeft;
    const shippingHeight = labelTop - labelBottom;

    const shippingPage = shippingPdf.addPage([shippingWidth, shippingHeight]);
    shippingPage.drawPage(shippingEmbedded, {
      x: 0,
      y: 0,
      width: shippingWidth,
      height: shippingHeight,
    });

    const invoiceHeight = invoiceTop - invoiceBottom;

    const invoicePage = invoicePdf.addPage([width, invoiceHeight]);
    invoicePage.drawPage(invoiceEmbedded, {
      x: 0,
      y: 0,
      width,
      height: invoiceHeight,
    });
  }

  return {
    shippingBytes: await shippingPdf.save(),
    invoiceBytes: await invoicePdf.save(),
  };
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;

  const blob = new Blob([arrayBuffer], {
    type: "application/pdf",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}