import { useEffect, useRef, useState } from "react";
import GeoTIFF, { GeoTIFFImage, fromArrayBuffer, fromUrl } from "geotiff";
import { loadStatuses, LoadStatuses } from "./loadStatuses";
import LoadStatusImage from "./LoadStatusImage";

const useTIFF = ({
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

  const [tiffInstance, setTiffInstance] = useState<GeoTIFF>();
  const [tiffImage, setTiffImage] = useState<GeoTIFFImage>();

  useEffect(() => {
    if (hasArrayBuffer || hasArrayFileUrl) {
      const loadTIFFInstance = async () => {
        try {
          const geoTiffInstance =
            hasArrayFileUrl && fileUrlRef.current
              ? await fromUrl(fileUrlRef.current)
              : hasArrayBuffer && arrayBufferRef.current
                ? await fromArrayBuffer(arrayBufferRef.current)
                : undefined;

          if (!geoTiffInstance) {
            throw new Error(`Impossible open TIFF image ${fileUrlRef.current}`);
          }

          setTiffInstance(geoTiffInstance);
        } catch (error) {
          console.error(error);
          onLoadErrorRef.current();
        }
      };

      loadTIFFInstance();
    }
  }, [hasArrayBuffer, hasArrayFileUrl]);

  useEffect(() => {
    if (tiffInstance) {
      const loadTiffImage = async () => {
        try {
          const tiffImage = await tiffInstance.getImage();
          setTiffImage(tiffImage);
        } catch (error) {
          console.error(error);
          onLoadErrorRef.current();
        }
      };
      loadTiffImage();
    }
  }, [tiffInstance]);

  useEffect(() => {
    if (canvasRef.current && tiffImage) {
      const canvas = canvasRef.current;

      const width = tiffImage.getWidth();
      const height = tiffImage.getHeight();

      canvas.width = width;
      canvas.height = height;

      const canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;
      canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);

      const imageData = canvasContext.getImageData(0, 0, width, height);

      const renderTiff = (tiffPixels: Uint8Array) => {
        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            const srcIdx = 3 * i * width + 3 * j;
            const idx = 4 * i * width + 4 * j;
            imageData.data[idx] = tiffPixels[srcIdx];
            imageData.data[idx + 1] = tiffPixels[srcIdx + 1];
            imageData.data[idx + 2] = tiffPixels[srcIdx + 2];
            imageData.data[idx + 3] = 255;
          }
        }

        canvasContext.putImageData(imageData, 0, 0);
        onLoadSuccessRef.current();
      };

      const loadTiffRenderData = async () => {
        try {
          const tiffPixels = (await tiffImage.readRGB()) as Uint8Array;
          renderTiff(tiffPixels);
        } catch (error) {
          console.error(error);
          onLoadErrorRef.current();
        }
      };

      loadTiffRenderData();
    }
  }, [tiffImage]);
};

export default function FilePreviewerTIFF({
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

  useTIFF({
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
