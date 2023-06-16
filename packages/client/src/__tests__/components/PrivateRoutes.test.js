import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { Outlet, Navigate } from "react-router-dom";
import PrivateRoutes, { useAuth } from "../../components/PrivateRoutes";
import { BrowserRouter } from "react-router-dom";
import { AccountContext } from "../../components/AccountContext";

// Tests that useAuth returns true when user is logged in
it("test_happy_path_user_logged_in", () => {
  const user = { loggedIn: true };
  jest.spyOn(React, "useContext").mockReturnValue({ user });
  expect(useAuth()).toBe(true);
});

// Tests that useAuth returns false when user is not logged in
it("test_happy_path_user_not_logged_in", () => {
  const user = { loggedIn: false };
  jest.spyOn(React, "useContext").mockReturnValue({ user });
  expect(useAuth()).toBe(false);
});
