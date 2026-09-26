import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

const QUICK_PROMPTS = [
  "Tell me about Sriram.",
  "What is his cybersecurity experience?",
  "Tell me about his projects.",
  "What technologies does he work with?",
];

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi. I'm Sriram's AI portfolio assistant. You can ask me about his experience, projects, skills, cybersecurity work, or certifications.",
    },
  ]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript || "";

      if (transcript.trim()) {
        setInput(transcript);
        sendMessage(transcript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const speak = (text) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    setInput("");

    try {
      recognitionRef.current.start();
    } catch {
      // Prevent duplicate start errors.
    }
  };

  const sendMessage = async (messageOverride) => {
    const message = (messageOverride ?? input).trim();

    if (!message || isThinking) {
      return;
    }

    setInput("");

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setIsThinking(true);

    try {
      const conversation = messages
        .slice(-8)
        .map((item) => ({
          role: item.role,
          content: item.content,
        }));

      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Assistant request failed."
        );
      }

      const answer =
        data?.answer ||
        "I couldn't generate a response right now.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: answer,
        },
      ]);

      speak(answer);
    } catch (error) {
      console.error(error);

      const fallback =
        "I'm having trouble connecting to the AI assistant right now. Please try again in a moment.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: fallback,
        },
      ]);

      speak(fallback);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const scrollToSection = (sectionId) => {
    setIsOpen(false);

    document
      .getElementById(sectionId)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <>
      {/* Floating launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Sriram AI Assistant"
          className="fixed bottom-6 right-6 z-50 group"
        >
          <span className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />

          <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-primary/50 bg-background/90 text-primary shadow-[0_0_35px_rgba(139,92,246,0.45)] backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(139,92,246,0.65)]">
            <Sparkles className="h-7 w-7" />
          </span>

          <span className="absolute -top-10 right-0 whitespace-nowrap rounded-full border border-border bg-background/90 px-3 py-1 text-xs text-foreground opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
            Ask Sriram's AI
          </span>
        </button>
      )}

      {/* Assistant */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-md">
          <div className="overflow-hidden rounded-2xl border border-primary/30 bg-background/95 shadow-[0_0_60px_rgba(139,92,246,0.25)] backdrop-blur-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                  <Bot className="relative h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Sriram AI Assistant
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    {isListening
                      ? "Listening..."
                      : isThinking
                      ? "Thinking..."
                      : isSpeaking
                      ? "Speaking..."
                      : "Ask me about Sriram"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setVoiceEnabled((previous) => !previous)
                  }
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  aria-label={
                    voiceEnabled
                      ? "Disable voice"
                      : "Enable voice"
                  }
                >
                  {voiceEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                    setIsOpen(false);
                  }}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  aria-label="Close assistant"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="max-h-[420px] min-h-[300px] space-y-4 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground"
                        : "max-w-[88%] rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 text-sm text-foreground"
                    }
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts */}
            {messages.length === 1 && (
              <div className="border-t border-border px-4 py-3">
                <p className="mb-2 text-xs text-muted-foreground">
                  Try asking
                </p>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="shrink-0 rounded-full border border-border bg-card px-3 py-2 text-xs transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-border p-3"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2">
                <button
                  type="button"
                  onClick={startListening}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                    isListening
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(139,92,246,0.55)]"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                  aria-label={
                    isListening
                      ? "Stop listening"
                      : "Start voice input"
                  }
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>

                <input
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  placeholder={
                    isListening
                      ? "Listening..."
                      : "Ask about Sriram..."
                  }
                  className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Navigation shortcuts */}
            <div className="flex items-center justify-center gap-1 border-t border-border px-3 py-2">
              <button
                type="button"
                onClick={() => scrollToSection("experience")}
                className="rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-primary"
              >
                Experience
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("skills")}
                className="rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-primary"
              >
                Skills
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                className="rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-primary"
              >
                Projects
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-primary"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};