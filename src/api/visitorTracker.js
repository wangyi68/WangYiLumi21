// Frontend API Client: src/api/visitorTracker.js

const API_URL = process.env.REACT_APP_API_URL || "https://viewapi-beta.vercel.app";

// Track visitor (tăng view nếu chưa visit)
export async function trackVisitor() {
  try {
    const visited = localStorage.getItem("visited");
    const res = await fetch(`${API_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newVisitor: !visited }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    if (!visited) {
      localStorage.setItem("visited", "true");
    }

    return data.total;
  } catch (err) {
    console.error("Error tracking visitor:", err);
    throw err; // Ném lỗi để component xử lý
  }
}

// Lấy tổng view mà không tăng
export async function getTotalViews() {
  try {
    const res = await fetch(`${API_URL}/api/views`);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    return data.total;
  } catch (err) {
    console.error("Error getting total views:", err);
    throw err; // Ném lỗi để component xử lý
  }
}
