import React from "react";

export function useGeometry(ele: HTMLElement): [{x: number, y: number}, (param: {x : number, y: number }) => void] {
  const postion = React.useRef<{ x: number, y: number}>({ x: 0, y: 0});
  const setPosition = ({ x, y }: {x :number, y:number}) => {
    postion.current = { x, y };
  }
  React.useEffect(() => {
    if (ele) {
      const { top, left } = ele.getBoundingClientRect();
      setPosition({ x: left, y: top });
    }
  }, [ele]);

  return [postion.current, setPosition];
} 
