import { useCallback, useEffect, useState } from "react";
import { listFiles, deleteFile, formatSize, extOf } from "../lib/store";

export default function FileList({ owner, refreshKey }) {
  const [files, setFiles] = useState([]);

  const load = useCallback(() => {
    listFiles(owner).then(setFiles);
  }, [owner]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const download = (f) => {
    const url = URL.createObjectURL(f.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const remove = async (id) => {
    await deleteFile(id);
    load();
  };

  return (
    <section className="card">
      <h2 className="card__title">
        Your documents
        {files.length > 0 && <span className="count">{files.length}</span>}
      </h2>

      {files.length === 0 ? (
        <p className="empty">No documents yet. Upload your first file above.</p>
      ) : (
        <ul className="filelist">
          {files.map((f) => (
            <li key={f.id} className="filerow">
              <span className="filerow__ext">{extOf(f.name)}</span>
              <span className="filerow__meta">
                <span className="filerow__name">{f.name}</span>
                <span className="filerow__sub">
                  {formatSize(f.size)} · {new Date(f.uploadedAt).toLocaleDateString()}
                </span>
              </span>
              <span className="filerow__actions">
                <button className="btn btn--ghost" onClick={() => download(f)}>
                  Download
                </button>
                <button className="btn btn--danger" onClick={() => remove(f.id)}>
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
