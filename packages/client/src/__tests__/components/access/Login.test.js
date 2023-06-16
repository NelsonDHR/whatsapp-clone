import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../../components/access/LogIn";
import { AccountContext } from "../../../components/AccountContext";
import { BrowserRouter as Router } from "react-router-dom";

describe("Login", () => {
  it("test_login", async () => {
    const setUser = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ loggedIn: true }),
      })
    );
    render(
        <Router>
          <AccountContext.Provider value={{ setUser }}>
            <Login />
          </AccountContext.Provider>
        </Router>
      );
    userEvent.type(screen.getByLabelText("Username"), "testuser");
    userEvent.type(screen.getByLabelText("Password"), "testpass");
    userEvent.click(screen.getByRole("button", { name: "Log In" }));
  });
});

