import { Box, Center, Button, Icon, useColorMode } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ImFolderUpload } from "react-icons/im";
import ReactPlayer from "react-player";
import axios from "axios";

const thumbsContainer = {
  marginTop: 0,
};

const thumb = {
  display: "inline-flex",
  width: "30vw",
  height: "40vh",
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  marginBottom: 0,
};

const img = {
  display: "block",
  width: "30vw",
  height: "38vh",
};

function Upload(props) {
  const { colorMode } = useColorMode();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "video/*": [],
    },
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length) {
        return;
      }

      props.setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );

      let filename = new Date().getTime();

      let res = await axios.post(
        "https://content.dropboxapi.com/2/files/upload",
        acceptedFiles[0],
        {
          headers: {
            Authorization: "DROPBOX_API_KEY",
            "Dropbox-API-Arg": JSON.stringify({
              path: `/data/${filename}.mp4`,
              mode: "add",
              autorename: true,
              mute: false,
            }),
            "Content-Type": "application/octet-stream",
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );
      if (res.status === 200) props.setDisable(false);

      props.setPath(res.data.path_display);
    },
  });

  const thumbs = props.files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <ReactPlayer style={img} url={file.preview} controls={true} />
        {/* <video
          src={file.preview}
          style={img}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        /> */}
      </div>
    </div>
  ));

  useEffect(() => {
    if (!props.files.length) {
      props.setDisable(true);
    }
    // return () =>
    //   props.files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []); // eslint-disable-line

  return (
    <Box
      border={"2px"}
      borderColor={"gray.400"}
      padding="6"
      width={"100%"}
      borderStyle={"dashed"}
    >
      <Center>
        {thumbs.length ? (
          <Box height="44vh">
            <aside style={thumbsContainer}>{thumbs}</aside>
          </Box>
        ) : (
          <Box
            height="44vh"
            color={colorMode === "dark" ? "blue.200" : "blue.500"}
          >
            <Icon as={ImFolderUpload} boxSize="270" />
          </Box>
        )}
      </Center>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <center>
          <p>Drag and drop video file to upload</p>
          <Button m={"6"} mb={"2"} colorScheme={"blue"} variant="outline">
            Select File
          </Button>
        </center>
      </div>
    </Box>
  );
}

export default Upload;
