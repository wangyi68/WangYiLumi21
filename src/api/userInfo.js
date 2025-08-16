import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";

function CustomStatus({ customStatus }) {
  return (
    <>
      {customStatus && (
        <p className='text-sm text-slate-600 mt-[2px]'>
          ▸ {customStatus.emoji && <span className='mr-1'>{customStatus.emoji.name}</span>}
          {customStatus.state}
        </p>
      )}
    </>
  );
}

function replaceCharacters(inputString) {
  return inputString.replace(/;/g, ",").replace(/'/g, ",");
}

function UserInfo() {
  const [userData, setUserData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isWeather, setIsWeather] = useState(false);
  const [weather, setWeather] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://api.lanyard.rest/v1/users/1391995229241868459");
      const userData = response.data.data;
      setUserData(userData);
    } catch (error) {
      console.error("错误:", error);
    }
  };

  const fetchWeather = () => {
    axios
      .get("https://api.openweathermap.org/data/2.5/weather?q=Quang%20Ngai,vn&appid=a601622a383aee1aea5573743d8e8875&units=metric")
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.error("错误:", error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchWeather();

    const intervalId = setInterval(
      () => {
        fetchData();
        fetchWeather();
      },
      1 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (userData) {
      const startTimestamp = userData.activities.find((activity) => activity.type === 0)?.timestamps.start;
      const intervalId = setInterval(() => {
        const currentTimestamp = Date.now();
        const elapsed = currentTimestamp - startTimestamp;
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [userData]);

  const formatElapsedTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (!userData || !weather) {
    return (
      <>
        <div className='md:flex gap-6 items-center'>
          <div className='md:m-0 mb-5 mx-auto rounded-full min-w-32 size-32 overflow-hidden border-4 border-cyan-500'>
            <div className='rounded-full overflow-hidden border-4 border-transparent'>
              <div className='size-[112px] bg-slate-300 animate-pulse'></div>
            </div>
          </div>
          <div className='text-gray-900 '>
            <h2 className='font-semibold text-2xl'>
              嘿，我{" "}
              <Tippy animation='scale' content='Quang Huy'>
                <span className='text-cyan-800'>WangYi</span>
              </Tippy>{" "}
              👋
            </h2>
            <div className='w-full h-1 bg-cyan-500 rounded-sm my-1'></div>
            <div className='font-semibold text-justify'>
              大家好！我是 WangYi (<span className='text-cyan-800'>200x</span>), 自学成才的网络开发人员和游戏玩家 Honkai Star Rail. 凭借自学的知识和有趣的项目，我正在寻找新的机会
              为工作带来创造力和热情。{" "}
              <Link className='text-slate-600 underline' to='/skills'>
                查看更多？
              </Link>{" "}
              ✒️
            </div>
          </div>
        </div>
        <div className='w-56 rounded-full bg-slate-300 animate-pulse h-4 mt-4'></div>
        <div className='w-52 rounded-full bg-slate-300 animate-pulse h-4 mt-3'></div>
      </>
    );
  }

  const { discord_user, activities, discord_status } = userData;
  const { avatar } = discord_user;
  const customStatus = activities.find((activity) => activity.type === 4);
  const listeningToSpotify = activities.find((activity) => activity.type === 2);

  const online = (
    <div className='flex items-center'>
      <div className='translate-y-[-1px] size-3 rounded-full bg-cyan-500'>
        <div className='size-3 rounded-full bg-cyan-500 animate-ping'></div>
      </div>
      <div className='ml-2 cursor-pointer' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <p>看起来他在线</p>
        {isHovered && (
          <div className='cursor-text absolute z-10 translate-x-[-20px] p-2 rounded-xl bg-slate-50 border-dashed border-cyan-500 border-4'>
            <p className='font-bold'>我在家 🏡 或者咖啡馆外面 ☕</p>
            {activities.length === 0 ? (
              <></>
            ) : (
              activities.map((activity) => (
                <div className='' key={activity.type}>
                  {activity.type === 0 && (
                    <p>
                      ▸ 演奏 🌠: {activity.name} <span className='text-sm text-slate-600'>({formatElapsedTime(elapsedTime)} 已经过去了)</span>
                    </p>
                  )}
                </div>
              ))
            )}
            {listeningToSpotify && (
              <div className=''>
                <p>
                  ▸ Spotify 🎶: {listeningToSpotify.details} - {replaceCharacters(listeningToSpotify.state)}
                </p>
              </div>
            )}
            <CustomStatus customStatus={customStatus} />
          </div>
        )}
      </div>
    </div>
  );

  const idle = (
    <div className='flex items-center'>
      <div className='translate-y-[-1px] size-3 rounded-full bg-yellow-500'>
        <div className='size-3 rounded-full bg-yellow-500 animate-ping'></div>
      </div>
      <div className='ml-2 cursor-pointer' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <p>不活跃</p>
        {isHovered && (
          <div className='cursor-text absolute z-10 translate-x-[-20px] p-2 rounded-xl bg-slate-100 border-dashed border-cyan-500 border-4'>
            <p>🧩 好像在做别的事</p>
            {listeningToSpotify && (
              <div className=''>
                <p>
                  ▸ Spotify 🎶: {listeningToSpotify.details} - {replaceCharacters(listeningToSpotify.state)}
                </p>
              </div>
            )}
            <CustomStatus customStatus={customStatus} />
          </div>
        )}
      </div>
    </div>
  );

  const offline = (
    <div className='flex items-center'>
      <div className='translate-y-[-1px] size-3 rounded-full bg-red-600'>
        <div className='size-3 rounded-full bg-red-600 animate-ping'></div>
      </div>
      <div className='ml-2 cursor-pointer' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <p>现已离线</p>
        {isHovered && (
          <div className='cursor-text absolute z-10 translate-x-[-20px] p-2 rounded-xl bg-slate-100 border-dashed border-cyan-500 border-4'>
            <p>外出🚪或睡觉 💤</p>
            <CustomStatus customStatus={customStatus} />
          </div>
        )}
      </div>
    </div>
  );

  const dnd = (
    <div className='flex items-center'>
      <div className='translate-y-[-1px] size-3 rounded-full bg-red-900'>
        <div className='size-3 rounded-full bg-red-900 animate-ping'></div>
      </div>
      <div className='ml-2 cursor-pointer' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <p>不想被打扰</p>
        {isHovered && (
          <div className='cursor-text absolute z-10 translate-x-[-20px] p-2 rounded-xl bg-slate-100 border-dashed border-cyan-500 border-4'>
            <p>不想被打扰🚫！</p>
            {listeningToSpotify && (
              <div className=''>
                <p>
                  ▸ Spotify 🎶: {listeningToSpotify.details} - {replaceCharacters(listeningToSpotify.state)}
                </p>
              </div>
            )}
            <CustomStatus customStatus={customStatus} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className='md:flex gap-6 items-center'>
        <div className='md:m-0 mb-5 mx-auto rounded-full min-w-32 size-32 overflow-hidden border-4 border-cyan-500'>
          <div className='rounded-full overflow-hidden border-4 border-transparent'>
            <img src={`https://cdn.discordapp.com/avatars/${discord_user.id}/${avatar}.png`} alt='Avatar' />
          </div>
        </div>
        <div className='text-gray-900 '>
          <h2 className='font-semibold text-2xl'>
            嘿，我{" "}
            <Tippy animation='scale' content='Quang Huy'>
              <span className='text-cyan-800'>WangYi</span>
            </Tippy>{" "}
            👋
          </h2>
          <div className='w-full h-1 bg-cyan-500 rounded-sm my-1'></div>
          <div className='font-semibold text-justify'>
            大家好！我是 WangYi (<span className='text-cyan-600'>200x</span>), 自学成才的 Web 开发人员和 Honkai Star Rail 玩家. 凭借自学的知识和有趣的项目，我正在寻找新的机会来
            创造力和工作热情{" "}
            <Link className='text-slate-600 underline' to='/skills'>
              查看更多？
            </Link>{" "}
            ✒️
          </div>
        </div>
      </div>
      <div className='font-semibold text-gray-900 mt-4 '>{discord_status === "online" ? online : discord_status === "idle" ? idle : discord_status === "dnd" ? dnd : offline}</div>
      <div>
        <div className='flex items-center'>
          <svg className='w-5 h-5 text-gray-800  -translate-x-[4px] -translate-y-[1px]' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'>
            <path fillRule='evenodd' d='M12 2a8 8 0 0 1 6.6 12.6l-.1.1-.6.7-5.1 6.2a1 1 0 0 1-1.6 0L6 15.3l-.3-.4-.2-.2v-.2A8 8 0 0 1 11.8 2Zm3 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' clipRule='evenodd' />
          </svg>
          <div className='font-semibold text-gray-900 cursor-pointer' onMouseEnter={() => setIsWeather(true)} onMouseLeave={() => setIsWeather(false)}>
            <p>Quang Ngai, Vietnam</p>
            {isWeather && (
              <div className='cursor-text absolute z-10 translate-x-[-20px] p-2 rounded-xl bg-slate-100 border-dashed border-cyan-500 border-4'>
                <p>⛺ 城市: {weather.name}</p>
                <p>⛅ 温度: {weather.main.temp} ºC</p>
                <p>🚿 湿度: {weather.main.humidity}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
