import { Modal,ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,Button, ModalCloseButton, Heading } from '@chakra-ui/react'
import React, { useContext } from 'react'
import {useState,useCallback } from 'react'
import { Form, Formik } from "formik";
import TextField from "../TextField";
import  friendSchema from '@whatsapp-clone/common';
import socket from '../../socket';
import {FriendContext} from "./Home"

export const AddFriendModal = ({isOpen,onClose}) => {
  const [error,setError] =useState("");
  const closeModal = useCallback(
    ()=>{
    setError("");
    onClose();
  },
  [onClose],
  )
  const {setFriendList} = useContext(FriendContext)
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Add a friend!</ModalHeader>
            <ModalCloseButton/>
            <Formik
            initialValues={{friendName: ""}}
            onSubmit={values =>{
                    console.log("hola")
                    socket.emit("add_friend",values.friendName,({errorMsg,done})=>{
                        if(done){
                            setFriendList(c => [values.friendName,...c])
                            closeModal();
                            return;
                        }
                        setError(errorMsg)
                    }
                );
                }   
            }
            validationSchema={friendSchema.friendSchema}
            >
                <Form>
                <ModalBody>
                    <Heading fontSize="xl" as="p" color="red.500" textAlign="center">
                        {error}
                    </Heading>
                    <TextField
                    label="Friend's name" 
                    placeholder="Enter friend's username"
                    autoComplete="off"
                    name="friendName"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorscheme='blue' mr={3} type="submit">
                        Add friend
                    </Button>
                </ModalFooter>
                </Form>
            </Formik>
        </ModalContent>
        
    </Modal>
  )
}
