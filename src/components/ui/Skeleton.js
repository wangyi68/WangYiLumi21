import { cn } from "../lib/utils";
import React, { useState, useEffect } from "react";

function Skeleton({ src, className, ...props }) {
  const [ratio, setRatio] = useState(56.25); // default 16:9

  useEffect(() => {
    if (!src) return;
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setRatio((img.height / img.width) * 100);
    };
    
    img.onerror = () => {
      setRatio(56.25); // Fallback to default ratio if image fails to load
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[hsla(240,54%,90%,1)] relative overflow-hidden w-full",
        className
      )}
      style={{ paddingTop: `${ratio}%` }}
      {...props}
    />
  );
}

export { Skeleton };
