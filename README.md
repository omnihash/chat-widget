# Omnihash React ChatWidget Component

This project provides a reusable `ChatWidget` React component, designed for easy integration into your applications. The widget offers a customizable chat interface suitable for support, feedback, or conversational UI needs.

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node Version Manager (NVM):**
   Install NVM to manage Node.js versions:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   ```

   After installation, restart your terminal and verify:

   ```bash
   nvm --version
   ```

   Use the correct Node.js version specified in the `.nvmrc` file:

   ```bash
   nvm install
   nvm use
   ```

2. **Yarn:**
   Install Yarn as the package manager:
   ```bash
   npm install --global yarn
   ```
   Verify the installation:
   ```bash
   yarn --version
   ```

## Setup

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <local-repository-folder>
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

## Using the `ChatWidget`

To use the `ChatWidget` component in your project:

1. Install the package (if published to npm):

   ```bash
   yarn add @omnihash/chat-widget
   # or
   npm install @omnihash/chat-widget
   ```

2. Import and use the component in your React project:

   ```tsx
   import React, { useState, useCallback } from "react";
   import { ChatWidget, Message, defaultTheme } from "@omnihash/chat-widget";

   const App = () => {
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
     const [unreadCount, setUnreadCount] = useState(0);

     const handleSendMessage = useCallback(
       (text: string) => {
         const newMessage = {
           id: String(Date.now()),
           text,
           sender: "user" as const,
           timestamp: new Date(),
         };
         setMessages((prev) => [...prev, newMessage]);

         // Example bot response
         setTimeout(() => {
           const botMessage = {
             id: String(Date.now() + 1),
             text: "Thanks for your message! I will get back to you soon.",
             sender: "bot" as const,
             timestamp: new Date(),
           };
           setMessages((prev) => [...prev, botMessage]);
           if (!isOpen) {
             setUnreadCount((prev) => prev + 1);
           }
         }, 1000);
       },
       [isOpen]
     );

     return (
       <ChatWidget
         theme={defaultTheme}
         title="Chat Support"
         placeholder="Type your message..."
         botName="Support Bot"
         position="bottom-right"
         messages={messages}
         isOpen={isOpen}
         isMinimized={isMinimized}
         unreadCount={unreadCount}
         isTyping={false}
         onSendMessage={handleSendMessage}
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
       />
     );
   };

   export default App;
   ```

### Props

| Prop            | Type                                                           | Default                  | Description                                  |
| --------------- | -------------------------------------------------------------- | ------------------------ | -------------------------------------------- |
| `theme`         | `ChatTheme`                                                    | `defaultTheme`           | Theme configuration for the chat widget      |
| `title`         | `string`                                                       | `"Chat Support"`         | The title displayed at the top of the widget |
| `placeholder`   | `string`                                                       | `"Type your message..."` | Placeholder text for the input field         |
| `botName`       | `string`                                                       | `"Bot"`                  | Name shown in typing indicator               |
| `position`      | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-right"`         | Widget position                              |
| `messages`      | `Message[]`                                                    | `[]`                     | Array of chat messages to display            |
| `isOpen`        | `boolean`                                                      | `false`                  | Controls if the chat window is open          |
| `isMinimized`   | `boolean`                                                      | `false`                  | Controls if the chat window is minimized     |
| `unreadCount`   | `number`                                                       | `0`                      | Number of unread messages to display         |
| `isTyping`      | `boolean`                                                      | `false`                  | Shows typing indicator when true             |
| `onSendMessage` | `(message: string) => void`                                    | Required                 | Callback when user sends a message           |
| `onToggleOpen`  | `() => void`                                                   | -                        | Called when toggling the chat open/closed    |
| `onMinimize`    | `() => void`                                                   | -                        | Called when minimizing the chat              |
| `onRestore`     | `() => void`                                                   | -                        | Called when restoring from minimized state   |
| `onClose`       | `() => void`                                                   | -                        | Called when closing the chat                 |

### Theme Interface

```typescript
interface ChatTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  userBubble: string;
  botBubble: string;
  gradient?: string;
  borderRadius?: number;
  fontFamily?: string;
}
```

Available preset themes: `defaultTheme`, `dark`, `green`, `orange`, `pink`, and `minimal`.

## Publishing to npm

To publish the package to npm:

1. Ensure you are logged in to npm:

   ```bash
   npm login
   ```

2. Update the version in `package.json` (if needed):

   ```bash
   npm version <new-version>
   ```

3. Build the package:

   ```bash
   yarn build
   ```

4. Publish the package:

   ```bash
   npm publish --access public
   ```

5. Verify the package is published by searching for it on [npm](https://www.npmjs.com/).

## License

This project is licensed under the MIT License. See the LICENSE file for details.
