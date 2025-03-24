import React, { useState } from "react";
import API from "../../API";
import "./upload.css";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Chưa có file nào được chọn");
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      setMessage("Vui lòng chọn một file .mp3!");
      setFile(null);
      setFileName("Chưa có file nào được chọn");
      return;
    }

    // Kiểm tra phần mở rộng file
    const validExtensions = [".mp3"];
    const fileNameLower = selectedFile.name.toLowerCase();
    const isValidExtension = validExtensions.some((ext) =>
      fileNameLower.endsWith(ext)
    );

    if (!isValidExtension) {
      setMessage("Chỉ chấp nhận file .mp3!");
      setFile(null);
      setFileName("Chưa có file nào được chọn");
    } else {
      setMessage("");
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Vui lòng chọn file .mp3!");
      return;
    }

    let finalTitle = title.trim();
    let finalArtist = artist.trim();

    if (!finalTitle || !finalArtist) {
      const confirmFill = window.confirm(
        "Tiêu đề hoặc nghệ sĩ chưa được nhập. Tự động lấy từ file?"
      );
      if (!confirmFill) {
        setMessage("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", file); // Luôn có file

    // Chỉ thêm title & artist nếu cả hai đều có giá trị
    if (finalTitle) formData.append("title", finalTitle);
    if (finalArtist) formData.append("artist", finalArtist);

    try {
      setMessage("Đang tải lên...");
      // console.log("Uploading:", formData);

      await API.postSong(formData);

      setMessage("Tải lên thành công!");
      setTitle("");
      setArtist("");
      setFile(null);
      setFileName("Chưa có file nào được chọn");
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      setMessage(
        "Lỗi khi tải lên: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="screen-container">
      <div className="upload-container">
        <h2>Upload Bài Hát</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="label">Tiêu đề:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài hát"
              // required
            />
          </div>
          <div>
            <label className="label">Nghệ sĩ:</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Nhập tên nghệ sĩ"
              // required
            />
          </div>
          <div>
            <label className="label">Chọn file .mp3:</label>
            <label className="custom-file-upload">
              <input
                type="file"
                accept=".mp3"
                onChange={handleFileChange}
                required
              />
              Chọn file
            </label>
            <span className="file-name">{fileName}</span>
          </div>
          {message && <p className="message">{message}</p>}
          <button type="submit">Tải lên</button>
        </form>
      </div>
    </div>
  );
}
