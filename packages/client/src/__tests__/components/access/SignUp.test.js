import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUp from "../../../components/access/SignUp";
import { AccountContext } from "../../../components/AccountContext";
import { BrowserRouter as Router } from "react-router-dom";

describe("SignUp", () => {
  it("test_sign_up", async () => {
    const setUser = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ loggedIn: true, token: "testtoken" }),
      })
    );
    render(
        <Router>
          <AccountContext.Provider value={{ setUser }}>
            <SignUp />
          </AccountContext.Provider>
        </Router>
      );
    userEvent.type(screen.getByLabelText("Username"), "testuser");
    userEvent.type(screen.getByLabelText("Password"), "testpass");
    userEvent.click(screen.getByRole("button", { name: "Create Account" }));
  });
});