/* global describe, expect, it, jest */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import MessageActions from "../MessageActions";

jest.mock("lucide-react", () => ({
  MoreHorizontal: () => null,
  Edit2: () => null,
  Trash2: () => null,
  MessageSquareQuote: () => null,
  Smile: () => null,
  X: () => null,
}));

const renderActions = (overrides = {}) => {
  const props = {
    isMe: false,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onReply: jest.fn(),
    onReact: jest.fn(),
    ...overrides,
  };

  render(<MessageActions {...props} />);
  return props;
};

describe("MessageActions", () => {
  it("opens the reaction picker and sends the selected emoji", () => {
    const props = renderActions();

    fireEvent.click(screen.getByRole("button", { name: "Message actions" }));
    fireEvent.click(screen.getByRole("button", { name: "React" }));
    fireEvent.click(screen.getByRole("button", { name: "React 👍" }));

    expect(props.onReact).toHaveBeenCalledWith("👍");
  });

  it("keeps edit and delete actions limited to the sender", () => {
    renderActions({ isMe: false });

    fireEvent.click(screen.getByRole("button", { name: "Message actions" }));

    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reply" })).toBeInTheDocument();
  });
});
