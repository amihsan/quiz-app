// tests/Navbar.test.jsx	
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import { vi } from "vitest";

// Mock the useAuth hook properly
vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    role: "user", // Mock role value
    isAuthenticated: true, // Mock authentication state
    logout: vi.fn(), // Mock the logout function
  }),
}));

test("renders Navbar component", () => {
  render(
    <BrowserRouter>
      {" "}
      {/* Wrap Navbar component with BrowserRouter */}
      <Navbar />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/home/i); // Check for an element with the text 'Home'
  chai.expect(linkElement).to.exist; // Chai-style assertion
});
