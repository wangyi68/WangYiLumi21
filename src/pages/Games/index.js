import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import Img from "../../components/img";

import { fetchNews, fetchCodes, fetchCalendar } from "../../api/hoyoverse";

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

// Translations (simple i18n)
const translations = {
  en: {
    gamesTitle: "Games 🎮",
    playedGames: "Games I've played and time...✨",
    topGames: "⬤ Games 🌎 Most Played",
    allGames: "⬤ All 🎏",
    gameEvents: "⬤ Game Events 🎉",
    activeCodes: "Active Codes",
    inactiveCodes: "Inactive Codes",
    noActiveCodes: "No active codes available",
    noInactiveCodes: "No inactive codes available",
    noEvents: "No events available",
    noCalendarEvents: "No calendar events available",
    errorLoading: "❌ Error loading data, please try again",
    copied: "Copied:",
    viewFull: "View Full Event Details",
    noDescription: "No detailed description available for this event.",
    calendar: "⬤ Calendar 📅",
    events: "Events",
    banners: "Banners",
    challenges: "Challenges",
    noBanners: "No banners available",
    noChallenges: "No challenges available",
  },
  zh: {
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
    noCalendarEvents: "没有可用的日历事件",
    errorLoading: "❌ 加载数据时出错，请重试",
    copied: "已复制:",
    viewFull: "查看完整事件详情",
    noDescription: "此事件没有详细描述。",
    calendar: "⬤ 日历 📅",
    events: "事件",
    banners: "横幅",
    challenges: "挑战",
    noBanners: "没有可用的横幅",
    noChallenges: "没有可用的挑战",
  },
};

// Assume default language is 'en'
const t = translations.en; // Can be dynamic based on context

const FALLBACK_IMAGE = "https://via.placeholder.com/260x160?text=No+Image";

const fmtDate = (ts) => {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fmtCountdown = (expiredAt) => {
  if (!expiredAt) return "";
  const now = Date.now() / 1000;
  const diff = expiredAt - now;
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  return `Remaining: ${days}d ${hours}h`;
};

const classNames = (...arr) => arr.filter(Boolean).join(" ");

// Skeleton Card Component
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow p-2 w-full animate-pulse">
      <div className="h-32 bg-slate-200 rounded-lg mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-1"></div>
      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
    </div>
  );
}

