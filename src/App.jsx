import { useEffect, useRef, useState } from "react";
import {
  Settings,
  Plus,
  ArrowUp,
  Sparkles,
  Lightbulb,
  Compass,
} from "lucide-react";

function AynexMark({ small = false }) {
  return (
    <div className={`aynex-mark ${small ? "small" : ""}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M14 47L32 13L50 47" />
        <path d="M21 36H43" />
        <path d="M24 47L32 36L40 47" />
      </svg>
    </div>
  );
}

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = input.trim();

    if (!text || isThinking) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      if (!data.message) {
        throw new Error("The AI returned an empty response.");
      }

      setMessages([
        ...updatedMessages,
        {
          role: "model",
          content: data.message,
        },
      ]);
    } catch (err) {
      console.error("AYNEX chat error:", err);

      setError(
        err.message || "AYNEX's AI core encountered an error."
      );
    } finally {
      setIsThinking(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setError("");
  };

  return (
    <div className="app">
      <div className="ambient-glow" />

      <header className="topbar">
        <div className="brand">
          <AynexMark small />

          <div className="brand-copy">
            <div className="brand-name">AYNEX</div>
            <div className="brand-tagline">THINK BEYOND</div>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className="icon-button"
            aria-label="New chat"
            onClick={startNewChat}
          >
            <Plus size={19} />
          </button>

          <button
            className="icon-button"
            aria-label="Settings"
            type="button"
          >
            <Settings size={19} />
          </button>
        </div>
      </header>

      <main className="chat-area">
        {messages.length === 0 ? (
          <section className="welcome">
            <AynexMark />

            <div className="eyebrow">
              <Sparkles size={13} />
              <span>INTELLIGENCE, REIMAGINED</span>
            </div>

            <h1>
              Think <span>beyond.</span>
            </h1>

            <p>
              Ask questions, explore ideas, and create
              <br />
              something extraordinary.
            </p>

            <div className="quick-actions">
              <button type="button" onClick={() => setInput("Explore an interesting topic")}>
                <Compass size={15} />
                Explore
              </button>

              <button type="button" onClick={() => setInput("Help me create something")}>
                <Sparkles size={15} />
                Create
              </button>

              <button type="button" onClick={() => setInput("What can you help me with?")}>
                <Lightbulb size={15} />
                Ask
              </button>
            </div>
          </section>
        ) : (
          <section className="messages">
            {messages.map((message, index) => (
              <div
                className={`message-row ${message.role}`}
                key={index}
              >
                <div className="message-avatar">
                  {message.role === "user" ? (
                    "You"
                  ) : (
                    <AynexMark small />
                  )}
                </div>

                <div className="message-content">
                  <div className="message-label">
                    {message.role === "user" ? "YOU" : "AYNEX"}
                  </div>

                  <div className="message-text">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="message-row model">
                <div className="message-avatar">
                  <AynexMark small />
                </div>

                <div className="message-content">
                  <div className="message-label">AYNEX</div>

                  <div className="thinking">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="chat-error">
                {error}
              </div>
            )}

            <div ref={chatEndRef} />
          </section>
        )}
      </main>

      <div className="composer-area">
        <form className="composer" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message AYNEX..."
            aria-label="Message AYNEX"
            disabled={isThinking}
          />

          <button
            className="send-button"
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isThinking}
          >
            <ArrowUp size={19} />
          </button>
        </form>

        <div className="composer-note">
          AYNEX may make mistakes. Verify important information.
        </div>
      </div>
    </div>
  );
}

export default App;
