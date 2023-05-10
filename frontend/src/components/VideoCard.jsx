import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Stack,
  Image,
  Heading,
  Avatar,
  Text,
  useColorModeValue,
  useColorMode,
  Link,
} from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useMediaQuery } from "@chakra-ui/react";

function VideoCard(video) {
  const { colorMode } = useColorMode();
  const [isHandheld] = useMediaQuery("(min-width: 300px)");
  return (
    <>
      <Link
        as={RouterLink}
        to="/play"
        state={{ video: video.video }}
        style={{ textDecoration: "none" }}
      >
        <Card
          width={isHandheld ? "xs" : "sm"}
          height={"xs"}
          bg={useColorModeValue("gray.100", "gray.700")}
          _hover={{
            transition: "transform .2s",
            transform: "scale(1.05)",
          }}
        >
          <Image
            src={video.video.thumbnail}
            alt="thumbnail"
            borderRadius="lg"
            style={{ height: "30vh" }}
          />
          <CardBody>
            <Stack>
              <Grid templateColumns="repeat(5, 1fr)">
                <GridItem colSpan={1}>
                  <Avatar
                    size={"sm"}
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${video.video.channel}`}
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <Heading
                    noOfLines={2}
                    size="xs"
                    color={colorMode === "dark" ? "gray.100" : "gray.600"}
                  >
                    {video.video.title}
                  </Heading>
                  <Text
                    mt="1"
                    fontSize={"12px"}
                    color={colorMode === "dark" ? "gray.300" : "gray.500"}
                    fontWeight={"600"}
                  >
                    {video.video.channel}
                  </Text>
                  <Text
                    fontSize={"12px"}
                    color={colorMode === "dark" ? "gray.300" : "gray.500"}
                    fontWeight={"600"}
                  >
                    {/* {video.video.views} • {video.video.date} */}
                    {video.video.date}
                  </Text>
                </GridItem>
              </Grid>
            </Stack>
          </CardBody>
        </Card>
      </Link>
    </>
  );
}

export default VideoCard;
