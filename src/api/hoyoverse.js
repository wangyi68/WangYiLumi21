const BASE_URL = "https://hoyoverse-pi.vercel.app/api/mihoyo";

export const fetchGameData = async (game, endpoint, params = {}) => {
  try {
    const url = new URL(`${BASE_URL}/${game}/${endpoint}`);
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint} for ${game}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint} for ${game}:`, error);
    return null;
  }
};

// Specific API calls
export const fetchNews = (game) =>
  fetchGameData(game, "news/events", { lang: "en" });

export const fetchEvents = (game) => fetchGameData(game, "events");

export const fetchCalendar = (game) => fetchGameData(game, "calendar");

export const fetchCodes = async (game) => {
  const data = await fetchGameData(game, "codes");
  if (!data) return { active: [], inactive: [] };
  return {
    active: Array.isArray(data.active) ? data.active : [],
    inactive: Array.isArray(data.inactive) ? data.inactive : [],
  };
};
