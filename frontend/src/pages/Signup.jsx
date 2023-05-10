import { React, useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useColorMode,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import logo from "../assets/logo.png";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const { colorMode } = useColorMode();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [channel, setChannel] = useState("");
  const [cpassword, setCpassword] = useState("");

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  const changeChannel = (event) => {
    setChannel(event.target.value);
  };

  const changeCpassword = (event) => {
    setCpassword(event.target.value);
  };

  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate("/");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/register", {
        email,
        channel_name: channel,
        password,
      });

      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
      bg={useColorModeValue("white", "gray.800")}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Center>
            <Box>
              <img src={logo} alt="logo" width="220vw" />
            </Box>
          </Center>
        </Stack>
        <Box
          p="8"
          bg={colorMode === "dark" ? "gray.700" : "gray.100"}
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "xl" }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl id="channelName" isRequired>
                <FormLabel>Channel Name</FormLabel>
                <Input
                  type="text"
                  bg={colorMode === "dark" ? "gray.600" : "gray.200"}
                  borderColor={colorMode === "dark" ? "gray.500" : "gray.300"}
                  onChange={changeChannel}
                  value={channel}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  bg={colorMode === "dark" ? "gray.600" : "gray.200"}
                  borderColor={colorMode === "dark" ? "gray.500" : "gray.300"}
                  onChange={changeEmail}
                  value={email}
                />
              </FormControl>
              <HStack>
                <Box>
                  <FormControl isRequired>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        bg={colorMode === "dark" ? "gray.600" : "gray.200"}
                        borderColor={
                          colorMode === "dark" ? "gray.500" : "gray.300"
                        }
                        onChange={changePassword}
                        value={password}
                      />
                      <InputRightElement h={"full"}>
                        <Box
                          _hover={{ cursor: "pointer" }}
                          onClick={() =>
                            setShowPassword((showPassword) => !showPassword)
                          }
                        >
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Box>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel htmlFor="cpassword">Confirm Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showCPassword ? "text" : "password"}
                        bg={colorMode === "dark" ? "gray.600" : "gray.200"}
                        borderColor={
                          colorMode === "dark" ? "gray.500" : "gray.300"
                        }
                        onChange={changeCpassword}
                        value={cpassword}
                      />
                      <InputRightElement h={"full"}>
                        <Box
                          _hover={{ cursor: "pointer" }}
                          onClick={() =>
                            setShowCPassword((showCPassword) => !showCPassword)
                          }
                        >
                          {showCPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Box>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Box>
              </HStack>
            </Stack>
            <Stack spacing="6">
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={handleRegister}
              >
                Sign up
              </Button>
            </Stack>
          </Stack>
          <Stack mt="4">
            <HStack spacing="1" justify="center">
              <Text color="muted">Already a user?</Text>
              <Button variant="link" colorScheme="blue" onClick={goToLoginPage}>
                Login
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default Signup;
