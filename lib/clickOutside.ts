import { useEffect } from "react";

const useClickOutside = (ref: any, cb: () => void) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target) && !event.defaultPrevented) {
        cb()
      }
    }
    // Bind the event listener
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, [ref]);
}

export {useClickOutside}