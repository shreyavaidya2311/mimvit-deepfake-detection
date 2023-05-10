import React from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
  Avatar,
} from "@chakra-ui/react";

function Footer() {
  return (
    <Box
      mt="14"
      position={"fixed"}
      bottom="0"
      width="100vw"
      borderTopWidth={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.600")}
      bg={useColorModeValue("gray.100", "gray.700")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>
          © 2023 Shreya Vaidya, Sameer Kavthekar and Vishwesh Pujari. All rights
          reserved
        </Text>
        <Stack direction={"row"} spacing={6}>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/shreya-vaidya/"
          >
            <Avatar
              size={"sm"}
              src={"https://api.dicebear.com/5.x/initials/svg?seed=SVa"}
            />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/sameer-kavthekar/"
          >
            <Avatar
              size={"sm"}
              src={"https://api.dicebear.com/5.x/initials/svg?seed=SKa"}
            />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/vishwesh-pujari-7205391b6/"
          >
            <Avatar
              size={"sm"}
              src={"https://api.dicebear.com/5.x/initials/svg?seed=VPu"}
            />
          </a>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
