"use client";
import { useEffect, useRef, useState } from "react";

const ScrollCircleProgress: React.FC = () => {
  const progressRef = useRef<SVGCircleElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const progressPath = progressRef.current;
    if (!progressPath) return;

    const pathLength = progressPath.getTotalLength();

    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = `${pathLength}`;

    const updateProgress = () => {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength) / height;
      progressPath.style.strokeDashoffset = `${progress}`;

      setIsVisible(scroll > 50);
    };

    updateProgress(); // Initialize on mount

    window.addEventListener("scroll", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    return (
        <>

            <div
                className={`progress-wrap ${isVisible ? "active-progress" : ""}`}
                onClick={scrollToTop}
            >
                <svg
                    className="progress-circle svg-content"
                    width="100%"
                    height="100%"
                    viewBox="-1 -1 102 102"
                >
                    <path
                        ref={progressRef}
                        d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
                    />
                </svg>

                <svg className="arrow" width="22" height="25" viewBox="0 0 24 23" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.556131 11.4439L11.8139 0.186067L13.9214 2.29352L13.9422 20.6852L9.70638 20.7061L9.76793 8.22168L3.6064 14.4941L0.556131 11.4439Z"></path>
            <path d="M23.1276 11.4999L16.0288 4.40105L15.9991 10.4203L20.1031 14.5243L23.1276 11.4999Z"></path>
        </svg>
            </div>

        </>
    );
};

export default ScrollCircleProgress;
