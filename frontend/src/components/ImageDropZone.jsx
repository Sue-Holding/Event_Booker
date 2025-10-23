import { useState, useRef } from "react";
import "../styles/ImageDropZone.css";

export default function ImageDropZone({ onFileSelect, defaultPreview }) {
  const [previewUrl, setPreviewUrl] = useState(defaultPreview || null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      onFileSelect(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="file-dropzone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
        onChange={handleFileChange}
        ref={fileInputRef}
        hidden
      />

      {previewUrl ? (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      ) : (
        <p className="dropzone-text">
          Drag & drop an image here, or <span>click to select</span>.
        </p>
      )}
    </div>
  );
}
