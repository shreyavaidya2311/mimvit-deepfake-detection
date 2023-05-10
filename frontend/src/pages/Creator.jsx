import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoTable from "../components/VideoTable";
import { Button, Center, Icon } from "@chakra-ui/react";
import { RiVideoUploadLine } from "react-icons/ri";
import Modal from "../components/Modal";
import { useSteps } from "chakra-ui-steps";

function Creator() {
  const [isOpen, setOpen] = useState(false);
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const setClose = () => {
    setOpen(false);
    setFiles([]);
    setStep(0);
  };
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState("");
  return (
    <>
      <Navbar searchable={false} />
      <Center>
        <Button
          leftIcon={<Icon as={RiVideoUploadLine} boxSize={6} />}
          onClick={() => setOpen(true)}
          colorScheme="blue"
          m="8"
        >
          Upload Videos
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={setClose}
          files={files}
          setFiles={setFiles}
          nextStep={nextStep}
          prevStep={prevStep}
          setStep={setStep}
          reset={reset}
          activeStep={activeStep}
          path={path}
          setPath={setPath}
        />
      </Center>
      <VideoTable />
      <Footer />
    </>
  );
}

export default Creator;
