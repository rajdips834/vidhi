import { useState, useRef, useEffect } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { generate } from "./api/ollama";

function App() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const scrollRef = useRef(null);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const userMsg = { text: prompt, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);

    let botText = "";
    setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);

    await generate(prompt, (chunk) => {
      botText += chunk;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: botText, sender: "bot" };
        return updated;
      });
    });
    setPrompt("");
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground">
      {/* Header */}
      <ChatHeader />

      {/* Messages - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-3" ref={scrollRef}>
        <ChatMessages messages={messages} />
      </div>

      {/* Fixed Input/Footer */}
      <div className="border-t border-border p-3 bg-background">
        <ChatInput
          prompt={prompt}
          setPrompt={setPrompt}
          sendPrompt={sendPrompt}
        />
      </div>
    </div>
  );
}

export default App;
