import { React, useState, useEffect } from "react";
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

function Login() {
  const { colorMode } = useColorMode();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const goToSignupPage = () => {
    navigate("/signup");
  };

  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/login", {
        email,
        password,
      });

      const { access_token } = response.data;
      axios.defaults.headers.common[
        "vit-api-authtoken"
      ] = `Bearer ${access_token}`;
      localStorage.setItem("api_access_token", access_token);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("api_access_token");

    if (token) {
      axios.defaults.headers.common["vit-api-authtoken"] = `Bearer ${token}`;

      axios
        .get(`/verify_token/?token=${token}`)
        .then((response) => {
          navigate("/home");
        })
        .catch((error) => {
          localStorage.removeItem("api_access_token");
          console.error(error);
        });
    }
  }, []); //eslint-disable-line

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
              <FormControl isRequired>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    bg={colorMode === "dark" ? "gray.600" : "gray.200"}
                    borderColor={colorMode === "dark" ? "gray.500" : "gray.300"}
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
            </Stack>
            {/* <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button variant="link" colorScheme="blue" size="sm">
                Forgot password?
              </Button>
            </HStack> */}
            <Stack spacing="6">
              <Button variant="solid" colorScheme="blue" onClick={handleLogin}>
                Sign in
              </Button>
            </Stack>
          </Stack>
          <Stack mt="4">
            <HStack spacing="1" justify="center">
              <Text color="muted">Don't have an account?</Text>
              <Button
                variant="link"
                colorScheme="blue"
                onClick={goToSignupPage}
              >
                Sign up
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default Login;
