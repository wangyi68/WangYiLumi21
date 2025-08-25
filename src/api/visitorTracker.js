const API_URL = "https://viewapi-beta.vercel.app"; // Replace with your actual Vercel API URL

// Track visitor (increment view if new visitor)
export async function trackVisitor() {
  try {
    const visited = localStorage.getItem("visited") === "true"; // Explicitly check for "true"
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
    throw err; // Throw error to be handled by component
  }
}

// Get total views without incrementing
export async function getTotalViews() {
  try {
    const res = await fetch(`${API_URL}/api/views`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    return data.total;
  } catch (err) {
    console.error("Error getting total views:", err);
    throw err; // Throw error to be handled by component
  }
}
