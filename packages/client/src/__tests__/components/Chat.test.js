import { render, screen } from "@testing-library/react";
import Chat from "../../components/home/Chat";
import { FriendContext, MessagesContext, SocketContext } from "../../components/home/Home";
import { Tabs } from "@chakra-ui/react";
import { Server } from "mock-socket";

describe("Chat", () => {
  // Tests that the component renders correctly with a non-empty friendList and messages array
  it("test_rendering_with_friends_and_messages", () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    const friendList = [
      { username: "John", userid: 1 },
      { username: "Jane", userid: 2 }
    ];
    const messages = [
      { to: 1, from: 2, content: "Hello" },
      { to: 2, from: 1, content: "Hi" }
    ];
    const mockServer = new Server("ws://localhost:8080");
    const mockSocket = new WebSocket("ws://localhost:8080");
    render(
      <Tabs>
        <SocketContext.Provider value={{ socket: mockSocket }}>
          <FriendContext.Provider value={{ friendList }}>
            <MessagesContext.Provider value={{ messages }}>
              <Chat userid={1} />
            </MessagesContext.Provider>
          </FriendContext.Provider>
        </SocketContext.Provider>
      </Tabs>
    );
    const helloJohnMessages = screen.queryAllByText("Hello");
    expect(helloJohnMessages).toHaveLength(2); 
    const hiJaneMessages = screen.queryAllByText("Hi");
    expect(hiJaneMessages).toHaveLength(2);
  });
});