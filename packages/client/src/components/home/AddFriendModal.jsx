import { Modal,ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,Button, ModalCloseButton } from '@chakra-ui/react'
import React from 'react'
import { Form, Formik } from "formik";
import TextField from "../TextField";
import  friendSchema from '@whatsapp-clone/common';

export const AddFriendModal = ({isOpen,onClose}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Add a friend!</ModalHeader>
            <ModalCloseButton/>
            <Formik
            initialValues={{friendName: ""}}
            onSubmit={()=>{
                    onClose();
                }}
            validationSchema={friendSchema.friendSchema}
            >
                <Form>
                <ModalBody>
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
