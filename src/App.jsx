import { useState } from "react";
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!input.trim()) return;

    console.log("Message:", input);
    setInput("");
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
          <button className="icon-button" aria-label="New chat">
            <Plus size={19} />
          </button>

          <button className="icon-button" aria-label="Settings">
            <Settings size={19} />
          </button>
        </div>
      </header>

      <main className="chat-area">
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
            <button type="button">
              <Compass size={15} />
              Explore
            </button>

            <button type="button">
              <Sparkles size={15} />
              Create
            </button>

            <button type="button">
              <Lightbulb size={15} />
              Ask
            </button>
          </div>
        </section>
      </main>

      <div className="composer-area">
        <form className="composer" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message AYNEX..."
            aria-label="Message AYNEX"
          />

          <button
            className="send-button"
            type="submit"
            aria-label="Send message"
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
