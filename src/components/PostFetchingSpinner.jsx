const PostFetchingSpinner = () => {
  return (
    <div
      role="status"
      className="absolute inset-0 flex w-full h-full items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="50"
        height="50"
        style={{
          shapeRendering: "auto",
          display: "block",
          background: "rgb(255, 255, 255)",
        }}
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <g>
          <g transform="translate(77,50)">
            <g transform="rotate(0)">
              <circle fill-opacity="1" fill="#bebebe" r="8" cy="0" cx="0">
                <animateTransform
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  values="1.68 1.68;1 1"
                  begin="-0.875s"
                  type="scale"
                  attributeName="transform"
                ></animateTransform>
                <animate
                  begin="-0.875s"
                  values="1;0"
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  attributeName="fill-opacity"
                ></animate>
              </circle>
            </g>
          </g>
          <g transform="translate(69.09188309203678,69.09188309203678)">
            <g transform="rotate(45)">
              <circle fill-opacity="0.875" fill="#bebebe" r="8" cy="0" cx="0">
                <animateTransform
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  values="1.68 1.68;1 1"
                  begin="-0.75s"
                  type="scale"
                  attributeName="transform"
                ></animateTransform>
                <animate
                  begin="-0.75s"
                  values="1;0"
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  attributeName="fill-opacity"
                ></animate>
              </circle>
            </g>
          </g>
          <g transform="translate(50,77)">
            <g transform="rotate(90)">
              <circle fill-opacity="0.75" fill="#bebebe" r="8" cy="0" cx="0">
                <animateTransform
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  values="1.68 1.68;1 1"
                  begin="-0.625s"
                  type="scale"
                  attributeName="transform"
                ></animateTransform>
                <animate
                  begin="-0.625s"
                  values="1;0"
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  attributeName="fill-opacity"
                ></animate>
              </circle>
            </g>
          </g>
          <g transform="translate(30.90811690796322,69.09188309203678)">
            <g transform="rotate(135)">
              <circle fill-opacity="0.625" fill="#bebebe" r="8" cy="0" cx="0">
                <animateTransform
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  values="1.68 1.68;1 1"
                  begin="-0.5s"
                  type="scale"
                  attributeName="transform"
                ></animateTransform>
                <animate
                  begin="-0.5s"
                  values="1;0"
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  attributeName="fill-opacity"
                ></animate>
              </circle>
            </g>
          </g>
          <g transform="translate(23,50)">
            <g transform="rotate(180)">
              <circle fill-opacity="0.5" fill="#bebebe" r="8" cy="0" cx="0">
                <animateTransform
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  values="1.68 1.68;1 1"
                  begin="-0.375s"
                  type="scale"
                  attributeName="transform"
                ></animateTransform>
                <animate
                  begin="-0.375s"
                  values="1;0"
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  attributeName="fill-opacity"
                ></animate>
              </circle>
            </g>
          </g>
          <g transform="translate(30.908116907963212,30.90811690796322)">
            <g transform="rotate(225)">
              <circle fill-opacity="0.375" fill="#bebebe" r="8" cy="0" cx="0">
                <animateTransform
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  values="1.68 1.68;1 1"
                  begin="-0.25s"
                  type="scale"
                  attributeName="transform"
                ></animateTransform>
                <animate
                  begin="-0.25s"
                  values="1;0"
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  attributeName="fill-opacity"
                ></animate>
              </circle>
            </g>
          </g>
          <g transform="translate(49.99999999999999,23)">
            <g transform="rotate(270)">
              <circle fill-opacity="0.25" fill="#bebebe" r="8" cy="0" cx="0">
                <animateTransform
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  values="1.68 1.68;1 1"
                  begin="-0.125s"
                  type="scale"
                  attributeName="transform"
                ></animateTransform>
                <animate
                  begin="-0.125s"
                  values="1;0"
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  attributeName="fill-opacity"
                ></animate>
              </circle>
            </g>
          </g>
          <g transform="translate(69.09188309203678,30.908116907963212)">
            <g transform="rotate(315)">
              <circle fill-opacity="0.125" fill="#bebebe" r="8" cy="0" cx="0">
                <animateTransform
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  values="1.68 1.68;1 1"
                  begin="0s"
                  type="scale"
                  attributeName="transform"
                ></animateTransform>
                <animate
                  begin="0s"
                  values="1;0"
                  repeatCount="indefinite"
                  dur="1s"
                  keyTimes="0;1"
                  attributeName="fill-opacity"
                ></animate>
              </circle>
            </g>
          </g>
          <g></g>
        </g>
      </svg>
    </div>
  );
};
export default PostFetchingSpinner;
