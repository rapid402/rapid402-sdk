import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, X, Minimize2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm here to help you integrate the @rapid402/sdk. Ask me anything!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLabel(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history
        })
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.reply 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error. Please try again." 
      }]);
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <Card 
          className="w-96 h-[500px] flex flex-col shadow-2xl" 
          style={{ 
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            zIndex: 9998 
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="h-5 w-5 text-primary" />
                SDK Assistant
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Ask about the Rapid402 SDK
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
                data-testid="button-minimize-chat"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
                data-testid="button-close-chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col gap-3 p-4 overflow-hidden">
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    data-testid={`message-${message.role}-${index}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[75%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="rounded-lg px-3 py-2 bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 h-9"
                data-testid="input-chat-message"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-9 w-9"
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {showLabel && (
          <div
            className="bg-background border rounded-md px-3 py-1 shadow-lg"
            style={{ 
              whiteSpace: 'nowrap',
              animation: 'bounce 1s ease-in-out 3'
            }}
          >
            <span className="text-sm font-medium">Assistant</span>
          </div>
        )}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-2xl"
          size="icon"
          data-testid="button-open-chat"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Bot className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
}
