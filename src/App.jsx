import { useEffect, useRef, useState } from "react";
import {
  Settings,
  Plus,
  ArrowUp,
  Sparkles,
  Lightbulb,
  Compass,
  Copy,
  Check,
} from "lucide-react";
const STORAGE_KEY = "aynex_conversations";

function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load conversations:", error);
    return [];
  }
}

function saveConversations(conversations) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(conversations)
    );
  } catch (error) {
    console.error("Failed to save conversations:", error);
  }
}

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

/* ---------- Inline Markdown ---------- */

function renderInlineMarkdown(text) {
  const parts = text.split(
    /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/
  );

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index}>
          {part.slice(1, -1)}
        </code>
      );
    }

    if (
      (part.startsWith("**") && part.endsWith("**")) ||
      (part.startsWith("__") && part.endsWith("__"))
    ) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (
      part.startsWith("*") &&
      part.endsWith("*") &&
      !part.startsWith("**")
    ) {
      return (
        <em key={index}>
          {part.slice(1, -1)}
        </em>
      );
    }

    if (
      part.startsWith("_") &&
      part.endsWith("_") &&
      !part.startsWith("__")
    ) {
      return (
        <em key={index}>
          {part.slice(1, -1)}
        </em>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

/* ---------- Markdown Renderer ---------- */

function MarkdownContent({ content }) {
  const lines = content.split("\n");
  const elements = [];

  let currentList = [];
  let listType = null;

  const flushList = () => {
    if (currentList.length === 0) return;

    const ListTag = listType === "number" ? "ol" : "ul";

    elements.push(
      <ListTag key={`list-${elements.length}`}>
        {currentList.map((item, index) => (
          <li key={index}>
            {renderInlineMarkdown(item)}
          </li>
        ))}
      </ListTag>
    );

    currentList = [];
    listType = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);

    if (headingMatch) {
      flushList();

      const level = headingMatch[1].length;
      const HeadingTag = `h${level}`;

      elements.push(
        <HeadingTag key={index}>
          {renderInlineMarkdown(headingMatch[2])}
        </HeadingTag>
      );

      return;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);

    if (bulletMatch) {
      if (listType !== "bullet") {
        flushList();
        listType = "bullet";
      }

      currentList.push(bulletMatch[1]);
      return;
    }

    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);

    if (numberedMatch) {
      if (listType !== "number") {
        flushList();
        listType = "number";
      }

      currentList.push(numberedMatch[1]);
      return;
    }

    flushList();

    elements.push(
      <p key={index}>
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className="markdown-content">{elements}</div>;
}

/* ---------- Typing Effect ---------- */

function TypingMessage({ content }) {
  const [visibleText, setVisibleText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setVisibleText("");
    setIsFinished(false);

    let index = 0;

    const interval = setInterval(() => {
      index += 1;

      setVisibleText(content.slice(0, index));

      if (index >= content.length) {
        clearInterval(interval);
        setIsFinished(true);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [content]);

  return (
    <>
      <MarkdownContent content={visibleText} />

      {!isFinished && (
        <span className="typing-cursor" />
      )}
    </>
  );
}

/* ---------- Main App ---------- */

function App() {
  const [input, setInput] = useState("");
const [messages, setMessages] = useState([]);
const [conversations, setConversations] = useState(() => {
  return loadConversations();
});
const [activeConversationId, setActiveConversationId] = useState(null);
const [isThinking, setIsThinking] = useState(false);
const [error, setError] = useState("");
const [copiedIndex, setCopiedIndex] = useState(null);

  const chatEndRef = useRef(null);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, isThinking]);

useEffect(() => {
  if (conversations.length === 0) return;

  const latestConversation = conversations[0];

  setActiveConversationId(latestConversation.id);
  setMessages(latestConversation.messages || []);
}, []);

useEffect(() => {
  if (!activeConversationId || messages.length === 0) return;

  setConversations((currentConversations) => {
    const updatedConversations = currentConversations.map(
      (conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              messages,
              updatedAt: Date.now(),
            }
          : conversation
    );

    saveConversations(updatedConversations);

    return updatedConversations;
  });
}, [messages, activeConversationId]);
  const updatedMessages = [...messages, userMessage];

let conversationId = activeConversationId;

if (!conversationId) {
  conversationId = crypto.randomUUID();

  const newConversation = {
    id: conversationId,
    title: text.slice(0, 40),
    messages: updatedMessages,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  setConversations((currentConversations) => {
    const updatedConversations = [
      newConversation,
      ...currentConversations,
    ];

    saveConversations(updatedConversations);

    return updatedConversations;
  });

  setActiveConversationId(conversationId);
}

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

      const finalMessages = [
  ...updatedMessages,
  {
    role: "model",
    content: data.message,
  },
];

setMessages(finalMessages);
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
  const newConversation = {
    id: crypto.randomUUID(),
    title: "New Chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  setConversations((currentConversations) => {
    const updatedConversations = [
      newConversation,
      ...currentConversations,
    ];

    saveConversations(updatedConversations);

    return updatedConversations;
  });

  setActiveConversationId(newConversation.id);
  setMessages([]);
  setInput("");
  setError("");
  setCopiedIndex(null);
};

  const copyAnswer = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);

      setCopiedIndex(index);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1800);
    } catch (err) {
      console.error("Copy failed:", err);
    }
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
              <button
                type="button"
                onClick={() =>
                  setInput("Explore an interesting topic")
                }
              >
                <Compass size={15} />
                Explore
              </button>

              <button
                type="button"
                onClick={() =>
                  setInput("Help me create something")
                }
              >
                <Sparkles size={15} />
                Create
              </button>

              <button
                type="button"
                onClick={() =>
                  setInput("What can you help me with?")
                }
              >
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
                    {message.role === "user" ? (
                      <p>{message.content}</p>
                    ) : (
                      <TypingMessage content={message.content} />
                    )}
                  </div>

                  {message.role === "model" && (
                    <button
                      className="copy-button"
                      type="button"
                      onClick={() =>
                        copyAnswer(message.content, index)
                      }
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check size={14} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy
                        </>
                      )}
                    </button>
                  )}
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
