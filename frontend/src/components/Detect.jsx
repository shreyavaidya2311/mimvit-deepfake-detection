import {
  Text,
  Flex,
  Heading,
  Stack,
  Box,
  AbsoluteCenter,
  Button,
  Progress,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import VideoThumbnail from "react-video-thumbnail";
import axios from "axios";

function Detect(props) {
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.setDisable(true);
  }, []); //eslint-disable-line

  const checkScore = () => {
    setLoading(true);
    axios.post("/detect-deepfake", { path: props.path }).then((res) => {
      setLabel(res.data.result.label);
      if (res.data.result.label === "Real") {
        props.setDisable(false);
      }
      props.setScore(res.data.result.score);
      setLoading(false);
    });
  };
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
          <Heading size={"md"}>{props.title}</Heading>
        </center>
        <br />
        <Stack height={"35vh"} direction={{ base: "column", md: "row" }}>
          <Flex flex={1}>
            <Box width="43vh" mt="6">
              <VideoThumbnail
                videoUrl={props.files[0].preview}
                thumbnailHandler={(thumbnail) =>
                  props.setImageBase64(thumbnail)
                }
                snapshotAtTime={0}
              />
            </Box>
          </Flex>
          {label !== "" && props.score !== -1 ? (
            <Flex p={4} flex={1} align={"center"} justify={"center"}>
              <Stack spacing={4} width={"sm"}>
                <Text>Predicted Label</Text>

                <Badge
                  fontSize="1em"
                  width="3.15vw"
                  colorScheme={label === "Real" ? "green" : "red"}
                >
                  {label}
                </Badge>
                <Text>MIM-ViT Score</Text>
                <Text mb={"4"}>
                  <strong>
                    {(props.score * 100).toString().substring(0, 5)} / 100
                  </strong>
                </Text>
                <Progress
                  value={props.score * 100}
                  variant={""}
                  isAnimated={true}
                  hasStripe={true}
                  colorScheme={label === "Real" ? "green" : "red"}
                />
              </Stack>
            </Flex>
          ) : null}
        </Stack>
        <center> {loading ? <Spinner /> : null}</center>
        <center>
          {label === "" && props.score === -1 ? (
            <Button
              m={"2"}
              colorScheme={"blue"}
              variant="outline"
              onClick={checkScore}
            >
              Generate MIM-ViT Results
            </Button>
          ) : label === "Real" ? (
            <Text>
              <i>Click Finish to upload video</i>
            </Text>
          ) : (
            <Text>
              <i>Video cannot be uploaded due to violation of privacy terms</i>
            </Text>
          )}
        </center>
      </AbsoluteCenter>
    </Box>
  );
}

export default Detect;
