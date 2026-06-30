import { useRef, useState } from "react";
import { saveFile, formatSize } from "../lib/store";

export default function FileUpload({ owner, onUploaded }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const pick = (chosen) => {
    if (!chosen) return;
    setFile(chosen);
    setName(chosen.name.replace(/\.[^.]+$/, ""));
  };

  const upload = async () => {
    if (!file) return;
    setBusy(true);
    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
    const base = name.trim() || file.name.replace(/\.[^.]+$/, "");
    await saveFile({
      id: crypto.randomUUID(),
      owner,
      name: base + ext,
      type: file.type || "application/octet-stream",
      size: file.size,
      blob: file,
      uploadedAt: Date.now(),
    });
    setFile(null);
    setName("");
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    onUploaded();
  };

  return (
    <section className="card">
      <h2 className="card__title">Upload a document</h2>

      <label
        className={`dropzone${dragging ? " dropzone--active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          onChange={(e) => pick(e.target.files[0])}
        />
        {file ? (
          <span>
            <strong>{file.name}</strong> · {formatSize(file.size)}
          </span>
        ) : (
          <span>Click to choose a file, or drag &amp; drop it here</span>
        )}
      </label>

      {file && (
        <div className="upload__row">
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="File name"
          />
          <button className="btn btn--primary" onClick={upload} disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      )}
    </section>
  );
}
