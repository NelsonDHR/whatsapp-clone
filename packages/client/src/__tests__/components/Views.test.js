import React from "react";
import { render, screen } from "@testing-library/react";
import { AccountContext } from "../../components/AccountContext";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import Views from "../../components/Views";
import "@testing-library/jest-dom";

it("test_loading_message_displayed", () => {
  const mockContext = { user: { loggedIn: null } };
  const { getByText } = render(
    <AccountContext.Provider value={mockContext}>
      <Views />
    </AccountContext.Provider>
  );
  expect(getByText("Loading...")).toBeInTheDocument();
});

it("test_user_not_logged_in_tries_to_access_home_page", () => {
  const mockContext = { user: { loggedIn: false } };
  const history = createMemoryHistory();
  //history.push("/");
  const { getByText } = render(
    <AccountContext.Provider value={mockContext}>
      <MemoryRouter initialEntries={['/home']}>
        <Views />
      </MemoryRouter>
    </AccountContext.Provider>
  );
  expect(history.location.pathname).toBe("/");
});
