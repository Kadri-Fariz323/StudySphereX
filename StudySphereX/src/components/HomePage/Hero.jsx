import { Link } from "react-router-dom";
import landingBg from "../../assets/landingBG.jpeg";

export const Hero = () => {
  return (
    <div className="hero flex-col items-center justify-center text-4xl py-24 px-8 bg-linear-to-b from-indigo-200 to-white lg:flex lg:gap-20 lg:flex-row  text-center lg:px-20 lg:py-20 lg:text-left rounded-3xl ">
      <div id="content-left" className="lg:w-125">
        <h1
          className="text-5xl lg:text-6xl leading-12.5 lg:leading-17.5 font-bold 
bg-linear-to-b from-blue-300 via-blue-500 to-blue-700 
bg-clip-text text-transparent 
drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] pb-2"
        >
          Learn Smarter. Stay Consistent. Build Real Skills.
        </h1>

        <p className="text-sm  my-7 md:text-lg lg:text-lg md:my-5 ">
          Empowering learners worldwide with accessible, high-quality education
          and industry-recognized certifications
        </p>
        <div className="relative group  ">
          <Link to="/auth">
            <button className="relative inline-block p-px text-sm font-bold leading-6 text-white bg-blue-500 shadow-2xl cursor-pointer rounded-xl shadow-cyan-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <span className="absolute inset-0 rounded-xl bg-linear-to-r from-teal-400 via-blue-500 to-purple-500 p-0.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

              <span className="relative z-10 block px-6 py-3 rounded-xl ">
                <div className="relative z-10 flex items-center space-x-2">
                  <span className="transition-all duration-500 group-hover:translate-x-1">
                    Let's get started
                  </span>
                  <svg
                    className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                    data-slot="icon"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"></path>
                  </svg>
                </div>
              </span>
            </button>
          </Link>
        </div>
      </div>

      <div className="content-right mt-14 flex justify-center items-center">
        <img
          src={landingBg}
          className="w-87.5 shadow-xl md:w-150 lg:w-137.5"
          alt=" illustration"
        />
      </div>
    </div>
  );
};
