import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

function MobilePropertyItemView(props) {
  const { direction, offset, show, children } = props;
  const wrapperRef = useRef(null);
  const [isOutClicked, setIsOutClicked] = useState(false)
  
  useOutsideAlerter(wrapperRef);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // alert("You clicked outside of me!");
          // setIsOutClicked(true)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  // console.log({ state })

  if (!show) return <></>
  return (
    <div
      ref={wrapperRef}
      className="position-absolute"
      style={{
        [direction]: 0,
        bottom: offset,
        // width: "50vw",
        // height: "30vh",
        backgroundColor: "#282828",
        border: "1px solid #5a5a5a",
        zIndex: 3,
      }}
    >
      {children}
    </div>
  );
}

MobilePropertyItemView.propTypes = {
  offset: PropTypes.number,
  show: PropTypes.bool,
  direction: PropTypes.oneOf(["left", "right"]),
};

MobilePropertyItemView.defaultProps = {
  offset: 80,
  show: false,
  direction: "left",
};

export default MobilePropertyItemView;
