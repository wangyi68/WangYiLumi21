import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";

function Footer() {
  const [ip, setIp] = useState("");

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
        const text = await res.text();

        // parse kết quả: mỗi dòng dạng key=value
        const data = Object.fromEntries(
          text
            .trim()
            .split("\n")
            .map((line) => line.split("="))
        );

        setIp(data.ip || "Unknown");
      } catch (err) {
        console.error("Error fetching IP:", err);
        setIp("Unavailable");
      }
    };

    fetchIP();
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
        <p className="flex gap-2 items-center justify-center">
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
        </p>
      </div>
    </div>
  );
}

export default Footer;
