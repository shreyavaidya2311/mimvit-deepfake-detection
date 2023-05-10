import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Divider,
  useMediaQuery,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.png";
import { FiMoon, FiSun } from "react-icons/fi";
import { BiHome } from "react-icons/bi";
import { RiVideoUploadLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar(props) {
  const [isLaptop] = useMediaQuery("(min-width: 1280px)");
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/home");
    navigate(0);
  };

  const goToCreatePage = () => {
    navigate("/create");
    navigate(0);
  };

  const handleLogout = async () => {
    localStorage.removeItem("api_access_token");
    axios.defaults.headers.common["vit-api-authtoken"] = null;
    navigate("/");
  };

  return (
    <>
      <Box bg={useColorModeValue("white", "gray.800")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {!isLaptop && props.searchable ? (
            <Button variant="ghost" onClick={goToHomePage}>
              <Icon mr="2" ml="-2" as={BiHome} boxSize={6} />
            </Button>
          ) : (
            <Box
              onClick={goToHomePage}
              _hover={{
                cursor: "pointer",
              }}
            >
              <img src={logo} alt="logo" width="170vw" />
            </Box>
          )}

          {props.searchable ? (
            <Flex alignItems={"center"} width="50vw">
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="gray.300" />}
                />
                <Input
                  variant="filled"
                  placeholder="Search"
                  onChange={props.searchChange}
                  onKeyDown={props.searchSubmit}
                />
              </InputGroup>
            </Flex>
          ) : null}

          <Flex alignItems={"center"}>
            <Button variant="ghost">
              <Icon
                as={RiVideoUploadLine}
                boxSize={6}
                onClick={goToCreatePage}
              />
            </Button>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode} variant="ghost">
                {colorMode === "dark" ? (
                  <Icon as={FiSun} boxSize={6} />
                ) : (
                  <Icon as={FiMoon} boxSize={6} />
                )}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={"https://api.dicebear.com/5.x/initials/svg?seed=sv"}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"lg"}
                      src={"https://api.dicebear.com/5.x/initials/svg?seed=sv"}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>
                      <b>Shreya Vaidya</b>
                    </p>
                  </Center>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
      <Divider />
    </>
  );
}
