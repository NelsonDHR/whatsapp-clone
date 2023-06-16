import { render, screen } from "@testing-library/react";
import Sidebar from "../../components/home/Sidebar";
import { FriendContext, SocketContext } from "../../components/home/Home";
import { Tabs } from "@chakra-ui/react";
import { Server } from "mock-socket";
import "@testing-library/jest-dom";

describe("Sidebar", () => {
  // Tests that the component renders correctly with a non-empty friendList
  it("test_rendering_with_friends", () => {
    const friendList = [
      { username: "John", userid: 1, connected: true },
      { username: "Jane", userid: 2, connected: false }
    ];
    const mockServer = new Server("ws://localhost:8080");
    const mockSocket = new WebSocket("ws://localhost:8080");
    render(
      <Tabs>
        <SocketContext.Provider value={{ socket: mockSocket }}>
          <FriendContext.Provider value={{ friendList }}>
            <Sidebar />
          </FriendContext.Provider>
        </SocketContext.Provider>
      </Tabs>
    );
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });
});