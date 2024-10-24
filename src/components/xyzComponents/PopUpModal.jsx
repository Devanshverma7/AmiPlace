import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const PopUpModal = ({ popUpMessage, position, intensity }) => {
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPopUp(true);
    }, 1000);
  }, []);

  return (
    <div
      className={`pop-up fixed transition-all duration-300 ease-in-out ${
        popUp ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      } ${position} right-1 md:${position} border-2 ${intensity} w-[70%] md:w-[38%] p-3`}
    >
      {popUpMessage}
      <RxCross2
        className="absolute top-0 right-0 mt-1 ml-2 text-2xl opacity-45 cursor-pointer"
        onClick={() => setPopUp(false)}
      />
    </div>
  );
};

export default PopUpModal;
