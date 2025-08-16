import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as brandStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import Img from "../../components/img";
import htmlIcon from "../../assets/icons/html.svg";
import cssIcon from "../../assets/icons/css.svg";
import javascriptIcon from "../../assets/icons/javascript.svg";
import nodejsIcon from "../../assets/icons/nodejs-dark.svg";
import vscodeIcon from "../../assets/icons/vscode.svg";
import githubIcon from "../../assets/icons/github.svg";
import notepadppIcon from "../../assets/icons/notepadplusplus.svg";
import tailwindIcon from "../../assets/icons/tailwind.svg";
import reactIcon from "../../assets/icons/react.svg";
import typescriptIcon from "../../assets/icons/typescript.svg";
import pythonIcon from "../../assets/icons/python.svg";

class Skill {
  constructor(name, content, img, skillLevel) {
    this.name = name;
    this.content = content;
    this.img = img;
    this.skillLevel = skillLevel;
  }

  render() {
    return (
      <div className='p-2 my-1 bg-slate-100 rounded-xl flex gap-4 items-center'>
        <div className='size-14 min-w-14 rounded-xl overflow-hidden'>
          <Img className='size-full' src={this.img} alt={this.name} />
        </div>
        <div className='w-full group hover:*:whitespace-normal overflow-hidden'>
          <p className='truncate transition-all'>{this.content}</p>
          <p className='group-hover:hidden text-sm'>
            {this.skillLevel.map((level, index) => (
              <FontAwesomeIcon key={index} icon={level} />
            ))}
          </p>
        </div>
      </div>
    );
  }
}

function Skills() {
  useEffect(() => {
    document.title = "📚 - WangYi";
  }, []);

  const [openCategory, setOpenCategory] = useState(0);

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  const skillList = [
    new Skill("HTML", "HTML: (超文本标记语言) 是构建块 🧱 网站如何, 使用标签定义结构和内容.", htmlIcon, [
      brandStar,
      brandStar,
      brandStar,
      regularStar,
      regularStar,
    ]),
    new Skill("CSS", "CSS: (Cascading Style Sheets) 布局和演示的样式语言 HTML, 帮助开发人员设计具有视觉吸引力的网站 🎨.", cssIcon, [
      brandStar,
      brandStar,
      brandStar,
      regularStar,
      regularStar,
    ]),
    // eslint-disable-next-line
    new Skill("JavaScript", "JavaScript: 灵活的语言创造互动性 ✨ 和动态的 🥏 对于网站, 提供引人入胜的用户体验.", javascriptIcon, [
      brandStar,
      regularStar,
      regularStar,
      regularStar,
      regularStar,
    ]),
    new Skill("TypeScript", "TypeScript: 强大的编程语言建立在, 为您提供各种规模的更佳工具", typescriptIcon, [
      brandStar,
      regularStar,
      regularStar,
      regularStar,
      regularStar,
    ]),
    new Skill("Python", "Python:  该语言形式非常清晰，结构明确，方便初学者学习编程，是一种容易学习的编程语言。", pythonIcon, [
      brandStar,
      regularStar,
      regularStar,
      regularStar,
      regularStar,
    ]),
    new Skill("Tailwind CSS", "Tailwind CSS: Framework CSS Widget-first 允许开发人员快速构建用户界面，而无需离开 HTML。", tailwindIcon, [
      brandStar,
      brandStar,
      brandStar,
      regularStar,
      regularStar,
    ]),
    new Skill("ReactJS", "ReactJS: 原生和 Web 用户界面库。使用以下语言编写的组件来构建用户界面： JavaScript.", reactIcon, [
      brandStar,
      regularStar,
      regularStar,
      regularStar,
      regularStar,
    ]),
    new Skill("Node.js", "Node.js: 服务器端 JavaScript 运行时环境🖥，用于创建可扩展且高效的 Web 应用程序。", nodejsIcon, [brandStar, regularStar, regularStar, regularStar, regularStar]),
    new Skill(
      "Visual Studio Code",
      "Visual Studio Code: 微软开发的免费开源工具✨。它为多种编程语言提供了丰富的功能和扩展。",
      vscodeIcon,
      [brandStar, brandStar, brandStar, brandStar, regularStar]
    ),
    new Skill("GitHub", "GitHub: 该平台提供协作和版本控制工具，允许开发人员存储👩‍💻、审查和管理软件项目的代码存储库。", githubIcon, [
      brandStar,
      brandStar,
      regularStar,
      regularStar,
      regularStar,
    ]),
    new Skill("Notepad++", "Notepad++: 一款适用于 Windows 的免费开源文本编辑器📝。它是一款轻量级且功能丰富的工具。", notepadppIcon, [
      brandStar,
      brandStar,
      brandStar,
      brandStar,
      brandStar,
    ]),
  ];

  const categories = [
    {
      name: "语言",
      contents: skillList.slice(0, 5),
    },
    {
      name: "Frameworks & Styling",
      contents: skillList.slice(5, 7),
    },
    {
      name: "开发工具",
      contents: skillList.slice(7, 11),
    },
  ];

  return (
    <div className='font-bold text-neutral-800 w-full pb-4'>
      <div className='mb-3 flex text-3xl gap-2 font-bold'>
        <div className='bg-neutral-800 h-[36px] w-2'></div>
        <h2>技能 🔍</h2>
      </div>
      <p>我用来建造东西的技能和技术. 😊</p>
      <div className='mt-6'>
        {categories.map((category, index) => (
          <div className='border-b-slate-600/40 border-b-[1px] cursor-pointer' key={index}>
            <div onClick={() => toggleCategory(index)}>
              <div className='pt-6 pb-4'>
                <h2 className='text-lg'>
                  {category.name} {openCategory === index ? <span className='text-cyan-600'>-</span> : "+"}
                </h2>
              </div>
              {openCategory === index && (
                <div>
                  {category.contents.map((skill, idx) => (
                    <div key={idx}>{skill.render()}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;
