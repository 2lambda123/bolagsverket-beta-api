import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Input,
  Flex,
  VStack,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Center,
  useToast,
  FormErrorMessage,
  Checkbox,
  Textarea,
} from '@chakra-ui/react'

import { Formik, Field, useFormik } from 'formik'

import { useState } from 'react'


function App() {

  const [gettingData, setGettingData] = useState(false);
  const getData = async (token, text) => {
    // Set application loading state:
    setGettingData(true);
    const url = "https://gw.api.bolagsverket.se/foretagsinformation/v2/organisationer"

    // Convert text into separate org.nr (as ints) and put into array
    const organisationNumberArray = text.split(", ");

    // Get data from API url with token for each org.nr in array
    const responses = [];
    for (const number of organisationNumberArray) {
const results = await Promise.all(responses);
const data = await Promise.all(results.map(response => response.json()));

// Return results to be displayed and change application loading state:
setGettingData(false);
console.log(data);
return data;
      let response = fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-type": 'application/json',
        },
        body: JSON.stringify({
            "identitetsbeteckning": number,
            "organisationInformationsmangd": [
              "FIRMATECKNING"
            ]
          })
      });
      responses.push(response);
    }

    Promise.all(responses)

    // Return results to be displayed and change application loading state:
    setGettingData(false);
    console.log(result);
    return result;
  }

  const [generatingToken, setGeneratingToken] = useState(false);

  const getAuthToken = async (values) => {
    // Generating token started, set loading animation
    setGeneratingToken(true)

    console.log(values.id, values.secret);

    // POST request to get access token
    let url = "https://portal.api.bolagsverket.se/oauth2/token"
    const postOptions = {
      "method": "POST",
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(values.id + ":" + values.secret)}`,
        "Access-Control-Allow-Origin": "*",
      },
      "redirect": "follow",
    }

    try {
      let response = await fetch(url, postOptions)
      if (!response.ok) {
        throw new Error('Failed to get access token');
      }
      const data = await response.json();
      console.log(data);
      setGeneratingToken(false);
    } 
    catch (error) {
      console.error(error)
    }

    // We have finished our token generation attempt
    setGeneratingToken(false);
  }

  const toast = useToast();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: "",
      secret: "",
    },
    onSubmit: (values) => {
      getAuthToken(values);
      toast({
        title: 'Login',
        description: "Token generation successful.",
        status: 'success',
        duration: 4500,
        isClosable: true,
      })

      toast({
        title: 'Login',
        description: "Token generation failed.",
        status: 'error',
        duration: 4500,
        isClosable: true,
      })

      toast({
        title: 'Token',
        description: "Token is valid for 1 hour.",
        status: 'info',
        position: "top",
        duration: 9000,
        isClosable: true,
      })
    },
  })

  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Heading>Bolagsverket Beta API</Heading>
          <Formik
            initialValues={{
              bearerToken: "",
              inputText: "",
            }}
            onSubmit={(values) => {
              getData(values.bearerToken, values.inputText)
            }}
          >
              {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl isInvalid={!!errors.bearerToken && touched.bearerToken}>
                    <FormLabel htmlFor="bearerToken">Bearer Token</FormLabel>
                    <Field
                      as={Input}
                      id="bearerToken"
                      name="bearerToken"
                      type="password"
                      variant="filled"
                      validate={(value) => {
                        let error;

                        if (value.length !== 1086) {
                          error = "Token should be 1086 characters long";
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.bearerToken}</FormErrorMessage>

                  </FormControl>
                  <FormControl isInvalid={!!errors.inputText && touched.inputText}>
                    <FormLabel htmlFor="inputText">Text Input</FormLabel>
                    <Field
                      as={Textarea}
                      id="inputText"
                      name="inputText"
                      type="text"
                      variant="filled"
                      validate={(value) => {
                        let error;

                        if (value.length < 10) {
                          error = "You need at least one org.nr";
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.inputText}</FormErrorMessage>
                  </FormControl>
                  <Button isLoading={gettingData} type="submit" colorScheme="blue" width="full">
                    Get data
                  </Button>
                </VStack>
              </form>
            )}
          </Formik>
        </Container>
        <Modal isOpen={isOpen} size="full" motionPreset="none">
          <ModalOverlay />
          <ModalContent bg="gray.900">
            <ModalBody display="grid" alignContent="center">
              <Container maxW="320px">
                <form onSubmit={formik.handleSubmit}>
                  <VStack spacing={6} align="flex-start">
                    <Heading size="lg">Generate API Token</Heading>
                    <FormControl>
                      <FormLabel htmlFor="id">Client ID</FormLabel>
                      <Input 
                        id="id"
                        name="id"
                        type="id"
                        variant="filled"
                        onChange={formik.handleChange}
                        value={formik.values.id}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="secret">Client Secret</FormLabel>
                      <Input
                        id="secret"
                        name="secret"
                        type="password"
                        variant="filled"
                        onChange={formik.handleChange}
                        value={formik.values.secret}
                      />
                    </FormControl>
                  <Button colorScheme="blue" width="full" type="submit" isLoading={generatingToken}>Login</Button>
                  </VStack>
                </form>
              </Container>
            </ModalBody>
          </ModalContent>
        </Modal>
      </header>
    </div>
  );
}

export default App;