// Toast Component
function Toast({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 left-4 right-4 mx-auto max-w-xs bg-emerald-500 text-white px-3 py-2 rounded-lg shadow-lg text-xs z-50 sm:bottom-6 sm:max-w-sm sm:text-sm"
    >
      {message}
      <button
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white"
        aria-label="Close toast"
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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-3 sm:p-5 max-w-[95vw] sm:max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base sm:text-lg font-bold">{event.name || event.title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800" aria-label="Close preview">
            ✕
          </button>
        </div>
        <img
          src={event.image_url || event.banner?.[0] || FALLBACK_IMAGE}
          alt={`Banner for event: ${event.name || event.title}`}
          className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3"
          loading="lazy"
        />
        <p className="text-xs sm:text-sm text-slate-600 mb-3">
          {event.start_time ? `${fmtDate(event.start_time)} - ${fmtDate(event.end_time)}` : ""}
          {event.type_name && (
            <span className="ml-2 inline-block bg-cyan-100 text-cyan-800 text-xs px-1.5 py-0.5 rounded-full">
              {event.type_name}
            </span>
          )}
        </p>
        <div className="text-xs sm:text-sm text-slate-800 mb-3">
          {event.description || t.noDescription}
        </div>
        {event.rewards?.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs sm:text-sm font-semibold">Rewards:</h4>
            <ul className="text-xs sm:text-sm text-slate-600 list-disc pl-4 space-y-1">
              {event.rewards.map((reward, i) => (
                <li key={i}>
                  {reward.name} {reward.amount > 0 ? `(x${reward.amount})` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
        {event.special_reward && (
          <div className="mb-3">
            <h4 className="text-xs sm:text-sm font-semibold">Special Reward:</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              {event.special_reward.name} {event.special_reward.amount > 0 ? `(x${event.special_reward.amount})` : ""}
            </p>
          </div>
        )}
        {(event.characters?.length > 0 || event.weapons?.length > 0 || event.light_cones?.length > 0) && (
          <div className="mb-3">
            <h4 className="text-xs sm:text-sm font-semibold">Featured Items:</h4>
            <ul className="text-xs sm:text-sm text-slate-600 list-disc pl-4 space-y-1">
              {event.characters?.map((char, i) => (
                <li key={`char-${i}`}>
                  {char.name} ({char.rarity}★{char.element ? `, ${char.element}` : ""})
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
            className="text-xs sm:text-sm text-cyan-600 hover:text-cyan-800 underline"
            aria-label="View full event details"
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
        "bg-white rounded-xl shadow p-2 w-full text-left hover:ring-2 transition",
        data.is_active ? "ring-green-400" : "ring-red-400",
        isCopied ? "bg-yellow-50" : ""
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono font-semibold text-sm sm:text-base truncate">
          {data.code}
        </p>
        <button
          onClick={() => onCopy(data.code)}
          className="text-xs px-2 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-800"
          aria-label={`Copy code ${data.code}`}
        >
          Copy
        </button>
      </div>
      {Array.isArray(data.reward) && data.reward.length > 0 && (
        <ul className="text-xs sm:text-sm text-slate-600 mt-1.5 list-disc pl-4 space-y-0.5">
          {data.reward.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
      <p className={classNames(
        "text-xs mt-1",
        data.is_active ? "text-green-500" : "text-red-500"
      )}>
        {data.is_active ? "Active" : "Inactive"} {countdown}
      </p>
    </motion.div>
  );
}

// EventCard Component
function EventCard({ data, onClick }) {
  const [imageUrl, setImageUrl] = useState(
    data.image_url || data.banner?.[0] || FALLBACK_IMAGE
  );

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow p-2 w-full text-left hover:ring-2 ring-cyan-600 transition cursor-pointer"
      onClick={() => onClick(data)}
      role="button"
      tabIndex={0}
      aria-label={`View details for event: ${data.name || data.title}`}
    >
      <img
        src={imageUrl}
        alt={`Banner for event: ${data.name || data.title || "Event"}`}
        className="h-28 sm:h-32 w-full object-cover rounded-lg mb-2"
        onError={() => setImageUrl(FALLBACK_IMAGE)}
        loading="lazy"
      />
      <p className="font-semibold text-sm sm:text-base line-clamp-2">
        {data.name || data.title}
      </p>
      <p className="text-xs text-slate-500 mt-1">
        {data.start_time ? `${fmtDate(data.start_time)} - ${fmtDate(data.end_time)}` : data.createdAt ? fmtDate(data.createdAt) : ""}
        {(data.type_name || data.type) && (
          <span className="ml-2 inline-block bg-cyan-100 text-cyan-800 text-xs px-1.5 py-0.5 rounded-full">
            {data.type_name || data.type}
          </span>
        )}
      </p>
    </motion.div>
  );
}

// CalendarCard Component
function CalendarCard({ data, onClick }) {
  const [imageUrl, setImageUrl] = useState(
    data.image_url || data.banner?.[0] || FALLBACK_IMAGE
  );

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow p-2 w-full text-left hover:ring-2 ring-cyan-600 transition cursor-pointer"
      onClick={() => onClick(data)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${data.name || data.title}`}
    >
      <img
        src={imageUrl}
        alt={`Banner for ${data.name || data.title || "Item"}`}
        className="h-28 sm:h-32 w-full object-cover rounded-lg mb-2"
        onError={() => setImageUrl(FALLBACK_IMAGE)}
        loading="lazy"
      />
      <p className="font-semibold text-sm sm:text-base line-clamp-2">
        {data.name || `Banner ${data.id} (Version ${data.version})`}
      </p>
      <p className="text-xs text-slate-500 mt-1">
        {data.start_time ? `${fmtDate(data.start_time)} - ${fmtDate(data.end_time)}` : ""}
        {data.type_name && (
          <span className="ml-2 inline-block bg-cyan-100 text-cyan-800 text-xs px-1.5 py-0.5 rounded-full">
            {data.type_name}
          </span>
        )}
      </p>
    </motion.div>
  );
}

// CodesSection Component
function CodesSection({ title, filter, items, loading, onCopy, copiedCode }) {
  const filteredItems = items.filter((item) => item.is_active === filter);

  return (
    <div>
      <h4 className={`text-base font-semibold mb-2 ${filter ? "text-green-600" : "text-red-600"}`}>{title}</h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : (
          filteredItems.map((item, i) => (
            <CodeCard
              key={`${filter ? "active" : "inactive"}-${i}`}
              data={item}
              onCopy={onCopy}
              isCopied={copiedCode === item.code}
            />
          ))
        )}
      </div>
      {filteredItems.length === 0 && !loading && (
        <p className="text-center text-slate-500 text-xs sm:text-sm">{filter ? t.noActiveCodes : t.noInactiveCodes}</p>
      )}
    </div>
  );
}

// CalendarSection Component
function CalendarSection({ items, loading, onEventClick }) {
  const events = (items.events || []).sort((a, b) => (b.start_time || 0) - (a.start_time || 0));
  const banners = (items.banners || []).sort((a, b) => (b.start_time || 0) - (a.start_time || 0));
  const challenges = (items.challenges || []).sort((a, b) => (b.start_time || 0) - (a.start_time || 0));

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-semibold mb-2 text-cyan-600">{t.events}</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : (
            events.map((item) => (
              <CalendarCard
                key={`event-${item.id}`}
                data={item}
                onClick={onEventClick}
              />
            ))
          )}
          {events.length === 0 && !loading && (
            <p className="text-center text-slate-500 text-xs sm:text-sm">{t.noCalendarEvents}</p>
          )}
        </div>
      </div>
      <div>
        <h4 className="text-base font-semibold mb-2 text-cyan-600">{t.banners}</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : (
            banners.map((item) => (
              <CalendarCard
                key={`banner-${item.id}`}
                data={{ ...item, name: item.name || `Banner ${item.id} (Version ${item.version})` }}
                onClick={onEventClick}
              />
            ))
          )}
          {banners.length === 0 && !loading && (
            <p className="text-center text-slate-500 text-xs sm:text-sm">{t.noBanners}</p>
          )}
        </div>
      </div>
      <div>
        <h4 className="text-base font-semibold mb-2 text-cyan-600">{t.challenges}</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : (
            challenges.map((item) => (
              <CalendarCard
                key={`challenge-${item.id}`}
                data={item}
                onClick={onEventClick}
              />
            ))
          )}
          {challenges.length === 0 && !loading && (
            <p className="text-center text-slate-500 text-xs sm:text-sm">{t.noChallenges}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// GamesHeader Component
function GamesHeader() {
  return (
    <>
      <div className="mb-2 flex text-xl sm:text-2xl gap-2 font-bold">
        <div className="bg-neutral-800 h-6 sm:h-7 w-1.5"></div>
        <h2>{t.gamesTitle}</h2>
      </div>
      <p className="text-xs sm:text-sm">{t.playedGames}</p>
    </>
  );
}

// GamesList Component
function GamesList({ topGames, allGames }) {
  return (
    <>
      <h3 className="mb-2 text-base sm:text-lg mt-4">{t.topGames}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {topGames.map(({ name, time, img, url }) => (
          <div key={name} className="text-center">
            <Tippy
              content={`${time}h = ${(time / 24).toFixed(2)} days`}
              animation="scale"
            >
              <p className="text-cyan-600 w-fit mx-auto text-xs sm:text-sm">{time}h</p>
            </Tippy>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg overflow-hidden hover:ring-2 ring-cyan-600 bg-white"
              aria-label={`Visit ${name} website`}
            >
              <Img
                className="object-contain w-full max-w-[100px] sm:max-w-[120px] max-h-[150px] sm:max-h-[180px]"
                src={img}
                alt={`${name} app icon`}
                loading="lazy"
              />
            </a>
            <h4 className="truncate text-xs sm:text-sm mt-1">{name}</h4>
          </div>
        ))}
      </div>

      <h3 className="mb-2 text-base sm:text-lg mt-4">{t.allGames}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {allGames.map(({ name, time, img, url }) => (
          <Tippy
            key={name}
            content={
              <div>
                <h4>{name}</h4>
                <p className="text-cyan-300">{time}h</p>
              </div>
            }
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center border rounded-lg bg-white p-1 hover:ring-2 ring-cyan-600"
              aria-label={`Visit ${name} website`}
            >
              <Img className="object-contain w-full max-h-[56px] sm:max-h-[72px]" src={img} alt={`${name} icon`} loading="lazy" />
            </a>
          </Tippy>
        ))}
      </div>
    </>
  );
}

// GamesDashboard Component
function GamesDashboard({ activeGame, setActiveGame, activeTab, setActiveTab, items, loading, error, onCopy, copiedCode, onEventClick, selectedEvent, handleClosePreview, toast, setToast }) {
  const GAME_TABS = [
    { key: "genshin", label: "Genshin", icon: Genshin_Impact_App },
    { key: "starrail", label: "Star Rail", icon: Honkai_Star_Rail_App },
    { key: "zenless", label: "Zenless", icon: zzzLogo },
  ];

  const CONTENT_TABS = [
    { key: "news", label: "Events" },
    { key: "codes", label: "Codes" },
    { key: "calendar", label: "Calendar" },
  ];

  return (
    <>
      <h3 className="mb-2 text-base sm:text-lg mt-6">{t.gameEvents}</h3>

      {/* Game Tabs */}
      <div className="flex gap-1.5 sm:gap-2 mb-3 flex-wrap">
        {GAME_TABS.map((t) => (
          <motion.button
            key={t.key}
            onClick={() => setActiveGame(t.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={classNames(
              "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full border text-xs",
              activeGame === t.key
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white border-slate-200 hover:bg-slate-50"
            )}
            aria-label={`Switch to ${t.label} game`}
          >
            <img src={t.icon} alt={`${t.label} icon`} className="w-4 sm:w-5 h-4 sm:h-5 rounded-full" loading="lazy" />
            {t.label}
          </motion.button>
        ))}
      </div>

      {/* Content Tabs */}
      <div className="flex gap-1.5 sm:gap-2 mb-3 flex-wrap">
        {CONTENT_TABS.map((t) => (
          <motion.button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={classNames(
              "px-2 sm:px-3 py-1 rounded-md border text-xs",
              activeTab === t.key
                ? "bg-cyan-600 text-white border-cyan-600"
                : "bg-white border-slate-200 hover:bg-slate-50"
            )}
            aria-label={`Switch to ${t.label} tab`}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-center text-red-500 mb-3 text-xs sm:text-sm">{t.errorLoading}</p>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {activeTab === "codes" && (
            <>
              <CodesSection title={t.activeCodes} filter={true} items={items} loading={loading} onCopy={onCopy} copiedCode={copiedCode} />
              <CodesSection title={t.inactiveCodes} filter={false} items={items} loading={loading} onCopy={onCopy} copiedCode={copiedCode} />
            </>
          )}

          {activeTab === "news" && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : (
                items.map((item) => (
                  <EventCard
                    key={`event-${item.id}`}
                    data={item}
                    onClick={onEventClick}
                  />
                ))
              )}
              {items.length === 0 && !loading && (
                <p className="text-center text-slate-500 text-xs sm:text-sm">{t.noEvents}</p>
              )}
            </div>
          )}

          {activeTab === "calendar" && (
            <CalendarSection
              items={items}
              loading={loading}
              onEventClick={onEventClick}
            />
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
    </>
  );
}

function Games() {
  useEffect(() => {
    document.title = "🎮 - WangYi";
  }, []);

  const topGames = [
    {
      name: "Genshin Impact",
      time: 1324,
      img: Genshin_Impact_App,
      url: "https://genshin.hoyoverse.com/",
    },
    {
      name: "HonKai Star Rail",
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
      name: "Arena Of Valor",
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
      name: "Honkai Impact 3",
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
      name: "HonKai Star Rail",
      time: 17531.64,
      img: HonkaiStarrail,
      url: "https://hsr.hoyoverse.com/",
    },
    {
      name: "Genshin Impact",
      time: 8,
      img: Gayshit,
      url: "https://genshin.hoyoverse.com/",
    },
  ];

  const [activeGame, setActiveGame] = useState("genshin");
  const [activeTab, setActiveTab] = useState("news");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
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
      if (activeTab === "news") {
        result = await fetchNews(activeGame, { signal: abortControllerRef.current.signal }) || [];
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      } else if (activeTab === "codes") {
        const codes = await fetchCodes(activeGame, { signal: abortControllerRef.current.signal });
        result = [
          ...(codes.active || []).map((c) => ({ ...c, is_active: true })),
          ...(codes.inactive || []).map((c) => ({ ...c, is_active: false })),
        ];
      } else if (activeTab === "calendar") {
        const calendar = await fetchCalendar(activeGame, { signal: abortControllerRef.current.signal }) || {};
        result = {
          events: Array.isArray(calendar.events) ? calendar.events : [],
          banners: Array.isArray(calendar.banners) ? calendar.banners : [],
          challenges: Array.isArray(calendar.challenges) ? calendar.challenges : [],
        };
      }
      setItems(result);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        setError(true);
        setItems(activeTab === "calendar" ? { events: [], banners: [], challenges: [] } : []);
      }
    } finally {
      setLoading(false);
    }
  }, [activeGame, activeTab]);

  useEffect(() => {
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
    setTimeout(() => {
      setToast(null);
      setCopiedCode(null);
    }, 3000);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleClosePreview = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="font-sans text-neutral-800 w-full pb-6 max-w-7xl mx-auto px-3 sm:px-4">
      <GamesHeader />
      <GamesList topGames={topGames} allGames={allGames} />
      <GamesDashboard
        activeGame={activeGame}
        setActiveGame={setActiveGame}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        items={items}
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
