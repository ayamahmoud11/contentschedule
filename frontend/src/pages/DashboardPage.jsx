import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/me").then((res) => setUser(res.data));
    api.get("/posts").then((res) => setPosts(res.data));
  }, []);

  function startEditing(post) {
    setEditingPostId(post.id);
    setEditForm({
      title: post.title,
      content: post.content,
      status: post.status,
    });
    setError(null);
  }

  function cancelEditing() {
    setEditingPostId(null);
    setError(null);
  }

  async function saveEdit(postId) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/posts/${postId}`, {
        title: editForm.title,
        content: editForm.content,
        status: editForm.status,
      });
      // تحديث البوست في القائمة محلياً
      setPosts(posts.map(post => post.id === postId ? res.data : post));
      setEditingPostId(null);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء الحفظ");
    }
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "50px",
          boxSizing: "border-box",
          paddingBottom: "50px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            width: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
              Welcome, <span style={{ color: "#001f3f" }}>{user?.name}</span>
            </h1>
            <a
              href="/post-editor"
              style={{
                backgroundColor: "#001f3f",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              + Create New Post
            </a>
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#333" }}>
            Your Posts
          </h2>

          {posts.length === 0 ? (
            <div
              style={{
                backgroundColor: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
                color: "#888",
                fontSize: "16px",
              }}
            >
              No posts created yet
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    border: "1px solid #ddd",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {editingPostId === post.id ? (
                    <>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, title: e.target.value }))
                        }
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          padding: "5px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                        }}
                      />
                      <textarea
                        value={editForm.content}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, content: e.target.value }))
                        }
                        rows={4}
                        style={{
                          resize: "vertical",
                          padding: "5px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          fontSize: "14px",
                        }}
                      />
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, status: e.target.value }))
                        }
                        style={{
                          padding: "5px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          fontSize: "14px",
                          width: "150px",
                        }}
                      >
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="published">Published</option>
                      </select>
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                          disabled={loading}
                          onClick={() => saveEdit(post.id)}
                          style={{
                            backgroundColor: "#001f3f",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "5px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          disabled={loading}
                          onClick={cancelEditing}
                          style={{
                            backgroundColor: "#888",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "5px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                      {error && (
                        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#333",
                            margin: 0,
                            flex: "1 1 auto",
                          }}
                        >
                          {post.title}
                        </h3>
                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color:
                              post.status === "published"
                                ? "#065f46"
                                : post.status === "scheduled"
                                ? "#1e40af"
                                : "#374151",
                            backgroundColor:
                              post.status === "published"
                                ? "#d1fae5"
                                : post.status === "scheduled"
                                ? "#bfdbfe"
                                : "#e5e7eb",
                            marginLeft: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {post.status}
                        </span>
                      </div>

                      <p
                        style={{
                          color: "#555",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          margin: 0,
                          fontSize: "14px",
                        }}
                      >
                        {post.content}
                      </p>

                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post"
                          style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                      )}

                      <div
                        style={{
                          borderTop: "1px solid #ddd",
                          paddingTop: "10px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {post.platforms?.map((platform) => (
                          <span
                            key={platform.id}
                            style={{
                              backgroundColor: "#f3f4f6",
                              padding: "4px 10px",
                              borderRadius: "9999px",
                              fontSize: "12px",
                              color: "#555",
                              textTransform: "capitalize",
                            }}
                          >
                            {platform.name}
                          </span>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "12px",
                          color: "#888",
                        }}
                      >
                        <span>Scheduled:</span>
                        <span>
                          {post.scheduled_time
                            ? new Date(post.scheduled_time).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>

                      {/* زر التعديل */}
                      <button
                        onClick={() => startEditing(post)}
                        style={{
                          marginTop: "10px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          alignSelf: "flex-start",
                        }}
                      >
                        Edit Post
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
