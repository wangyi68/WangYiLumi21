import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";

// Game images
import Honkai_Star_Rail_App from "../../assets/imgs/games/Honkai_Star_Rail_App.png";
import Genshin_Impact_App from "../../assets/imgs/games/Genshin_Impact_App.png";
import WuWa from "../../assets/imgs/games/WuWa.png";
import ArenaofValor from "../../assets/imgs/games/all/ArenaofValor.png";
import zzzLogo from "../../assets/imgs/games/all/zzz.png";
import honkaiimpact from "../../assets/imgs/games/all/honkaiimpact.png";
import WuWaa from "../../assets/imgs/games/all/WuWaa.png";
import roblox from "../../assets/imgs/games/all/roblox.jpg";
import HonkaiStarrail from "../../assets/imgs/games/all/Honkai_Star_Rail.png";
import Gayshit from "../../assets/imgs/games/all/Genshin_Impact.png";

// Assume fetchNews and fetchCodes are imported from an API module
import { fetchNews, fetchCodes } from "../../api/hoyoverse";

// Translations (Chinese only)
const t = {
  gamesTitle: "游戏 🎮",
  playedGames: "我玩的游戏和时间...✨",
  topGames: "⬤ 游戏 🌎 玩得最多",
  allGames: "⬤ 全部 🎏",
  gameEvents: "⬤ 游戏活动 🎉",
  activeCodes: "激活码",
  inactiveCodes: "失效码",
  noActiveCodes: "没有可用的激活码",
  noInactiveCodes: "没有可用的失效码",
  noEvents: "没有可用的事件",
  errorLoading: "❌ 加载数据时出错，请重试",
  copied: "已复制:",
  viewFull: "查看完整事件详情",
  noDescription: "此事件没有详细描述。",
  events: "事件",
  previous: "上一页",
  next: "下一页",
};

const FALLBACK_IMAGE = "https://via.placeholder.com/260x160?text=无图片";

// Utility Functions
const fmtDate = (ts) => {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fmtCountdown = (expiredAt) => {
  if (!expiredAt) return "";
  const now = Date.now() / 1000;
  const diff = expiredAt - now;
  if (diff <= 0) return "已过期";
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  return `剩余: ${days}天 ${hours}小时`;
};

const classNames = (...arr) => arr.filter(Boolean).join(" ");

// SafeImage Component to handle image loading and fallbacks
function SafeImage({ src, alt, className, ...props }) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setImageSrc(FALLBACK_IMAGE)}
      loading="lazy"
      {...props}
    />
  );
}

// Skeleton Card Component
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-[280px] animate-pulse">
      <div className="h-44 bg-slate-200 rounded-xl mb-3"></div>
      <div className="h-5 bg-slate-200 rounded w-4/5 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-3/5"></div>
    </div>
  );
}

// Toast Component
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium"
    >
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white font-bold"
        aria-label="关闭提示"
      >
        ✕
      </button>
    </motion.div>
  );
}

