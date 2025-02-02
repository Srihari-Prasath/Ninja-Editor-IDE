import React, { useEffect, useState } from "react";
import "./Intro.css";

const Intro = ({ onIntroComplete }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger the animation after a short delay
    const timer = setTimeout(() => setAnimate(true), 500);

    // Automatically move to the next screen after the animation completes
    const introTimer = setTimeout(() => {
      onIntroComplete();
    }, 3000); // Adjust the time based on your animation duration

    return () => {
      clearTimeout(timer);
      clearTimeout(introTimer);
    };
  }, [onIntroComplete]);

  return (
    <div className={`intro-container ${animate ? "animate" : ""}`}>
      <h1 className="intro-text">AI-Assisted Real-Time Code Editor</h1>
      
    </div>
  );
};

export default Intro;