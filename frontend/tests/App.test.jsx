import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App.jsx";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import { vi } from "vitest";

// Mocking localStorage
beforeEach(() => {
  // Clear the localStorage before each test
  localStorage.clear();
});

vi.spyOn(Storage.prototype, "removeItem").mockImplementation((key) => {
  console.log(`Mock removeItem called with key: ${key}`);
  delete localStorage[key]; // Simulating removal of item
});

test("logout clears token and role", async () => {
  // Set initial values in localStorage
  localStorage.setItem("token", "testToken");
  localStorage.setItem("role", "user");

  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  // Ensure token and role are initially set
  console.log("Initial token:", localStorage.getItem("token"));
  console.log("Initial role:", localStorage.getItem("role"));
  expect(localStorage.getItem("token")).toBe("testToken");
  expect(localStorage.getItem("role")).toBe("user");

  // Find and click logout button
  const logoutButton = screen.getByText(/logout/i); // Assuming the logout button text is 'logout'
  fireEvent.click(logoutButton);

  // Check the token right after the logout button click
  console.log(
    "Token after logout button click:",
    localStorage.getItem("token")
  );

  // Wait for the localStorage to be cleared
  await waitFor(() => {
    // Ensure removeItem was called correctly for both token and role
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("role");

    // Check that localStorage values are null after logout
    console.log("Token after waitFor:", localStorage.getItem("token"));
    console.log("Role after waitFor:", localStorage.getItem("role"));
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("role")).toBeNull();
  });
});
