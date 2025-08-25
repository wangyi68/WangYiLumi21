// src/api/visitorTracker.js

// Track visitor (tăng view nếu chưa visit)
export async function trackVisitor() {
  try {
    const visited = localStorage.getItem("visited");
    const res = await fetch("https://viewapi-beta.vercel.app/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newVisitor: !visited }),
    });

    const data = await res.json();

    if (!visited) {
      localStorage.setItem("visited", "true");
    }

    return data.total;
  } catch (err) {
    console.error("Error tracking visitor:", err);
    return 0;
  }
}

// Lấy tổng view mà không tăng
export async function getTotalViews() {
  try {
    const res = await fetch("https://viewapi-beta.vercel.app/api/views");
    const data = await res.json();
    return data.total;
  } catch (err) {
    console.error("Error getting total views:", err);
    return 0;
  }
}
