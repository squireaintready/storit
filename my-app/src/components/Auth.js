import { useState } from "react";
import { login, register } from "../lib/store";

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const fn = mode === "login" ? login : register;
      onAuth(await fn(username, password));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={submit}>
        <div className="brand brand--lg">
          <span className="brand__mark" aria-hidden="true" />
          storit
        </div>
        <p className="auth__sub">Your documents, organized and private.</p>

        <div className="auth__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "is-active" : ""}
            onClick={() => switchMode("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={mode === "register" ? "is-active" : ""}
            onClick={() => switchMode("register")}
          >
            Create account
          </button>
        </div>

        <input
          className="field"
          placeholder="Username"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="field"
          type="password"
          placeholder="Password"
          value={password}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button className="btn btn--primary btn--block" disabled={busy}>
          {busy ? "…" : mode === "login" ? "Sign in" : "Create account"}
        </button>

        <p className="auth__note">
          Runs entirely in your browser — files are stored locally with IndexedDB,
          nothing is uploaded to a server.
        </p>
      </form>
    </div>
  );
}
