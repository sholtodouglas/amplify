import React, { useRef, useEffect } from "react";

export const LabellerCanvas = ({ src, alt }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = src;
    image.onload = () => {
      context.imageSmoothingEnabled = false;
    };
  }, [src]);

  return <canvas ref={canvasRef} />;
};
