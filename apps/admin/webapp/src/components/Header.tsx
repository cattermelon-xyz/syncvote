import Icon from "../assets/Icon.svg";
import Lottie from "lottie-react";
import animationData from "../assets/trimmed-Healthanimation.json";


function Header() {
  const date = new Date();
  const currentHour = date.getHours();
  let greeting;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };

  if (currentHour < 12) {
    greeting = "GM! It's time to take a look at Syncvote's latest performance.";
  } else if (currentHour < 18) {
    greeting =
      "Gud Afternoon, It's time to take a look at Syncvote's latest performance.";
  } else {
    greeting =
      "Good Evening, It's time to take a look at Syncvote's latest performance.";
  }

  return (
    <div>
      <div className="flex items-center px-4 pb-1 mt-6">
        <Lottie
          animationData={animationData}
          loop={true}
          style = {{
          height: 32,
          width: 32,
        }}
          className="lottie-hero mr-3"
        />
        <p className=" text-white text-3xl font-medium">Welcome back!</p>
      </div>
      <p className="text-gray-300 text-md px-5 pt-3 pb-10">{greeting}</p>
    </div>
  );
}

export default Header;
