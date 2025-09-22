import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

function ChatInput({ prompt, setPrompt, sendPrompt }) {
  const [initialPrompt, setInitialPrompt] = useState(prompt);
  return (
    <footer className="border-t border-border p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-3xl mx-auto w-full">
        <Textarea
          value={initialPrompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setInitialPrompt(e.target.value);
          }}
          placeholder="Type your message..."
          className="resize-none flex-1 text-sm sm:text-base"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendPrompt();
              setInitialPrompt("");
            }
          }}
        />
        <Button
          onClick={() => {
            sendPrompt();
            setInitialPrompt("");
          }}
          className="w-full sm:w-auto"
        >
          Send
        </Button>
      </div>
    </footer>
  );
}

export default ChatInput;
