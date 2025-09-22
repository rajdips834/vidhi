import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatMessages({ messages, scrollRef }) {
  return (
    <ScrollArea className="flex-1 px-3 sm:px-6 py-4 sm:py-6" ref={scrollRef}>
      <div className="flex flex-col gap-3 sm:gap-4 max-w-3xl mx-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`px-3 sm:px-4 py-2 rounded-xl w-fit max-w-[90%] sm:max-w-[75%] text-sm sm:text-base prose dark:prose-invert break-words ${
              m.sender === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-muted text-muted-foreground"
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default ChatMessages;
