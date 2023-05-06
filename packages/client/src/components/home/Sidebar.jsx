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

const Sidebar = () => {
	const { friendList, setFriendList } = useContext(FriendContext);
	return (
		<VStack py="1rem">
			<HStack justify="space-evenly" w="100%">
				<Heading size="md">Add Friend</Heading>
				<Button>
					<ChatIcon />
				</Button>
			</HStack>
			<Divider />
			<VStack as={TabList}>
				{friendList.map((friend) => {
					return (
						<HStack as={Tab}>
							<Circle
								size="10px"
								bg={friend.connected ? "green.500" : "red.500"}
							/>
							<Text>{friend.name}</Text>
						</HStack>
					);
				})}
			</VStack>
		</VStack>
	);
};

export default Sidebar;
