import { Routes, Route } from "react-router-dom";
import LogIn from "./access/LogIn";
import SignUp from "./access/SignUp";
import Home from "./home/Home";
import { Text } from "@chakra-ui/layout";
import PrivateRoutes from "./PrivateRoutes";
import { AccountContext } from "./AccountContext";
import { useContext } from "react";

const Views = () => {
  const { user } = useContext(AccountContext);
  return user.loggedIn === null ? (
    <Text>Loading...</Text>
  ) : (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="*" element={<LogIn />} />
      <Route path="/log-in" element={<LogIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default Views;
