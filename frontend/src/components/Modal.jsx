import React, { useState } from "react";
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Center,
} from "@chakra-ui/react";
import { Step, Steps } from "chakra-ui-steps";
import Upload from "./Upload";
import VideoDetails from "./VideoDetails";
import Detect from "./Detect";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Modal(props) {
  const [disable, setDisable] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [score, setScore] = useState(-1);
  const navigate = useNavigate();

  const handleVideoUpload = () => {
    const apiAccessToken = localStorage.getItem("api_access_token");
    try {
      let res = axios.post(
        "/add_video",
        {
          video_title: title,
          thumbnail: imageBase64,
          URL: props.path,
          IST_date: new Date(),
          MIM_VIT_score: (score * 100).toString().substring(0, 5),
        },
        {
          headers: {
            "vit-api-authtoken": apiAccessToken,
          },
        }
      );
      console.log(res.data);
      navigate("/home");
    } catch (e) {
      console.log(e);
    }
  };

  const Page1 = (
    <Flex py={4}>
      <Upload
        setDisable={setDisable}
        files={props.files}
        setFiles={props.setFiles}
        path={props.path}
        setPath={props.setPath}
      />
    </Flex>
  );
  const Page2 = (
    <Flex py={4}>
      {/* <Upload
        setDisable={setDisable}
        files={props.files}
        setFiles={props.setFiles}
      /> */}
      <VideoDetails
        setDisable={setDisable}
        files={props.files}
        setFiles={props.setFiles}
        setImageBase64={setImageBase64}
        title={title}
        setTitle={setTitle}
        desc={desc}
        setDesc={setDesc}
      />
    </Flex>
  );
  const Page3 = (
    <Flex py={4}>
      <Detect
        path={props.path}
        files={props.files}
        imageBase64={imageBase64}
        setDisable={setDisable}
        title={title}
        score={score}
        setScore={setScore}
      />
    </Flex>
  );

  const steps = [
    { label: "Step 1", content: Page1 },
    { label: "Step 2", content: Page2 },
    { label: "Step 3", content: Page3 },
  ];
  // const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
  //   initialStep: 0,
  // });
  return (
    <>
      <ChakraModal
        blockScrollOnMount={false}
        isOpen={props.isOpen}
        onClose={props.onClose}
        size={"full"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Videos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" width="100%">
              <Steps activeStep={props.activeStep}>
                {steps.map(({ label, content }) => (
                  <Step label={label} key={label}>
                    {content}
                  </Step>
                ))}
              </Steps>
              {props.activeStep === steps.length ? (
                <Center p={8}>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={props.reset}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="green"
                    ml={3}
                    onClick={handleVideoUpload}
                  >
                    Upload
                  </Button>
                </Center>
              ) : (
                <Flex width="100%" justify="flex-end">
                  <Button
                    isDisabled={props.activeStep === 0}
                    mr={4}
                    onClick={props.prevStep}
                    size="sm"
                    variant="ghost"
                  >
                    Prev
                  </Button>
                  <Button
                    size="sm"
                    onClick={props.nextStep}
                    isDisabled={disable}
                  >
                    {props.activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Flex>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    </>
  );
}

export default Modal;
