import { useState } from "react";
import { Settings, Plus, ArrowUp } from "lucide-react";

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
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">A</div>

          <div>
            <div className="brand-name">AYNEX</div>
            <div className="brand-status">AI INTELLIGENCE</div>
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
          <div className="welcome-mark">A</div>

          <h1>Hello, I'm AYNEX.</h1>

          <p>
            An intelligent AI system designed to think,
            <br />
            create, and assist.
          </p>
        </section>
      </main>

      <div className="composer-area">
        <form className="composer" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask AYNEX anything..."
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
          AYNEX can make mistakes. Verify important information.
        </div>
      </div>
    </div>
  );
}

export default App;
