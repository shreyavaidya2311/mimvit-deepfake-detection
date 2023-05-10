import {
  Card,
  CardBody,
  Center,
  Grid,
  GridItem,
  Heading,
  Avatar,
  Flex,
  useColorModeValue,
  useColorMode,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { React } from "react";
import ReactPlayer from "react-player";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Play() {
  const { colorMode } = useColorMode();
  const [isLaptop] = useMediaQuery("(min-width: 1280px)");
  let { state } = useLocation();
  return (
    <>
      <Navbar searchable={false} />
      <Center mt="6">
        <Grid>
          <GridItem>
            <Center>
              <ReactPlayer
                width={isLaptop ? "60vw" : "95vw"}
                height={isLaptop ? "55vh" : "40vh"}
                url={state.video.url}
              />
            </Center>
          </GridItem>
          <GridItem>
            <Card
              mt="4"
              width={isLaptop ? "60vw" : "95vw"}
              bg={useColorModeValue("gray.100", "gray.700")}
            >
              <CardBody>
                <Heading size="md">{state.video.title}</Heading>
                <Flex mt="4">
                  <Avatar
                    size={"md"}
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${state.video.channel}`}
                    mr="4"
                  />
                  <Text
                    fontSize={"15px"}
                    color={colorMode === "dark" ? "gray.300" : "gray.500"}
                    fontWeight={"600"}
                  >
                    {state.video.channel} <br />
                    {/* {state.video.views} · {state.video.date} */}
                    {state.video.date}
                  </Text>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Center>
      <Footer />
    </>
  );
}

export default Play;
