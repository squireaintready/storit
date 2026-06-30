import { useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import { currentUser, logout } from "./lib/store";

export default function App() {
  const [user, setUser] = useState(currentUser());
  const [refresh, setRefresh] = useState(0);

  if (!user) return <Auth onAuth={setUser} />;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true" />
          storit
        </div>
        <div className="topbar__right">
          <span className="who">{user}</span>
          <button
            className="btn btn--ghost"
            onClick={() => {
              logout();
              setUser(null);
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="container">
        <FileUpload owner={user} onUploaded={() => setRefresh((n) => n + 1)} />
        <FileList owner={user} refreshKey={refresh} />
      </main>
    </div>
  );
}
