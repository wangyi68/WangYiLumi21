import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./readme.scss";

const ProjectDetails = () => {
  const { projectName } = useParams();
  const [project, setProject] = useState(null);
  const [readme, setReadme] = useState(null);
  const [error, setError] = useState(null);
  const [languages, setLanguages] = useState(null);
  const userGithub = "wangyi68";

  // 📝 thử lấy README từ main → master
  const fetchReadme = useCallback(async () => {
    const branches = ["main", "master"];
    for (let branch of branches) {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${userGithub}/${projectName}/${branch}/README.md`
        );
        if (response.ok) {
          const data = await response.text();
          setReadme(<ReactMarkdown>{data}</ReactMarkdown>);
          return;
        }
      } catch (err) {
        // thử branch khác
      }
    }
    setReadme(<p className="text-slate-600 italic">❌ 该仓库没有 README.md</p>);
  }, [projectName]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${userGithub}/${projectName}`
        );
        if (!response.ok) throw new Error("未找到回购协议");
        const data = await response.json();
        setProject(data);
        await fetchReadme();
      } catch (err) {
        setError(err);
      }
    };

    fetchProjectDetails();
  }, [projectName, fetchReadme]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${userGithub}/${projectName}/languages`
        );
        if (!response.ok) throw new Error("无法获取语言");
        const data = await response.json();
        setLanguages(data);
      } catch (err) {
        setError(err);
      }
    };

    fetchLanguages();
  }, [projectName]);

  let totalLines = 0;
  if (languages) {
    totalLines = Object.values(languages).reduce((acc, cur) => acc + cur, 0);
  }

  useEffect(() => {
    document.title = `📂/${projectName} Ι WangYi`;
  }, [projectName]);

  return (
    <div className="w-full font-bold text-slate-900">
      <h2 className="text-2xl mb-1">{projectName}</h2>
      {error ? (
        <p className="text-red-600">错误: {error.message || String(error)}</p>
      ) : project ? (
        <div>
          <p>描述: {project.description || "无可用描述"}</p>

          {/* 📊 Stats cơ bản */}
          <div className="flex gap-6 mt-2 text-sm text-slate-700">
            <span>⭐ 星星: {project.stargazers_count}</span>
            <span>🍴 叉子: {project.forks_count}</span>
            <span>👀 观察者: {project.watchers_count}</span>
            <span>🐞 问题: {project.open_issues_count}</span>
          </div>

          {/* 🖌 Ngôn ngữ */}
          {languages ? (
            <div>
              <h3 className="mt-4">语言:</h3>
              <div className="w-full flex mt-1 rounded-full overflow-hidden">
                {Object.keys(languages).map((language, index) => (
                  <div
                    key={index}
                    className={`${getLanguageColor(language)} h-4`}
                    style={{
                      width: `${(languages[language] / totalLines) * 100}%`,
                    }}
                  ></div>
                ))}
              </div>
              <div className="flex gap-x-8 mt-2 flex-wrap">
                {Object.keys(languages).map((language, index) => (
                  <div key={index} className="text-sm">
                    {language}{" "}
                    <span className="text-slate-600">
                      ({((languages[language] / totalLines) * 100).toFixed(2)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full rounded-xl bg-slate-300 animate-pulse h-12 mt-2"></div>
          )}

          {/* 📄 README hoặc fallback */}
          <div className="mt-6 rounded-xl bg-slate-100 w-full">
            <h3 className="ml-2 pt-2">📄 README.md</h3>
            <div className="p-6 readme">{readme}</div>
          </div>
        </div>
      ) : (
        <div className="w-56 rounded-full bg-slate-300 animate-pulse h-4 mt-2"></div>
      )}
    </div>
  );
};

export default ProjectDetails;

const getLanguageColor = (language) => {
  switch (language.toLowerCase()) {
    case "javascript":
      return "bg-[#F1E05A]";
    case "html":
      return "bg-[#E34C26]";
    case "css":
      return "bg-[#563D7B]";
    case "scss":
      return "bg-[#C6538C]";
    case "python":
      return "bg-[#3472A5]";
    case "c++":
      return "bg-[#F34B7D]";
    case "typescript":
      return "bg-[#3078C6]";
    case "pug":
      return "bg-[#A86454]";
    case "java":
      return "bg-[#B07219]";
    case "objective-c":
      return "bg-[#448DFB]";
    case "objective-c++":
      return "bg-[#6866FA]";
    case "kotlin":
      return "bg-[#AA7AFA]";
    case "ruby":
      return "bg-[#701516]";
    case "cmake":
      return "bg-[#DA3434]";
    case "c":
      return "bg-[#13171D]";
    case "c#":
      return "bg-[#16861F]";
    case "php":
      return "bg-[#4F5D95]";
    case "shell":
      return "bg-[#8AE053]";
    default:
      return "bg-gray-300";
  }
};
