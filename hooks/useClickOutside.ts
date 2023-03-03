import { useEffect, useRef } from "react";

export const useClickOutside = (ref: any, closeContextMenu: Function) => {
  const handleClick = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      closeContextMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });
};
