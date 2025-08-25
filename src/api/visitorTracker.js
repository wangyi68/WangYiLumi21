// Chỉ dùng localStorage để đếm view

export async function trackVisitor(ip) {
  try {
    // Kiểm tra nếu đã vào rồi (trong cùng 1 phiên)
    const visited = localStorage.getItem("visited");
    let total = parseInt(localStorage.getItem("totalViews") || "0", 10);

    if (!visited) {
      // Lần đầu vào -> tăng view
      total += 1;
      localStorage.setItem("totalViews", total.toString());
      localStorage.setItem("visited", "true");
    }

    return total;
  } catch (err) {
    console.error("Error tracking visitor:", err);
    return 0;
  }
}
