import { noValidImage, imagePlaceholder } from "./constants";
import { loadStatuses } from "./loadStatuses";
import type { LoadStatuses } from "./loadStatuses";

export default function LoadStatusImage({
  loadStatus,
}: {
  loadStatus: LoadStatuses;
}) {
  if (loadStatus === loadStatuses.IDLE) {
    return <img src={imagePlaceholder} />;
  }

  if (loadStatus === loadStatuses.ERROR) {
    return <img src={noValidImage} />;
  }

  return <></>;
}