// Event Preview Modal Component
function EventPreview({ event, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{event.name || event.title}</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
            aria-label="关闭预览"
          >
            ✕
          </button>
        </div>
        <SafeImage
          src={event.image_url || event.banner?.[0] || FALLBACK_IMAGE}
          alt={`活动横幅: ${event.name || event.title}`}
          className="w-full h-64 object-cover rounded-xl mb-6 shadow-md"
        />
        <p className="text-sm text-slate-600 mb-4">
          {event.start_time
            ? `${fmtDate(event.start_time)} - ${fmtDate(event.end_time)}`
            : ""}
          {event.type_name && (
            <span className="ml-2 inline-block bg-cyan-100 text-cyan-800 text-xs px-3 py-1 rounded-full">
              {event.type_name}
            </span>
          )}
          {event.is_active !== undefined && (
            <span
              className={`ml-2 inline-block text-xs px-3 py-1 rounded-full ${
                event.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {event.is_active ? "进行中" : "已结束"}
            </span>
          )}
        </p>
        <div className="text-sm text-slate-800 mb-6">
          {event.description || t.noDescription}
        </div>
        {event.rewards?.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2">奖励:</h4>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
              {event.rewards.map((reward, i) => (
                <li key={i}>
                  {reward.name} {reward.amount > 0 ? `(x${reward.amount})` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
        {event.special_reward && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2">特别奖励:</h4>
            <p className="text-sm text-slate-600">
              {event.special_reward.name}{" "}
              {event.special_reward.amount > 0
                ? `(x${event.special_reward.amount})`
                : ""}
            </p>
          </div>
        )}
        {(event.characters?.length > 0 ||
          event.weapons?.length > 0 ||
          event.light_cones?.length > 0) && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2">特色物品:</h4>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
              {event.characters?.map((char, i) => (
                <li key={`char-${i}`}>
                  {char.name}{" "}
                  ({char.rarity}★{char.element ? `, ${char.element}` : ""})
                </li>
              ))}
              {event.weapons?.map((weapon, i) => (
                <li key={`weapon-${i}`}>
                  {weapon.name} ({weapon.rarity}★)
                </li>
              ))}
              {event.light_cones?.map((lc, i) => (
                <li key={`lc-${i}`}>
                  {lc.name} ({lc.rarity}★)
                </li>
              ))}
            </ul>
          </div>
        )}
        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-600 hover:text-cyan-800 underline font-medium"
            aria-label="查看完整活动详情"
          >
            {t.viewFull}
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

// CodeCard Component
function CodeCard({ data, onCopy, isCopied }) {
  const [countdown, setCountdown] = useState(fmtCountdown(data.expiredAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(fmtCountdown(data.expiredAt));
    }, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, [data.expiredAt]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={classNames(
        "bg-white rounded-2xl shadow-lg p-4 w-[245px] text-left hover:ring-2 transition",
        data.is_active ? "ring-green-400" : "ring-red-400",
        isCopied ? "bg-yellow-50" : ""
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono font-semibold text-lg truncate">{data.code}</p>
        <button
          onClick={() => onCopy(data.code)}
          className="text-xs px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition"
          aria-label={`复制代码 ${data.code}`}
        >
          复制
        </button>
      </div>
      {Array.isArray(data.reward) && data.reward.length > 0 && (
        <ul className="text-sm text-slate-600 mt-3 list-disc pl-5 space-y-1">
          {data.reward.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
      <p
        className={classNames(
          "text-xs mt-2",
          data.is_active ? "text-green-500" : "text-red-500"
        )}
      >
        {data.is_active ? "进行中" : "已失效"} • {countdown}
      </p>
    </motion.div>
  );
}

// EventCard Component
function EventCard({ data, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-lg p-4 w-[250px] text-left hover:ring-2 ring-cyan-600 transition cursor-pointer"
      onClick={() => onClick(data)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(data);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`查看活动详情: ${data.name || data.title}`}
    >
      <SafeImage
        src={data.image_url || data.banner?.[0] || FALLBACK_IMAGE}
        alt={`活动横幅: ${data.name || data.title || "活动"}`}
        className="h-44 w-full object-cover rounded-xl mb-3 shadow-sm"
      />
      <p className="font-semibold line-clamp-2 text-lg">
        {data.name || data.title}
      </p>
      <p className="text-xs text-slate-500 mt-2">
        {data.start_time
          ? `${fmtDate(data.start_time)} - ${fmtDate(data.end_time)}`
          : ""}
        {(data.type_name || data.type) && (
          <span className="ml-2 inline-block bg-cyan-100 text-cyan-800 text-xs px-3 py-1 rounded-full">
            {data.type_name || data.type}
          </span>
        )}
        {data.is_active !== undefined && (
          <span
            className={`ml-2 inline-block text-xs px-3 py-1 rounded-full ${
              data.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {data.is_active ? "进行中" : "已结束"}
          </span>
        )}
      </p>
    </motion.div>
  );
}

// CodesSection Component
function CodesSection({ title, filter, items, loading, onCopy, copiedCode }) {
  const filteredItems = Array.isArray(items)
    ? items.filter((item) => item.is_active === filter)
    : [];

  return (
    <div>
      <h4
        className={`text-xl font-semibold mb-4 ${
          filter ? "text-green-600" : "text-red-600"
        }`}
      >
        {title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, i) => (
            <CodeCard
              key={`${filter ? "active" : "inactive"}-${i}`}
              data={item}
              onCopy={onCopy}
              isCopied={copiedCode === item.code}
            />
          ))
        ) : (
          <p className="text-center text-slate-500 col-span-full text-lg">
            {filter ? t.noActiveCodes : t.noInactiveCodes}
          </p>
        )}
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={classNames(
          "px-4 py-2 rounded-lg text-sm font-medium",
          currentPage === 1
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-white border border-slate-200 hover:bg-slate-50"
        )}
        aria-label="上一页"
      >
        {t.previous}
      </motion.button>
      {getPageNumbers().map((page) => (
        <motion.button
          key={page}
          onClick={() => onPageChange(page)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={classNames(
            "px-4 py-2 rounded-lg text-sm font-medium",
            currentPage === page
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent"
              : "bg-white border border-slate-200 hover:bg-slate-50"
          )}
          aria-label={`跳转到第 ${page} 页`}
        >
          {page}
        </motion.button>
      ))}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={classNames(
          "px-4 py-2 rounded-lg text-sm font-medium",
          currentPage === totalPages
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-white border border-slate-200 hover:bg-slate-50"
        )}
        aria-label="下一页"
      >
        {t.next}
      </motion.button>
    </div>
  );
}

