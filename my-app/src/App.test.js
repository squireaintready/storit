import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the sign-in screen when logged out", () => {
  render(<App />);
  expect(screen.getByText(/your documents, organized/i)).toBeInTheDocument();
});
