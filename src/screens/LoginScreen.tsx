import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {
    Alert,
    Box,
    Button,
    Center,
    FormControl,
    HStack,
    Heading,
    Input,
    Slide,
    Text,
    VStack,
    View
} from 'native-base';
import React, { memo, useContext, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';
import { Context } from '../../App';
import { FooterView } from '../components';
import Modal from 'react-native-modal';
import { es } from 'chrono-node';


/**
 * Type for login form data
 */
type FormData = {
    username?: string;
    password?: string;
    code?: string;
};

let timeouts: Array<NodeJS.Timeout> = new Array<NodeJS.Timeout>();

/**
 * Screen component for login screen
 */
const LoginScreen = () => {
    const [data, setData] = useState<FormData>({});
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const navigation = useNavigation();
    const { login } = useContext(Context);

    /**
     * Submit user inputted data to backend for login authentication
     */
    const submit = async () => {
        // Reset slider and remove clear callbacks
        setShowAlert(false);
        timeouts.forEach((timeout) => {
            clearTimeout(timeout);
            timeouts.pop();
        });

        try {
            const result = await axios.post(
                'https://cis-linux2.temple.edu/bucketlistBackend/login',
                {
                    username: data.username,
                    password: data.password,
                    code: data.code
                }
            );

            // Successful login
            setShowAlert(false);
            login(result.data.token);
        } catch (error) {
            // Show slider and set timeout to clear slider
            setShowAlert(true);
            timeouts.push(
                setTimeout(() => {
                    setShowAlert(false);
                }, 3000)
            );
        }
    };

    //RESET PASSWORD

    const [isModalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEmailValid, setEmailValid] = useState(false);
    const [showModalAlert, setShowModalAlert] = useState<boolean>(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);



  
    const toggleModal = () => {
      setModalVisible(!isModalVisible);     
    };

    const handleSendEmail=async()=>{
        // Reset ModalAlert and remove clear callbacks
        setShowModalAlert(false);
        timeouts.forEach((timeout) => {
            clearTimeout(timeout);
            timeouts.pop();
        });

        // 'https://cis-linux2.temple.edu/bucketlistBackend/check_email',

        try {
            const result = await axios.post(
                'http://localhost:5000/check_email',
                {
                    email:email
                }
            );

            if(result.data.emailExists){
                setEmailValid(true);
            }else{
                setShowModalAlert(true);
                timeouts.push(
                    setTimeout(() => {
                        setShowModalAlert(false);
                    }, 3000)
                );
            }


        } catch (error) {
            // Show ModalAlert and set timeout to clear slider
              setShowModalAlert(true);
            timeouts.push(
                setTimeout(() => {
                    setShowModalAlert(false);
                }, 3000)
            );
        }


        //HARD CODED FOR TESTING

        // if(email=="1@gmail.com"){
        //     setEmailValid(true);
        // }else{
        //     setShowModalAlert(true);
        //     timeouts.push(
        //         setTimeout(() => {
        //             setShowModalAlert(false);
        //         }, 3000)
        //     );
        // }

    }
  
    const handleResetPassword =async () => {
      // Implement your reset password logic here

    //   'https://cis-linux2.temple.edu/bucketlistBackend/reset_password',

         try {
            const result = await axios.post(
                'http://localhost:5000/reset_password',
                {
                    email:email,
                    newPassword:newPassword                  
                }
            );

            if(result.data == 'OK'){
                setShowSuccessAlert(true);
                timeouts.push(
                    setTimeout(() => {
                        setShowSuccessAlert(false);
                    }, 3000)
                );

                toggleModal();

                 setEmail("");
                 setNewPassword("");
                 setEmailValid(false);
            }


        } catch (error) {
              console.log(error);
        }


        console.log(`Reset password for email: ${email}`);

          //HARD CODED FOR TESTING

        // if(newPassword != ""){
        //     toggleModal();
        //     setNewPassword("");
        // }

    };

  

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <VStack space="5">
                    <Center>
                        <Box safeArea p="2" w="90%" maxW="290" py="8">
                            <Heading size="xl">Welcome</Heading>
                            <Heading mt="1" size="sm">
                                Please log in!
                            </Heading>
                            <VStack space={3} mt="5">
                                <FormControl isRequired>
                                    <FormControl.Label>
                                        Username
                                    </FormControl.Label>
                                    <Input
                                        size="lg"
                                        type="text"
                                        onChangeText={(value) => {
                                            setData({
                                                ...data,
                                                username: value
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>
                                        Password
                                    </FormControl.Label>
                                    <Input
                                        size="lg"
                                        type="password"
                                        onChangeText={(value) => {
                                            setData({
                                                ...data,
                                                password: value
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>
                                        MFA Code
                                    </FormControl.Label>
                                    <Input
                                        size="lg"
                                        type="password"
                                        onChangeText={(value) => {
                                            setData({ ...data, code: value });
                                        }}
                                    />
                                </FormControl>
                                <Button
                                    onPress={submit}
                                    mt="2"
                                    colorScheme="indigo"
                                >
                                    Log in
                                </Button>

                                <HStack>
                                    <Text>Don't have an account? </Text>
                                    <Text
                                        onPress={() =>
                                            navigation.navigate('Signup')
                                        }
                                        underline
                                    >
                                        Sign up
                                    </Text>
                                </HStack>   

                                    {/* RESET PASSWORD */}


                                <HStack>
                                    <Text>Forget password? </Text>
                                    <Text
                                        onPress={toggleModal}
                                        underline
                                    >
                                        Reset
                                    </Text>
                                </HStack>   

                              
                                <Modal isVisible={isModalVisible}>
                            <Center>
                                    {showModalAlert &&(
                                    <Alert justifyContent="center" status="error">
                                        <Alert.Icon />
                                        <Text color="error.600" fontWeight="medium">
                                            Invalid Email
                                        </Text>
                                    </Alert>
                                    )}


                                    <VStack bg="white" p={5} rounded="lg">
                                    <Text>Please enter your email:</Text>
                                    <Input
                                        mt={2}
                                        placeholder="Email"
                                        value={email}
                                        onChangeText={(text) => setEmail(text)}
                                    />
                                    
                                    {!isEmailValid &&( 
                                    <Button
                                    onPress={handleSendEmail}
                                    mt="2"
                                    colorScheme="indigo"
                                    width={'100'}
                                    >
                                        Send
                                    </Button>
                                )} 
                               
                                {isEmailValid && (
                                  <FormControl isRequired>
                                    <FormControl.Label>
                                      New Password
                                    </FormControl.Label>
                                    <Input
                                        size="lg"
                                        type="password"
                                        value={newPassword}
                                        onChangeText={(text) => setNewPassword(text)}
                                        
                                    />
                                </FormControl>
                                )}

                                    <HStack mt={3}>
                                    {isEmailValid && (    
                                        <Button onPress={handleResetPassword} mr={3}>
                                        Reset Password
                                        </Button>
                                    )}
                                        <Button onPress={toggleModal} variant="ghost">
                                        Cancel
                                        </Button>
                                    </HStack>
                                    </VStack>
                              </Center>
                                </Modal>
                              
                            </VStack>


                        </Box>
                        <Slide in={showAlert} placement="top">
                            <Alert justifyContent="center" status="error">
                                <Alert.Icon />
                                <Text color="error.600" fontWeight="medium">
                                    Invalid credentials
                                </Text>
                            </Alert>
                        </Slide>

                        <Slide in={showSuccessAlert} placement="top">
                        <Alert justifyContent="center" status="success">
                            <Alert.Icon />
                            <Text color="success.600" fontWeight="medium">
                            Success! Password Changed.
                            </Text>
                        </Alert>
                        </Slide>
                    </Center>

                <Center position="fixed" bottom="0" alignSelf="center">
                    <FooterView />
                </Center>

                </VStack>                
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

export default memo(LoginScreen);

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center'
    }
});
