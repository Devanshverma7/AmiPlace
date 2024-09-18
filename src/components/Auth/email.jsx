import React from "react";
import Lottie from "lottie-react";
import signupAnimation from "../../animations/animation-2.json";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { useEffect } from "react";

const EmailVerify = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  useEffect(() => {
    handleLogout(); // Call handleLogout on every render
  }, []);
  return (
    <>
      <div className="   h-screen w-screen flex justify-center items-center p-3 overflow-hidden ">
        <div className=" h-10/12 w-auto grid grid-cols-2 rounded-xl ">
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h1 className="mt-10 mb-10 text-center text-5xl font-bold leading-9 py-5 tracking-tight text-gray-900">
                Whoo Whoo!
              </h1>
              <p className="mt-10 mb-10 text-center text-3xl font-bold leading-9 py-5 tracking-tight text-black outline-4">
                For Login Please Verify Your Account First! We have
                sent you an email with a link to verify your account. Please
                click on the link to verify your account.
              </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="space-y-6" action="#" method="POST">
                <div>
                  <Link to={"/Login"}>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Login
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="  m-6  ">
            <Lottie
              className=" w-full h-full rounded-xl"
              animationData={signupAnimation}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerify;