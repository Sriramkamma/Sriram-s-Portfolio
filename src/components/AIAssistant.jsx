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
  Play,
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
  const lastSubmittedSpeechRef = useRef("");
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi. I'm Sriram's AI portfolio assistant. You can ask me about his experience, projects, skills, cybersecurity work, or certifications.",
    },
  ]);

  const recognitionRef = useRef(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /*
   * ---------------------------------------------------------
   * VOICE INPUT
   * ---------------------------------------------------------
   */

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
      let finalTranscript = "";
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Show partial speech in the input box,
      // but DO NOT send it to the API.
      if (interimTranscript) {
        setInput(interimTranscript);
      }

      // Only send the completed sentence.
      if (finalTranscript.trim()) {
        const completedMessage =
          finalTranscript.trim();

        if (
          completedMessage ===
          lastSubmittedSpeechRef.current
        ) {
          return;
        }

        lastSubmittedSpeechRef.current =
          completedMessage;

        setInput(completedMessage);

        setTimeout(() => {
          sendMessage(completedMessage);
        }, 0);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore cleanup errors.
      }
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * VOICE OUTPUT / TEXT TO SPEECH
   * ---------------------------------------------------------
   *
   * Browser voices may load asynchronously.
   * We therefore:
   * 1. Cancel previous speech.
   * 2. Get available voices.
   * 3. Prefer English-India.
   * 4. Fall back to another English voice.
   * 5. Wait for voiceschanged if voices are not ready.
   * 6. Resume the speech engine if it is paused.
   */

  const speak = (text) => {
    if (
      !("speechSynthesis" in window) ||
      !text
    ) {
      if (!("speechSynthesis" in window)) {
        console.warn("Speech output is not supported in this browser.");
      }
      return;
    }

    const synth = window.speechSynthesis;

    // Stop any previous speech.
    synth.cancel();

    let hasSpoken = false;

    const speakNow = () => {
      if (hasSpoken) {
        return;
      }

      hasSpoken = true;

      // Make sure the browser speech engine is not paused.
      try {
        synth.resume();
      } catch {
        // Ignore resume errors.
      }

      const utterance =
        new window.SpeechSynthesisUtterance(text);

      const voices = synth.getVoices();

      // Prefer Indian English.
      const indianEnglishVoice = voices.find(
        (voice) =>
          voice.lang &&
          voice.lang
            .toLowerCase()
            .startsWith("en-in")
      );

      // Otherwise use any English voice.
      const englishVoice =
        voices.find(
          (voice) =>
            voice.lang &&
            voice.lang
              .toLowerCase()
              .startsWith("en")
        ) || null;

      const selectedVoice =
        indianEnglishVoice ||
        englishVoice ||
        voices[0] ||
        null;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = "en-IN";
      }

      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error(
          "Speech synthesis error:",
          event
        );
        setIsSpeaking(false);
      };

      try {
        synth.speak(utterance);
      } catch (error) {
        console.error(
          "Unable to start speech synthesis:",
          error
        );
        setIsSpeaking(false);
      }
    };

    /*
     * Some browsers return an empty voice list
     * during the first call to getVoices().
     */
    const voices = synth.getVoices();

    if (voices.length > 0) {
      speakNow();
      return;
    }

    /*
     * Wait for the browser to load its voices.
     */
    const handleVoicesChanged = () => {
      speakNow();
      synth.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
    };

    synth.addEventListener(
      "voiceschanged",
      handleVoicesChanged
    );

    /*
     * Fallback for browsers where voiceschanged
     * does not fire.
     */
    setTimeout(() => {
      if (!hasSpoken) {
        speakNow();
      }
    }, 1000);
  };

  /*
   * ---------------------------------------------------------
   * START / STOP VOICE INPUT
   * ---------------------------------------------------------
   */

  const startListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore duplicate stop errors.
      }

      return;
    }

    setInput("");

    try {
      recognitionRef.current.start();
    } catch {
      // Prevent duplicate start errors.
    }
  };

  /*
   * ---------------------------------------------------------
   * SEND MESSAGE
   * ---------------------------------------------------------
   */

  const sendMessage = async (messageOverride) => {
    const message = (
      messageOverride ?? input
    ).trim();

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
      const conversation = messagesRef.current
        .slice(-8)
        .map((item) => ({
          role: item.role,
          content: item.content,
        }));

      const response = await fetch(
        "/api/assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            conversation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Assistant request failed."
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

      // Speak the AI response when voice output is enabled.
      if (voiceEnabled) speak(answer);
    } catch (error) {
      console.error(error);

      const fallback =
        error?.message ||
        "I'm having trouble connecting to the AI assistant right now. Please try again in a moment.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: fallback,
        },
      ]);

      // Speak the error response when voice output is enabled.
      if (voiceEnabled) speak(fallback);
    } finally {
      setIsThinking(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * FORM SUBMIT
   * ---------------------------------------------------------
   */

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  /*
   * ---------------------------------------------------------
   * NAVIGATION
   * ---------------------------------------------------------
   */

  const scrollToSection = (sectionId) => {
    setIsOpen(false);

    document
      .getElementById(sectionId)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

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
                {/* Voice toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setVoiceEnabled(
                      (previous) => {
                        const next =
                          !previous;

                        if (!next) {
                          window.speechSynthesis?.cancel();
                          setIsSpeaking(false);
                        }

                        return next;
                      }
                    );
                  }}
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

                {/* Close */}
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
                    <div>{message.content}</div>
                    {message.role === "assistant" && (
                      <button
                        type="button"
                        onClick={() => speak(message.content)}
                        disabled={
                          !voiceEnabled ||
                          !("speechSynthesis" in window)
                        }
                        className="mt-2 inline-flex items-center gap-1 rounded-full text-xs text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
                        aria-label="Play assistant response aloud"
                        title="Play this response aloud"
                      >
                        <Play className="h-3 w-3" />
                        Play aloud
                      </button>
                    )}
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
                  {QUICK_PROMPTS.map(
                    (prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() =>
                          sendMessage(prompt)
                        }
                        className="shrink-0 rounded-full border border-border bg-card px-3 py-2 text-xs transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        {prompt}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-border p-3"
            >
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2">
                {/* Microphone */}
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

                {/* Text input */}
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

                {/* Send */}
                <button
                  type="submit"
                  disabled={
                    !input.trim() ||
                    isThinking
                  }
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
                onClick={() =>
                  scrollToSection("experience")
                }
                className="rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-primary"
              >
                Experience
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToSection("skills")
                }
                className="rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-primary"
              >
                Skills
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToSection("projects")
                }
                className="rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-primary"
              >
                Projects
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToSection("contact")
                }
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
