import { useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import Img from "../../components/img";
import Honkai_Star_Rail_App from "../../assets/imgs/games/Honkai_Star_Rail_App.png";
import Genshin_Impact_App from "../../assets/imgs/games/Genshin_Impact_App.png";
import WuWa from "../../assets/imgs/games/WuWa.png";
import ArenaofValor from "../../assets/imgs/games/all/ArenaofValor.png";
import zzz from "../../assets/imgs/games/all/zzz.png";
import honkaiimpact from "../../assets/imgs/games/all/honkaiimpact.png";
import WuWaa from "../../assets/imgs/games/all/WuWaa.png";
import roblox from "../../assets/imgs/games/all/roblox.jpg";
import HonkaiStarrail from "../../assets/imgs/games/all/Honkai_Star_Rail.png";
import Gayshit from "../../assets/imgs/games/all/Genshin_Impact.png";

function Games() {
  useEffect(() => {
    document.title = "🎮 - WangYi";
  }, []);

  const games = [
    { name: "Genshin Impact", time: "1324", img: Genshin_Impact_App, url: "https://genshin.hoyoverse.com/" },
    { name: "HonKai Star Rail", time: "17,531.64", img: Honkai_Star_Rail_App, url: "https://hsr.hoyoverse.com/" },
    { name: "Wuthering Waves", time: "54", img: WuWa, url: "https://wutheringwaves.kurogames.com/" },
  ];

  const allGames = [
    { name: "Arena Of Valor", time: "1924", img: ArenaofValor, url: "https://www.arenaofvalor.com/" },
    { name: "Zenless Zone Zero", time: "320", img: zzz, url: "https://zenless.hoyoverse.com/" },
    { name: "Honkai Impact 3", time: "56", img: honkaiimpact, url: "https://honkaiimpact3.hoyoverse.com/" },
    { name: "Wuthering Waves", time: "54", img: WuWaa, url: "https://wutheringwaves.kurogames.com/" },
    { name: "Roblox", time: "26", img: roblox, url: "https://www.roblox.com/" },
    { name: "HonKai Star Rail", time: "17,531.64", img: HonkaiStarrail, url: "https://hsr.hoyoverse.com/" },
    { name: "Genshin Impact", time: "8", img: Gayshit, url: "https://genshin.hoyoverse.com/" },
  ];

  const upcomingEvents = [
    { name: "Genshin Impact - Lantern Rite", img: Genshin_Impact_App },
    { name: "HonKai Star Rail - New Character", img: Honkai_Star_Rail_App },
    { name: "Zenless Zone Zero - Event X", img: zzz },
  ];

  return (
    <div className="font-bold text-neutral-800 w-full pb-4">
      <div className="mb-3 flex text-3xl gap-2 font-bold">
        <div className="bg-neutral-800 h-[36px] w-2"></div>
        <h2>游戏 🎮</h2>
      </div>
      <p>我玩的游戏和时间...✨</p>

      {/* Các game chơi nhiều nhất */}
      <div>
        <h3 className="mb-2 text-lg mt-6">
          <span>⬤</span> 游戏 🌎 玩得最多
        </h3>
        <div className="flex gap-6 flex-wrap">
          {games.map(({ name, time, img, url }) => (
            <div key={time} className="text-center">
              <Tippy placement="right" offset={[-6, 8]} animation="scale" content={`${time}h = ${(time / 24).toFixed(2)} day`}>
                <p className="text-cyan-600 w-fit">{time}h</p>
              </Tippy>

              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block rounded-xl cursor-pointer overflow-hidden transition-transform ring-cyan-600 hover:ring-4 focus:ring-4 bg-white">
                <Img className="object-contain max-w-[160px] max-h-[240px]" src={img} alt={name} />
              </a>

              <h4 className="truncate w-full">{name}</h4>
            </div>
          ))}
        </div>

        {/* Tất cả game */}
        <h3 className="mb-2 text-lg mt-6">
          <span>⬤</span> 全部 🎏
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {allGames.map(({ name, time, img, url }) => (
            <Tippy
              key={time}
              arrow=" "
              offset={[-1, 5]}
              placement="top-start"
              content={
                <div>
                  <h4>{name}</h4>
                  <p className="text-cyan-300">{time} hours</p>
                </div>
              }
            >
              <a href={url} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center border border-slate-800/10 rounded-md overflow-hidden transition-transform ring-cyan-600 hover:ring-2 focus:ring-2 bg-white p-1">
                <Img className="object-contain max-h-[84px] max-w-full" src={img} alt={name} />
              </a>
            </Tippy>
          ))}
        </div>

        {/* Event Game - Coming Soon */}
        <h3 className="mb-2 text-lg mt-6">
          <span>⬤</span> 游戏活动 🎉 (Coming Soon)
        </h3>
        <div className="flex gap-6 flex-wrap">
          {upcomingEvents.map(({ name, img }, index) => (
            <div key={index} className="text-center">
              <div className="inline-block rounded-xl overflow-hidden cursor-not-allowed opacity-60 bg-white p-1">
                <Img className="object-contain max-w-[160px] max-h-[240px]" src={img} alt={name} />
              </div>
              <h4 className="truncate w-full">{name}</h4>
              <p className="text-sm text-gray-500">Coming Soon 🚀</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Games;
