import {
	HStack,
	VStack,
	Heading,
	Divider,
	Text,
	Circle,
} from "@chakra-ui/layout";
import { TabList, Tab } from "@chakra-ui/tabs";
import { Button } from "@chakra-ui/button";
import { ChatIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { FriendContext } from "./Home";
import { AddFriendModal } from "./AddFriendModal";
import { useDisclosure } from "@chakra-ui/react";

const Sidebar = () => {
	const { friendList, setFriendList } = useContext(FriendContext);
	const {isOpen,onOpen,onClose} = useDisclosure();
	return (
		<>
		<VStack py="1rem">
			<HStack justify="space-evenly" w="100%">
				<Heading size="md">Add Friend</Heading>
				<Button onClick={onOpen}>
					<ChatIcon />
				</Button>
			</HStack>
			<Divider />
			<VStack as={TabList}>
				{friendList.map((friend) => {
					console.log(friend)
					return (
						
						<HStack as={Tab} key={`friend:${friend}`}>
							<Circle
								size="10px"
								bg={friend.connected ? "green.500" : "red.500"}
							/>
							<Text>{friend}</Text>
						</HStack>
					);
				})}
			</VStack>
		</VStack>
		<AddFriendModal isOpen={isOpen} onClose={onClose}/>
		</>
	);
};

export default Sidebar;
