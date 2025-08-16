import { useEffect } from "react";
import GithubProjects from "../../api/githubApi";

function Projects() {
  useEffect(() => {
    document.title = "🗂 - WangYi";
  }, []);

  return (
    <div className='font-bold text-neutral-800 w-full pb-4'>
      <div className='mb-3 flex text-3xl gap-2 font-bold'>
        <div className='bg-neutral-800 h-[36px] w-2'></div>
        <h2>项目 🕓</h2>
      </div>
      <p>因为我爱你 💾, 虽然不好但是... </p>
      <div className='md:grid w-full mt-6 flex flex-col lg:grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1'>
        <GithubProjects />
      </div>
    </div>
  );
}

export default Projects;
