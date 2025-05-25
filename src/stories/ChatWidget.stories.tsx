import { Meta, StoryObj } from "@storybook/react";
import { useCallback, useState } from "react";
import ChatWidget, { type Message } from "../components/ChatWidget/ChatWidget";
import { defaultTheme, themes } from "../components/ChatWidget/themes";

const meta: Meta<typeof ChatWidget> = {
  title: "Components/ChatWidget",
  component: ChatWidget,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        height: "600px",
        inline: true,
        iframeStyle: {
          width: "100%",
          height: "600px",
          padding: "2rem",
          border: "1px solid #eee",
          position: "relative",
        },
      },
    },
    backgrounds: {
      default: "white",
      values: [
        { name: "white", value: "#ffffff" },
        { name: "dark", value: "#1f2937" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "object",
      description: "Theme preset to use",
    },
    position: {
      control: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left"],
      description: "Position of the chat widget on the screen",
    },
    title: {
      control: "text",
      description: "Chat window title",
    },
    placeholder: {
      control: "text",
      description: "Input placeholder text",
    },
    botName: {
      control: "text",
      description: "Name of the bot shown in typing indicator",
    },
    isTyping: {
      control: "boolean",
      description: "Show typing indicator",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatWidget>;

// Wrapper component to handle state
const ChatWidgetWithState = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(args.unreadCount || 0);

  const handleSendMessage = useCallback(
    (text: string) => {
      const newMessage: Message = {
        id: String(Date.now()),
        text,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);

      // Simulate bot response
      setTimeout(() => {
        const botMessage: Message = {
          id: String(Date.now() + 1),
          text: "Thanks for your message! I'll get back to you soon.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        if (!isOpen) {
          setUnreadCount((prev: number) => prev + 1);
        }
      }, 1000);
    },
    [isOpen]
  );

  return (
    <ChatWidget
      {...args}
      messages={messages}
      isOpen={isOpen}
      isMinimized={isMinimized}
      unreadCount={unreadCount}
      onToggleOpen={() => {
        if (isMinimized) {
          setIsMinimized(false);
        }
        setIsOpen((prev) => !prev);
        setUnreadCount(0);
      }}
      onMinimize={() => {
        setIsMinimized(true);
      }}
      onRestore={() => {
        setIsMinimized(false);
        setIsOpen(true);
      }}
      onClose={() => {
        setIsOpen(false);
        setIsMinimized(false);
        setUnreadCount(0);
      }}
      onSendMessage={handleSendMessage}
    />
  );
};

// Default theme story
export const Default: Story = {
  render: (args) => (
    <div style={{ position: "relative", height: "100%", minHeight: "500px" }}>
      <ChatWidgetWithState {...args} />
    </div>
  ),
  args: {
    theme: defaultTheme,
    title: "Chat Support",
    placeholder: "Type your message...",
    botName: "Support Botaaa",
    position: "bottom-right",
    isTyping: false,
  },
};

// Dark theme story
export const Dark: Story = {
  render: (args) => (
    <div style={{ position: "relative", height: "100%", minHeight: "500px" }}>
      <ChatWidgetWithState {...args} />
    </div>
  ),
  args: {
    theme: themes.dark,
    title: "Dark Chat",
    placeholder: "Type your message...",
    botName: "Support Bot",
    position: "bottom-right",
    isTyping: false,
  },
};

// Green theme story
export const Nature: Story = {
  render: (args) => (
    <div style={{ position: "relative", height: "100%", minHeight: "500px" }}>
      <ChatWidgetWithState {...args} />
    </div>
  ),
  args: {
    theme: themes.green,
    title: "Nature Chat",
    placeholder: "Type your message...",
    botName: "Support Bot",
    position: "bottom-right",
    isTyping: false,
  },
};

// Orange theme story
export const Sunset: Story = {
  render: (args) => (
    <div style={{ position: "relative", height: "100%", minHeight: "500px" }}>
      <ChatWidgetWithState {...args} />
    </div>
  ),
  args: {
    theme: themes.orange,
    title: "Sunset Chat",
    placeholder: "Type your message...",
    botName: "Support Bot",
    position: "bottom-right",
    isTyping: false,
  },
};

// Pink theme story
export const Rose: Story = {
  render: (args) => (
    <div style={{ position: "relative", height: "100%", minHeight: "500px" }}>
      <ChatWidgetWithState {...args} />
    </div>
  ),
  args: {
    theme: themes.pink,
    title: "Rose Chat",
    placeholder: "Type your message...",
    botName: "Support Bot",
    position: "bottom-right",
    isTyping: false,
  },
};

// Minimal theme story
export const Minimal: Story = {
  render: (args) => (
    <div style={{ position: "relative", height: "100%", minHeight: "500px" }}>
      <ChatWidgetWithState {...args} />
    </div>
  ),
  args: {
    theme: themes.minimal,
    title: "Minimal Chat",
    placeholder: "Type your message...",
    botName: "Support Bot",
    position: "bottom-right",
    isTyping: false,
  },
};
