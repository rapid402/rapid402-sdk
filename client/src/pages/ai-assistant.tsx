import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm here to help you integrate the @rapid402/sdk into your application. Ask me anything about installation, configuration, payment verification, or settlement!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Assistant</h1>
        <p className="text-lg text-muted-foreground">
          Get instant help with the Rapid402 SDK
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            SDK Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about installation, configuration, or integration
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  data-testid={`message-${message.role}-${index}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`rounded-lg px-4 py-3 max-w-[80%] ${
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-lg px-4 py-3 bg-muted">
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
              placeholder="Ask a question about the SDK..."
              disabled={isLoading}
              className="flex-1"
              data-testid="input-chat-message"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-elevate">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Example Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => setInput("How do I install the SDK?")}
              className="text-sm text-muted-foreground hover:text-foreground text-left w-full"
              data-testid="button-example-1"
            >
              How do I install the SDK?
            </button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => setInput("How do I verify a payment?")}
              className="text-sm text-muted-foreground hover:text-foreground text-left w-full"
              data-testid="button-example-2"
            >
              How do I verify a payment?
            </button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advanced</CardTitle>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => setInput("How do I handle errors?")}
              className="text-sm text-muted-foreground hover:text-foreground text-left w-full"
              data-testid="button-example-3"
            >
              How do I handle errors?
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
