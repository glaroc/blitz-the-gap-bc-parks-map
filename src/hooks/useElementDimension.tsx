import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

export const useBbox = () => {
  const ref = useRef<any>();
  const [bbox, setBbox] = useState<any>({});

  const set = () => {
    let bBox = { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 };
    if (ref && ref.current) {
      bBox = ref.current.getBoundingClientRect();
    }
    setBbox(bBox);
  };

  useEffect(() => {
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  useEffect(() => {
    set();
  }, [ref.current]);

  return [bbox, ref];
};
