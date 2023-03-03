import React from "react";
import { Button, Drawer, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function UploadDocs({ files, setFiles, disable }) {
  const props = {
    maxCount: 1,
    showUploadList: files.length > 0,
    onRemove: (file) => {
      const index = files.indexOf(file);
      const newFileList = files.slice();
      newFileList.splice(index, 1);
      setFiles(newFileList);
    },
    beforeUpload: (file) => {
      setFiles((fs) => [...fs, file]);
      return false;
    },
    files,
  };

  return (
    <Upload {...props}>
      <Button disabled={disable} type="primary" icon={<UploadOutlined />}>
        Upload File
      </Button>
    </Upload>
  );
}
