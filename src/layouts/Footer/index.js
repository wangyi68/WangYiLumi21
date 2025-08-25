// React Component: Footer.jsx

import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import { trackVisitor } from "../../api/visitorTracker";

function Footer() {
  const [ip, setIp] = useState("Loading...");
  const [views, setViews] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIPAndTrack = async (retries = 3) => {
      try {
        // Lấy IP
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        setIp(ipData.ip || "Unknown");

        // Track tổng view
        const total = await trackVisitor();
        setViews(total);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        if (retries > 0) {
          console.log(`Retrying... (${retries} attempts left)`);
          setTimeout(() => fetchIPAndTrack(retries - 1), 1000);
        } else {
          setIp("Unavailable");
          setViews(0);
          setError("Failed to load data");
        }
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
          <span className="text-neutral-500">
            👁 {views !== null ? views : "Loading..."} View
          </span>
          {error && <span className="text-red-500">{error}</span>}
        </p>
      </div>
    </div>
  );
}

export default Footer;
