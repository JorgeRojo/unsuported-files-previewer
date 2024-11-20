import { useEffect, useRef, useState } from "react";
import { LoadStatuses, loadStatuses } from "./loadStatuses";
import LoadStatusImage from "./LoadStatusImage";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";


import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker?url";

// https://github.com/mozilla/pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;


const usePDF = ({
  arrayBuffer,
  canvasRef: canvasRefForward,
  fileUrl,
  onLoadError,
  onLoadSuccess,
}: {
  arrayBuffer?: ArrayBuffer;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fileUrl?: string;
  onLoadError: () => void;
  onLoadSuccess: () => void;
}) => {

  const arrayBufferRef = useRef(arrayBuffer);
  const canvasRef = useRef(canvasRefForward.current);
  const fileUrlRef = useRef(fileUrl);
  const onLoadErrorRef = useRef(onLoadError);
  const onLoadSuccessRef = useRef(onLoadSuccess);

  useEffect(() => {
    arrayBufferRef.current = arrayBuffer;
    canvasRef.current = canvasRefForward.current;
    fileUrlRef.current = fileUrl;
    onLoadErrorRef.current = onLoadError;
    onLoadSuccessRef.current = onLoadSuccess;
  }, [
    arrayBuffer,
    canvasRefForward,
    fileUrl,
    onLoadError,
    onLoadSuccess
  ]);



  const hasArrayFileUrl = fileUrl != null;
  const hasArrayBuffer = !hasArrayFileUrl && arrayBuffer != null;

  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();
  const [pdfPage, setPdfPage] = useState<PDFPageProxy>();

  useEffect(() => {
    const getDocumentConfig = hasArrayFileUrl
      ? { url: fileUrlRef.current }
      : hasArrayBuffer
        ? { data: arrayBufferRef.current }
        : undefined;

    if (getDocumentConfig) {
      const loadPdfDocument = async () => {
        try {
          const pdfDocument = await pdfjs.getDocument(getDocumentConfig)
            .promise;
          setPdfDocument(pdfDocument);
        } catch (error) {
          console.error(error);
          onLoadErrorRef.current();
        }
      };

      loadPdfDocument();
    }
  }, [hasArrayBuffer, hasArrayFileUrl]);

  useEffect(() => {
    if (pdfDocument) {
      const loadPdfPage = async () => {
        try {
          const pdfPage = await pdfDocument.getPage(1);
          setPdfPage(pdfPage);
        } catch (error) {
          console.error(error);
          onLoadErrorRef.current();
        }
      };
      loadPdfPage();
    }
  }, [pdfDocument]);

  useEffect(() => {
    if (canvasRef.current && pdfPage) {
      const viewport = pdfPage.getViewport({ scale: 1, rotation: 0 });

      const canvas = canvasRef.current;
      canvas.height = viewport.height * window.devicePixelRatio;
      canvas.width = viewport.width * window.devicePixelRatio;

      const canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;
      canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);

      const renderPdf = async () => {
        try {
          await pdfPage.render({
            canvasContext,
            viewport,
          }).promise;
          onLoadSuccessRef.current();
        } catch (error) {
          console.error(error);
          onLoadErrorRef.current();
        }
      };
      renderPdf();
    }
  }, [pdfPage]);
};

export default function FilePreviewerPDF({
  arrayBuffer,
  fileUrl,
}: {
  arrayBuffer?: ArrayBuffer;
  fileUrl?: string;
}): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loadStatus, setLoadStatus] = useState<LoadStatuses>(loadStatuses.IDLE);

  const handleLoadSuccess = () => {
    setLoadStatus(loadStatuses.SUCCESS);
  };

  const handleLoadError = () => {
    setLoadStatus(loadStatuses.ERROR);
  };

  usePDF({
    arrayBuffer,
    canvasRef,
    fileUrl,
    onLoadError: handleLoadError,
    onLoadSuccess: handleLoadSuccess,
  });

  return (
    <>
      <LoadStatusImage loadStatus={loadStatus} />
      <canvas
        ref={canvasRef}
        style={loadStatus !== loadStatuses.SUCCESS ? { display: "none" } : {}}
      ></canvas>
    </>
  );
}