// GamesHeader Component
function GamesHeader() {
  return (
    <>
      <div className="mb-4 flex text-4xl gap-3 font-bold items-center">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-[40px] w-3 rounded-full"></div>
        <h2>{t.gamesTitle}</h2>
      </div>
      <p className="text-lg text-slate-600">{t.playedGames}</p>
    </>
  );
}

// GamesList Component
function GamesList({ topGames, allGames }) {
  return (
    <>
      <h3 className="mb-3 text-xl font-semibold mt-8 text-cyan-600">
        {t.topGames}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {topGames.map(({ name, time, img, url }) => (
          <div key={name} className="text-center">
            <Tippy
              content={`${time}小时 = ${(time / 24).toFixed(2)} 天`}
              animation="scale"
            >
              <p className="text-cyan-600 font-medium mb-2">{time}小时</p>
            </Tippy>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl overflow-hidden hover:ring-4 ring-cyan-500 bg-white shadow-lg transition"
              aria-label={`访问 ${name} 网站`}
            >
              <SafeImage
                className="object-contain max-w-[180px] max-h-[260px]"
                src={img}
                alt={`${name} 应用图标`}
              />
            </a>
            <h4 className="mt-2 font-semibold text-lg truncate">{name}</h4>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-xl font-semibold mt-10 text-cyan-600">
        {t.allGames}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {allGames.map(({ name, time, img, url }) => (
          <Tippy
            key={name}
            content={
              <div>
                <h4>{name}</h4>
                <p className="text-cyan-300">{time}小时</p>
              </div>
            }
            animation="scale"
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center border rounded-lg bg-white p-2 hover:ring-2 ring-cyan-500 shadow-sm transition"
              aria-label={`访问 ${name} 网站`}
            >
              <SafeImage
                className="object-contain max-h-[90px]"
                src={img}
                alt={`${name} 图标`}
              />
            </a>
          </Tippy>
        ))}
      </div>
    </>
  );
}

// GamesDashboard Component
function GamesDashboard({
  activeGame,
  setActiveGame,
  activeTab,
  setActiveTab,
  items,
  codeItems,
  loading,
  error,
  onCopy,
  copiedCode,
  onEventClick,
  selectedEvent,
  handleClosePreview,
  toast,
  setToast,
}) {
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const GAME_TABS = [
    { key: "genshin", label: "Genshin Impact", icon: Genshin_Impact_App },
    { key: "starrail", label: "Honkai Star Rail", icon: Honkai_Star_Rail_App },
    { key: "zenless", label: "Zenless Zone Zero", icon: zzzLogo },
  ];

  const CONTENT_TABS = [
    { key: "news", label: "News" },
    { key: "codes", label: "Redemption Codes" },
  ];

  // Memoize paginated items
  const paginatedItems = useMemo(() => {
    return items.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [items, currentPage]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  // Reset to page 1 when items or activeTab change
  useEffect(() => {
    setCurrentPage(1);
  }, [items, activeTab]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-slate-50 p-8 rounded-2xl shadow-md mt-10">
      <h3 className="mb-6 text-2xl font-semibold text-cyan-600">
        {t.gameEvents}
      </h3>

      {/* Game Tabs */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
        {GAME_TABS.map((t) => (
          <motion.button
            key={t.key}
            onClick={() => {
              setActiveGame(t.key);
              setCurrentPage(1);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={classNames(
              "flex items-center gap-2 px-5 py-2.5 rounded-full border text-base font-medium shadow-sm",
              activeGame === t.key
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent"
                : "bg-white border-slate-300 hover:bg-slate-100"
            )}
            aria-label={`切换到 ${t.label} 游戏`}
          >
            <SafeImage
              src={t.icon}
              alt={`${t.label} 图标`}
              className="w-7 h-7 rounded-full"
            />
            {t.label}
          </motion.button>
        ))}
      </div>

      {/* Content Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
        {CONTENT_TABS.map((t) => (
          <motion.button
            key={t.key}
            onClick={() => {
              setActiveTab(t.key);
              setCurrentPage(1);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={classNames(
              "px-5 py-2.5 rounded-lg border text-base font-medium shadow-sm",
              activeTab === t.key
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent"
                : "bg-white border-slate-300 hover:bg-slate-100"
            )}
            aria-label={`切换到 ${t.label} 标签`}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-center text-red-500 mb-6 text-lg">{t.errorLoading}</p>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-10"
        >
          {activeTab === "codes" && (
            <>
              <CodesSection
                title={t.activeCodes}
                filter={true}
                items={codeItems}
                loading={loading}
                onCopy={onCopy}
                copiedCode={copiedCode}
              />
              <CodesSection
                title={t.inactiveCodes}
                filter={false}
                items={codeItems}
                loading={loading}
                onCopy={onCopy}
                copiedCode={copiedCode}
              />
            </>
          )}

          {activeTab === "news" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <EventCard
                      key={`event-${item.id}`}
                      data={item}
                      onClick={onEventClick}
                    />
                  ))
                ) : (
                  <p className="text-center text-slate-500 col-span-full text-lg">
                    {t.noEvents}
                  </p>
                )}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Event Preview Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventPreview event={selectedEvent} onClose={handleClosePreview} />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Games() {
  const topGames = [
    {
      name: "Genshin Impact",
      time: 1324,
      img: Genshin_Impact_App,
      url: "https://genshin.hoyoverse.com/",
    },
    {
      name: "Honkai Star Rail",
      time: 17531.64,
      img: Honkai_Star_Rail_App,
      url: "https://hsr.hoyoverse.com/",
    },
    {
      name: "Wuthering Waves",
      time: 54,
      img: WuWa,
      url: "https://wutheringwaves.kurogames.com/",
    },
  ];

  const allGames = [
    {
      name: "Arena of Valor",
      time: 1924,
      img: ArenaofValor,
      url: "https://www.arenaofvalor.com/",
    },
    {
      name: "Zenless Zone Zero",
      time: 320,
      img: zzzLogo,
      url: "https://zenless.hoyoverse.com/",
    },
    {
      name: "Honkai Impact 3rd",
      time: 56,
      img: honkaiimpact,
      url: "https://honkaiimpact3.hoyoverse.com/",
    },
    {
      name: "Wuthering Waves",
      time: 54,
      img: WuWaa,
      url: "https://wutheringwaves.kurogames.com/",
    },
    { name: "Roblox", time: 26, img: roblox, url: "https://www.roblox.com/" },
    {
      name: "Honkai Star Rail",
      time: 17531.64,
      img: HonkaiStarrail,
      url: "https://hsr.hoyoverse.com/",
    },
    {
      name: "Genshin Impact",
      time: 1324,
      img: Gayshit,
      url: "https://genshin.hoyoverse.com/",
    },
  ].filter(
    // Remove duplicates based on name
    (game, index, self) =>
      index === self.findIndex((g) => g.name === game.name)
  );

  const [activeGame, setActiveGame] = useState("genshin");
  const [activeTab, setActiveTab] = useState("news");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [codeItems, setCodeItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const abortControllerRef = useRef(null);

  const loadData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);
    try {
      let result = [];
      let codes = [];
      if (activeTab === "news") {
        result = (await fetchNews(activeGame, { signal: abortControllerRef.current.signal })) || [];
        result = result.map((item) => ({
          ...item,
          is_active: item.end_time ? Date.now() / 1000 < item.end_time : true,
        }));
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      } else if (activeTab === "codes") {
        const codeData = await fetchCodes(activeGame, {
          signal: abortControllerRef.current.signal,
        });
        codes = [
          ...(codeData?.active || []).map((c) => ({ ...c, is_active: true })),
          ...(codeData?.inactive || []).map((c) => ({ ...c, is_active: false })),
        ];
      }
      setItems(result);
      setCodeItems(codes);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        setError(true);
        setItems([]);
        setCodeItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [activeGame, activeTab]);

  useEffect(() => {
    document.title = "🎮 - WangYi";
    loadData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setToast(`${t.copied} ${code}`);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleClosePreview = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="font-sans text-neutral-800 w-full pb-12 max-w-7xl mx-auto px-4">
      <GamesHeader />
      <GamesList topGames={topGames} allGames={allGames} />
      <GamesDashboard
        activeGame={activeGame}
        setActiveGame={setActiveGame}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        items={items}
        codeItems={codeItems}
        loading={loading}
        error={error}
        onCopy={handleCopy}
        copiedCode={copiedCode}
        onEventClick={handleEventClick}
        selectedEvent={selectedEvent}
        handleClosePreview={handleClosePreview}
        toast={toast}
        setToast={setToast}
      />
    </div>
  );
}

export default Games;
