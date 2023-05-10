import {
  Text,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Box,
  Textarea,
  AbsoluteCenter,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import VideoThumbnail from "react-video-thumbnail";

function VideoDetails(props) {
  const changeTitle = (event) => {
    props.setTitle(event.target.value);
    if (props.title !== "" && props.desc !== "") {
      props.setDisable(false);
    }
  };
  const changeDesc = (event) => {
    props.setDesc(event.target.value);
    if (props.title !== "" && props.desc !== "") {
      props.setDisable(false);
    }
  };
  useEffect(() => {
    props.setDisable(true);
  }, []); //eslint-disable-line

  return (
    <Box
      border={"2px"}
      borderColor={"gray.400"}
      padding="6"
      width={"100%"}
      borderStyle={"dashed"}
      height="64.35vh"
    >
      <AbsoluteCenter>
        <center>
          <Heading size={"md"}>Enter Video Details</Heading>
        </center>
        <br />
        <Stack height={"35vh"} direction={{ base: "column", md: "row" }}>
          <Flex p={8} flex={1} align={"center"} justify={"center"}>
            <Stack spacing={4} w={"full"} width={"lg"}>
              <FormControl id="title">
                <FormLabel>Video Title</FormLabel>
                <Input type="text" value={props.title} onChange={changeTitle} />
              </FormControl>
              <FormControl id="desc">
                <FormLabel>Video Description</FormLabel>
                <Textarea value={props.desc} onChange={changeDesc} />
              </FormControl>
            </Stack>
          </Flex>
          <Flex flex={1}>
            <Box width="43vh" mt="6">
              <Text mb={"2"}>Video Thumbnail</Text>
              <VideoThumbnail
                videoUrl={props.files[0].preview}
                thumbnailHandler={(thumbnail) =>
                  props.setImageBase64(thumbnail)
                }
                snapshotAtTime={0}
              />
            </Box>

            {/* <ReactPlayer url={props.files[0].preview} controls={true} /> */}
          </Flex>
        </Stack>
      </AbsoluteCenter>
    </Box>
  );
}

export default VideoDetails;
