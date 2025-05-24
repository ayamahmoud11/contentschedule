import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function PostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
    imagePreview: null, // هنا بنخزن preview للصورة المعروضة
    scheduled_time: "",
    status: "draft",
    platforms: [],
  });

  useEffect(() => {
    api.get("/platforms").then((res) => setAvailablePlatforms(res.data));
  }, []);

  useEffect(() => {
    if (id) {
      api.get(`/posts/${id}`).then((res) => {
        const data = res.data;
        setForm({
          title: data.title,
          content: data.content,
          image: null,
          imagePreview: data.image_url || null, // لو عندنا URL صورة نعرضها
          scheduled_time: data.scheduled_time || "",
          status: data.status || "draft",
          platforms: data.platforms.map((p) => p.id),
        });
      });
    }
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setForm((f) => ({
          ...f,
          image: file,
          imagePreview: URL.createObjectURL(file), // إنشاء رابط مؤقت للعرض
        }));
      }
    } else if (name === "status") {
      setForm((f) => ({ ...f, status: value }));
    } else if (name === "scheduled_time") {
      setForm((f) => ({ ...f, scheduled_time: value }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handlePlatformChange(e) {
    const id = parseInt(e.target.value);
    if (e.target.checked) {
      setForm((f) => ({ ...f, platforms: [...f.platforms, id] }));
    } else {
      setForm((f) => ({
        ...f,
        platforms: f.platforms.filter((p) => p !== id),
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("scheduled_time", form.scheduled_time);
    formData.append("status", form.status);
    form.platforms.forEach((id) => formData.append("platforms[]", id));
    if (form.image) formData.append("image", form.image);

    try {
      if (id) {
        await api.post(`/posts/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      alert("Post saved successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save post. Please check your input.");
    }
  }

  return (
    <>
      <Navbar />
      <div
      
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "50px",
          backgroundColor: "#f3f4f6",
          boxSizing: "border-box",
          paddingBottom: "30px",
          overflowY: "auto",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            width: "500px",
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
          encType="multipart/form-data"
        >
          <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#333" }}>
            {id ? "Edit Post" : "Create Post"}
          </h2>

          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            value={form.title}
            onChange={handleChange}
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          />

          <textarea
            name="content"
            placeholder="Content"
            required
            rows={5}
            value={form.content}
            onChange={handleChange}
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", resize: "none" }}
          ></textarea>

          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                Upload Image:
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "5px", width: "100%" }}
              />
            </div>
            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="Preview"
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px", border: "1px solid #ccc" }}
              />
            )}
          </div>

          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Scheduled Time:</label>
            <input
              type="datetime-local"
              name="scheduled_time"
              value={form.scheduled_time}
              onChange={handleChange}
              required
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "5px", width: "100%" }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Status:</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "5px", width: "100%" }}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>

          <fieldset style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }}>
            <legend style={{ fontWeight: "bold" }}>Select Platforms:</legend>
            {availablePlatforms.length === 0 && <p>Loading platforms...</p>}
            {availablePlatforms.map((platform) => (
              <label
                key={platform.id}
                style={{ display: "inline-flex", alignItems: "center", marginRight: "15px", marginTop: "10px" }}
              >
                <input
                  type="checkbox"
                  value={platform.id}
                  checked={form.platforms.includes(platform.id)}
                  onChange={handlePlatformChange}
                  style={{ marginRight: "6px" }}
                />
                <span>{platform.name}</span>
              </label>
            ))}
          </fieldset>

          <button
            type="submit"
            style={{
              backgroundColor: "#001f3f",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Save Post
          </button>
        </form>
      </div>
    </>
  );
}
