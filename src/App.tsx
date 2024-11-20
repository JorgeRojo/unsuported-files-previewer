import styled from "styled-components";

import FileUrlPreviewer from "./FileUrlPreviewer";
import { testFileUrls } from "./constants";
import FileUplaodPreviewer from "./FileUplaodPreviewer";

const AppStyled = styled.div`
  font-family: sans-serif;
  text-align: center;
`;

const FileListStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export default function App() {
  console.log("App");
  return (
    <AppStyled>
      <h1>Unsupported files list previewer</h1>
      <FileListStyled>
        {testFileUrls.map((fileUrl, index) => (
          <FileUrlPreviewer key={index} fileUrl={fileUrl} />
        ))}
      </FileListStyled>
      <hr />
      <h1>Uploaded file previewer</h1>
      <FileUplaodPreviewer />
    </AppStyled>
  );
}
