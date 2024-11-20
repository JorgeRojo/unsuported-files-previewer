import { fileTypeFromBuffer } from "file-type";
import { MIME_TYPES, imagePlaceholder, noValidImage } from "./constants";
import styled from "styled-components";
import { ChangeEvent, useState } from "react";
import FilePreviewerTIFF from "./FilePreviewerTIFF";
import FilePreviewerPDF from "./FilePreviewerPDF";

const PreviewStyled = styled.div`
  width: 200px;
  height: 200px;
  border: solid 8px #ccc;
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  > * {
    max-width: 100%;
    max-height: 100%;
  }
`;

export default function FileUplaodPreviewer(): JSX.Element {
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);

  const handleFileReaderLoad = (event: ProgressEvent<FileReader>) => {
    const buffer = event.target?.result ?? null;
    if (buffer instanceof ArrayBuffer) {
      setArrayBuffer(buffer);
      fileTypeFromBuffer(buffer).then((type) => {
        setMimeType(type?.mime ?? null);
      });
    }
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0] ?? null;
    if (file) {
      setMimeType(null);
      setArrayBuffer(null);
      const reader = new FileReader();
      reader.addEventListener("load", handleFileReaderLoad, { once: true });
      reader.readAsArrayBuffer(file);
    }
  };

  let renderer = <img src={imagePlaceholder} />;

  if (arrayBuffer != null) {
    switch (mimeType) {
      case MIME_TYPES.IMAGE_TIFF:
        renderer = <FilePreviewerTIFF arrayBuffer={arrayBuffer} />;
        break;
      case MIME_TYPES.APPLICATION_PDF:
        renderer = <FilePreviewerPDF arrayBuffer={arrayBuffer} />;
        break;
      case MIME_TYPES.IMAGE_JPEG:
      case MIME_TYPES.IMAGE_JPG:
      case MIME_TYPES.IMAGE_PNG:
      case MIME_TYPES.IMAGE_WEBP:
      case MIME_TYPES.IMAGE_AVIF:
        {
          const blob = new Blob([arrayBuffer]);
          const url = URL.createObjectURL(blob);
          renderer = <img src={url} />;
        }
        break;
      default:
        renderer = <img src={noValidImage} />;
        break;
    }
  }

  return (
    <>
      <PreviewStyled>{renderer}</PreviewStyled>
      {mimeType && <p>{mimeType}</p>}
      <input type="file" onChange={handleOnChange} />
    </>
  );
}
