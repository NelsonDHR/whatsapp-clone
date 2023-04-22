import { Button, ButtonGroup, Heading, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import formSchema from "@whatsapp-clone/common";
import TextField from "../TextField";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={formSchema}
      onSubmit={(values, actions) => {
        const vals = {...values}
        actions.resetForm();
        fetch("http://localhost:3000/auth/sign-up",{
          method:"POST",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify(vals),
        })
        .catch(err => {
          return;
        })
        .then(res => {
          if (!res || !res.ok || res.status >=400){
            return;
          }
          return res.json();  
        })
         .then(data => {
          if(!data) return;
          console.log(data);
         });
      }}
    >
      <VStack
        as={Form}
        w={{ base: "90%", md: "500px" }}
        h="100vh"
        m="auto"
        justify="center"
        spacing="1rem"
      >
        <Heading>Sign Up</Heading>

        <TextField
          name="username"
          placeholder="Enter username"
          autoComplete="off"
          label="Username"
        />

        <TextField
          name="password"
          placeholder="Enter password"
          autoComplete="off"
          label="Password"
        />

        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            Create Account
          </Button>
          <Button onClick={() => navigate("/log-in")}>Log In</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default SignUp;
