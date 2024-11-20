import styled from "styled-components";
import FilePreviewerPDF from "./FilePreviewerPDF";
import FilePreviewerTIFF from "./FilePreviewerTIFF";
import { fileTypeFromStream } from "file-type";
import { useEffect, useState } from "react";
import { MIME_TYPES, imagePlaceholder, noValidImage } from "./constants";
import { loadStatuses, LoadStatuses } from "./loadStatuses";

const FilePreviewerStyled = styled.div`
  padding: 8px;
  background: #ccc;
  font-size: 10px;

  > .title {
    margin: 8px 0 0 0;
    word-wrap: break-word;
    max-width: 100px;
  }

  > .previewer {
    width: 100px;
    height: 100px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    > * {
      max-width: 100%;
      max-height: 100%;
    }
  }
`;

const useMimeType = ({
  fileUrl,
  onLoadSuccess,
  onLoadError,
}: {
  fileUrl: string;
  onLoadSuccess: () => void;
  onLoadError: () => void;
}): { mimeType: string } => {
  const [mimeType, setMimeType] = useState<string>("unknown");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(fileUrl, {
          mode: "no-cors",
          cache: "no-cache",
          redirect: "follow",
          referrerPolicy: "no-referrer",
        });

        const type = await fileTypeFromStream(response.body);
        if (type?.mime == null) {
          throw new Error(`Impossible open file ${fileUrl}`);
        }

        setMimeType(type.mime);
        onLoadSuccess();
      } catch (error) {
        console.error(error);
        onLoadError();
      }
    })();
  }, [fileUrl]);

  return { mimeType };
};

export default function FileUrlPreviewer({
  fileUrl,
}: {
  fileUrl: string;
}): JSX.Element {
  const [loadStatus, setLoadStatus] = useState<LoadStatuses>(loadStatuses.IDLE);

  const handleLoadSuccess = () => {
    setLoadStatus(loadStatuses.SUCCESS);
  };

  const handleLoadError = () => {
    setLoadStatus(loadStatuses.ERROR);
  };

  const { mimeType } = useMimeType({
    fileUrl,
    onLoadSuccess: handleLoadSuccess,
    onLoadError: handleLoadError,
  });

  let renderer = <img src={imagePlaceholder} />;

  if (loadStatus === loadStatuses.ERROR) {
    renderer = <img src={noValidImage} />;
  }

  if (loadStatus === loadStatuses.SUCCESS) {
    switch (mimeType) {
      case MIME_TYPES.IMAGE_TIFF:
        renderer = <FilePreviewerTIFF fileUrl={fileUrl} />;
        break;
      case MIME_TYPES.APPLICATION_PDF:
        renderer = <FilePreviewerPDF fileUrl={fileUrl} />;
        break;
      case MIME_TYPES.IMAGE_JPEG:
      case MIME_TYPES.IMAGE_JPG:
      case MIME_TYPES.IMAGE_PNG:
      case MIME_TYPES.IMAGE_WEBP:
      case MIME_TYPES.IMAGE_AVIF:
        renderer = <img src={fileUrl} />;
        break;
      default:
        renderer = <img src={noValidImage} />;
        break;
    }
  }

  return (
    <FilePreviewerStyled>
      <div className="previewer">{renderer}</div>
      <p className="title"> {fileUrl}</p>
      <p className="title">
        <b>{mimeType}</b>
      </p>
    </FilePreviewerStyled>
  );
}
