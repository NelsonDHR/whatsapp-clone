import { VStack } from "@chakra-ui/layout";
import { TabPanels, TabPanel } from "@chakra-ui/tabs";
import { useContext } from "react";
import { FriendContext } from "./Home";

const Chat = () => {
	const { friendList } = useContext(FriendContext);
	return friendList.length > 0 ? (
		<VStack>
			<TabPanels>
				<TabPanel>Friend One</TabPanel>
				<TabPanel>Friend Two</TabPanel>
			</TabPanels>
		</VStack>
	) : (
		<VStack
			justify="center"
			pt="5rem"
			w="100%"
			textAlign="center"
			fontSize="lg"
		>
			<TabPanels>
				<TabPanel>
				<Text>No bitches</Text>
				</TabPanel>
			</TabPanels>
		</VStack>
	);
};

export default Chat;
