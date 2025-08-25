import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import { trackVisitor } from "../../api/visitorTracker";

function Footer() {
  const [ip, setIp] = useState("");
  const [views, setViews] = useState(0);

  useEffect(() => {
    const fetchIPAndTrack = async () => {
      try {
        // Lấy IP
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip || "Unknown");

        // Track tổng view toàn cầu
        const total = await trackVisitor();
        setViews(total);
      } catch (err) {
        console.error("Error:", err);
        setIp("Unavailable");
      }
    };

    fetchIPAndTrack();
  }, []);

  return (
    <div className="flex p-5 md:rounded-xl bg-white shadow-sm md:mt-3">
      <div className="sm:flex text-center justify-between text-sm w-full text-neutral-800 font-medium">
        <p>
          2025 © WangYi • Made with{" "}
          <a
            href="https://react.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600"
          >
            React
          </a>{" "}
          x{" "}
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600"
          >
            Tailwind
          </a>
        </p>
        <p className="flex gap-3 items-center justify-center">
          <Tippy animation="scale" content="我明白了">
            <a
              className="text-cyan-600"
              href="https://omar11.sa/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Omar Abdulaziz <span className="text-neutral-800">•</span> ✨
            </a>
          </Tippy>
          <span className="text-neutral-500">IP: {ip}</span>
          <span className="text-neutral-500">👁 {views} View</span>
        </p>
      </div>
    </div>
  );
}

export default Footer;
