import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceGrinBeamSweat,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBriefcase,
  faEarthAsia,
  faUserGraduate,
  faSchool,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/effect-cards";

import ChillImg from "../../assets/imgs/images.jpg";
import Img from "../../components/img";

// ✅ Import ảnh chứng chỉ
import Cert1 from "../../assets/gallery/images1.jpg";
import Cert2 from "../../assets/gallery/images2.jpg";
import Cert3 from "../../assets/gallery/images3.jpg";
import Cert4 from "../../assets/gallery/images4.jpg";

function About() {
  useEffect(() => {
    document.title = "WangYi - 📚";
  }, []);

  const [preview, setPreview] = useState(null);
  const [activeCert, setActiveCert] = useState(null);

  // ✅ Có cả tên chứng chỉ
  const certImages = [
    { src: Cert1, name: "Images 1" },
    { src: Cert2, name: "Images 2" },
    { src: Cert3, name: "Images 3" },
    { src: Cert4, name: "Images 4" },
  ];

  return (
    <div className="font-bold text-neutral-800 w-full pb-12">
      {/* ===== Title ===== */}
      <div className="mb-6 flex text-3xl gap-2 font-bold">
        <div className="bg-neutral-800 h-[36px] w-2"></div>
        <h2>关于 💤</h2>
      </div>

      {/* ===== Grid Layout ===== */}
      <div className="mt-4 font-semibold md:grid grid-cols-2 gap-x-10">
        {/* ==== Left Side ==== */}
        <div>
          <h3 className="mb-2 text-xl mt-6">
            <span>⬤</span> 我是如何学习编程的？ 🤔
          </h3>
          <p className="text-slate-800/90 text-pretty">
            一直对网站和游戏的运作方式充满好奇。从使用 HTML
            设计界面、CSS 样式、JavaScript 添加功能，到 2024
            年初学习 React，每一步都为深入了解互联网打开了一扇新的大门。
            好奇心和热情一直引领着我走在这条路上。我相信，只要有耐心和努力，在科技的世界里一切皆有可能！
          </p>

          <h3 className="mb-2 text-xl mt-6">
            <span>⬤</span> 这个网站是用来做什么的？ 🍜
          </h3>
          <Img
            className="drag-none size-40 sm:size-44 md:size-48 lg:size-60 float-right mb-1 ml-2 select-none rounded-md border-4 border-pink-600/50 bg-neutral-800"
            alt="img"
            src={ChillImg}
          />
          <p className="text-slate-800/90 text-pretty">
            本网站是一个个人页面，用于介绍我自己、我的成就以及我参与过的项目。
            我分享我的个人旅程、经验和专业技能。您可以了解我的背景、经验以及在特定领域的技能。
            此外，这也是我与社区建立联系、分享信息和观点的地方。希望您能更多地了解我，并有机会在未来合作。
          </p>
        </div>

        {/* ==== Right Side ==== */}
        <div>
          <div className="md:pl-12 lg:pl-20 flex flex-col gap-4">
            {/* Work */}
            <div className="p-4 rounded-lg border-[2px] bg-slate-100 border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex gap-3 items-center">
                <div className="text-slate-700">
                  <FontAwesomeIcon icon={faBriefcase} />
                </div>
                <p>工作</p>
              </div>
              <div className="flex mt-6 gap-3 items-center">
                <div className="size-10 rounded-full bg-slate-800 text-slate-100 text-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faEarthAsia} />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm">广阔的世界</h5>
                  <div className="flex justify-between text-xs text-slate-700">
                    <p>自由的</p>
                    <p>2025 - 至今</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="p-4 rounded-lg border-[2px] bg-slate-100 border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex gap-3 items-center">
                <div className="text-slate-700">
                  <FontAwesomeIcon icon={faUserGraduate} />
                </div>
                <p>教育</p>
              </div>
              <div className="flex mt-6 gap-3 items-center">
                <div className="size-10 rounded-full bg-slate-800 text-slate-100 text-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faSchool} />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm">SeiRei Student</h5>
                  <div className="flex justify-between text-xs text-slate-700">
                    <p>普通学生</p>
                    <p>201x - 202x</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <a
                  href="https://gdtxmoduc.quangngai.edu.vn/"
                  className="w-full py-2 flex text-sm hover:bg-slate-700 items-center gap-2 justify-center text-slate-100 bg-slate-800 rounded-lg transition"
                >
                  <FontAwesomeIcon icon={faFaceGrinBeamSweat} />
                  <span>学校网站</span>
                </a>
              </div>
            </div>

            {/* Certifications */}
            <div className="p-4 rounded-lg border-[2px] bg-slate-100 border-slate-200 shadow-sm hover:shadow-md transition">
              <p className="text-lg font-bold text-neutral-700 mb-4">
                Images /{" "}
                <span className="text-pink-600">{activeCert}</span>
              </p>
              <Swiper
                effect={"cards"}
                grabCursor={true}
                initialSlide={Math.floor(certImages.length / 2)}
                modules={[EffectCards]}
                className="max-w-[320px] md:max-w-[360px]"
                onSlideChange={(swiper) =>
                  setActiveCert(certImages[swiper.activeIndex].name)
                }
                onInit={(swiper) =>
                  setActiveCert(certImages[swiper.activeIndex].name)
                }
              >
                {certImages.map((cert, i) => (
                  <SwiperSlide
                    key={i}
                    className="rounded-lg cursor-pointer flex flex-col items-center justify-center bg-transparent"
                    onClick={() => setPreview(cert)}
                  >
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12 }}
                      src={cert.src}
                      alt={cert.name}
                      className="w-full h-[260px] object-cover object-center rounded-xl shadow-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Preview Modal with Animation ===== */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-4xl w-full p-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-3 right-3 text-white text-3xl hover:rotate-90 transition-transform"
                onClick={() => setPreview(null)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>

              <p className="text-lg font-bold text-white mb-4 text-center">
                Certifications /{" "}
                <span className="text-pink-400">{preview.name}</span>
              </p>

              <img
                src={preview.src}
                alt={preview.name}
                className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default About;
