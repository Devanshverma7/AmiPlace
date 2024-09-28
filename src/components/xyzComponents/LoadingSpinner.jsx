import React from "react";
import Lottie from "react-lottie";
import animationData from "../../animations/loadinganimation.json";

const LoadingSpinner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default LoadingSpinner;
