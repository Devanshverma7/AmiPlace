import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
const PopUpModal = () => {
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPopUp(true);
    }, 1000);
  }, []);
  return (
    <div
      className={`pop-up ${
        popUp ? "fixed" : "hidden"
      } flex top-[25%] right-1 md:top-[20%] border-2 border-yellow-300 bg-yellow-100  w-fit p-3`}
    >
      <span className="text-yellow-600" id="popup">
        Create your profile first! without that you cannot interact, click on user icon it will navigate you to profile.
      </span>
      <RxCross2 className="mt-1 ml-2 text-4xl opacity-65 md:text-lg" onClick={() => setPopUp(false)} />
    </div>
  );
};
export default PopUpModal;
