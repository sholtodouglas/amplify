/**
 * NOTE: All x and y are referenced from the top left corner of the element
 * which this holds rectangle. It is assumed that the image is contained within
 * the same element.
 */

import React, { useRef, useEffect, useCallback } from "react";
import { twoPointsToPosition } from "../utilities/imageLabeller";

export function Rectangle({
  id,
  position,
  selected,
  dispatch,
  imgRef,
  labels,
  initialResizingMouseEvent,
  labellerFormRef,
}) {
  // Ref for the rectangle
  const rectangleRef = useRef(null);

  // Refs for the resizers
  const resizerTopLeftRef = useRef(null);
  const resizerTopRightRef = useRef(null);
  const resizerBottomLeftRef = useRef(null);
  const resizerBottomRightRef = useRef(null);

  const resizerRefs = [
    resizerTopLeftRef,
    resizerTopRightRef,
    resizerBottomLeftRef,
    resizerBottomRightRef,
  ];
  const allRefs = [rectangleRef, ...resizerRefs];

  const positionRef = useRef(null);
  positionRef.current = position;

  const selectedRef = useRef(null);
  selectedRef.current = selected;

  /**
   * Attaches mouse events to the window which allow this rectangle to resize.
   */
  const startResizing = useCallback((mouseEvent) => {
    const isResizerTarget = resizerRefs.find(
      (ref) => ref.current === mouseEvent.target
    );

    // Get the initial free point and anchor point that define the rectangle,
    // when there is no mouse down event given, assume that the clicked
    // resizer is the bottom right
    const resizer = isResizerTarget
      ? mouseEvent.target
      : resizerBottomRightRef.current;
    const { initialFreePoint, anchorPoint } =
      getDiagonalPointsFromResizer(resizer);

    // Get the reference x, y point that will be used to calculate the mouse
    // deltas from. When there is no mouse event given, use the top left point
    const { pageX: x, pageY: y } = mouseEvent;

    const imgDimensions = imgRef.current.getBoundingClientRect();
    const imgWidth = imgDimensions.width;
    const imgHeight = imgDimensions.height;

    const initialMouseX = (x / imgWidth) * 100;
    const initialMouseY = (y / imgHeight) * 100;

    // Resize handler on mouse move
    const resize = (e) => {
      // Get the change in mouse point
      const currentMouseX = (e.x / imgWidth) * 100;
      const currentMouseY = (e.y / imgHeight) * 100;
      const deltaMouseX = currentMouseX - initialMouseX;
      const deltaMouseY = currentMouseY - initialMouseY;

      // Calculate the new point of the clicked resizer
      const newFreePoint = {
        x: initialFreePoint.x + deltaMouseX,
        y: initialFreePoint.y + deltaMouseY,
      };

      // Calculate the rectangle position from the free and anchor points
      const newRectanglePosition = twoPointsToPosition(
        newFreePoint,
        anchorPoint
      );

      // Set the new rectangle state
      dispatch({
        type: "update",
        payload: {
          id,
          position: newRectanglePosition,
        },
      });
    };

    window.addEventListener("mousemove", resize);

    // When the mouse is released, stop listening for mouse movement
    const stopResizing = () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);

      if (positionRef.current.width < 2 && positionRef.current.height < 2) {
        dispatch({
          type: "delete",
          payload: { id },
        });
      } else {
        dispatch({
          type: "update",
          payload: { id, selected: true },
        });
      }
    };
    window.addEventListener("mouseup", stopResizing);
  }, []);

  /**
   * Given a reiszer element, two corner points of the rectangle are returned.
   * These points are expressed as percentages of the image's width and height
   * The two aforementioned points are:
   *  - The corner point corresponding to the clicked resizer
   *  - The corner point diagonal to the clicked resizer
   */
  const getDiagonalPointsFromResizer = useCallback(
    (resizer) => {
      const { offsetLeft, offsetTop, offsetHeight, offsetWidth } =
        rectangleRef.current;

      const imgWidth = imgRef.current.offsetWidth;
      const imgHeight = imgRef.current.offsetHeight;

      const topLeftPoint = {
        x: (offsetLeft / imgWidth) * 100,
        y: (offsetTop / imgHeight) * 100,
      };

      const topRightPoint = {
        x: ((offsetLeft + offsetWidth) / imgWidth) * 100,
        y: (offsetTop / imgHeight) * 100,
      };

      const bottomLeftPoint = {
        x: (offsetLeft / imgWidth) * 100,
        y: ((offsetTop + offsetHeight) / imgHeight) * 100,
      };

      const bottomRightPoint = {
        x: ((offsetLeft + offsetWidth) / imgWidth) * 100,
        y: ((offsetTop + offsetHeight) / imgHeight) * 100,
      };

      switch (resizer) {
        case resizerTopLeftRef.current:
          return {
            initialFreePoint: topLeftPoint,
            anchorPoint: bottomRightPoint,
          };
        case resizerTopRightRef.current:
          return {
            initialFreePoint: topRightPoint,
            anchorPoint: bottomLeftPoint,
          };
        case resizerBottomLeftRef.current:
          return {
            initialFreePoint: bottomLeftPoint,
            anchorPoint: topRightPoint,
          };
        case resizerBottomRightRef.current:
          return {
            initialFreePoint: bottomRightPoint,
            anchorPoint: topLeftPoint,
          };
        default:
          throw "Given element is not a resizer";
      }
    },
    [imgRef]
  );

  const handleRectangleMouseDown = useCallback(
    (e) => {
      e.preventDefault();

      // Select this rectangle
      dispatch({ type: "update", payload: { id: id, selected: true } });

      const imgDimensions = imgRef.current.getBoundingClientRect();

      const width = positionRef.current.width;
      const height = positionRef.current.height;

      // Get the initial x and y
      const initialX = positionRef.current.x;
      const initialY = positionRef.current.y;

      // Get initial mouse point
      const { pageX: initialMouseX, pageY: initialMouseY } = e;

      // Handle the resize given a mouse event
      const move = (e) => {
        // Get the change in mouse point
        const { x: currentMouseX, y: currentMouseY } = e;
        const deltaMouseX =
          ((currentMouseX - initialMouseX) / imgDimensions.width) * 100;
        const deltaMouseY =
          ((currentMouseY - initialMouseY) / imgDimensions.height) * 100;

        const x = Math.min(Math.max(initialX + deltaMouseX, 0), 100 - width);
        const y = Math.min(Math.max(initialY + deltaMouseY, 0), 100 - height);

        dispatch({
          type: "update",
          payload: { id, position: { x, y, width, height } },
        });
      };

      window.addEventListener("mousemove", move);

      // When the mouse is released, stop listening for mouse movement
      const stopResizing = () => {
        dispatch({ type: "update", payload: { id, resizing: false } });

        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", stopResizing);
      };
      window.addEventListener("mouseup", stopResizing);
    },
    [dispatch, id, imgRef]
  );

  // Handler to start resizing on mouse down of a resizer
  const handleResizerMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch({
        type: "update",
        payload: {
          id,
          initialResizingMouseEvent: e,
        },
      });
    },
    [dispatch, id]
  );

  // Start resizing according to the rectangle state
  useEffect(() => {
    if (initialResizingMouseEvent) {
      startResizing(initialResizingMouseEvent);
      dispatch({
        type: "update",
        payload: {
          id,
          initialResizingMouseEvent: null,
        },
      });
    }
  }, [initialResizingMouseEvent]);

  useEffect(() => {
    const handleDeselect = (e) => {
      // Don't try to deselect when clicking on the labelling form
      if (e.composedPath().includes(labellerFormRef.current)) return;
      // Checks if the rectangle or resizers were clicked
      const rectangleClicked = allRefs.find((ref) => ref.current === e.target);
      if (!rectangleClicked) {
        dispatch({ type: "update", payload: { id, selected: false } });
      }
    };

    const handleDelete = (e) => {
      if (!selectedRef.current) return;
      // Prevents delete if we're typing in the form
      if (e.composedPath().includes(labellerFormRef.current)) return;
      if (e.key === "Backspace" || e.key === "Delete") {
        dispatch({ type: "delete", payload: { id } });
      }
    };

    window.addEventListener("keydown", handleDelete);
    window.addEventListener("mousedown", handleDeselect);
    return () => {
      window.removeEventListener("mousedown", handleDeselect);
      window.addEventListener("keydown", handleDelete);
    };
  }, [dispatch, id]);

  return (
    <div
      key={`${id}-div`}
      className={`labeller-rectangle ${
        Object.keys(labels).length > 0 ? "labelled" : ""
      }`}
      ref={rectangleRef}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.width}%`,
        height: `${position.height}%`,
      }}
      onMouseDown={handleRectangleMouseDown}
    >
      <div
        key={`${id}-resizer-top-left`}
        className="resizer top-left-resizer"
        ref={resizerTopLeftRef}
        style={{ display: selected ? "block" : "none" }}
        onMouseDown={handleResizerMouseDown}
      ></div>
      <div
        key={`${id}-resizer-top-right`}
        className="resizer top-right-resizer"
        ref={resizerTopRightRef}
        style={{ display: selected ? "block" : "none" }}
        onMouseDown={handleResizerMouseDown}
      ></div>
      <div
        key={`${id}-resizer-bottom-left`}
        className="resizer bottom-left-resizer"
        ref={resizerBottomLeftRef}
        style={{ display: selected ? "block" : "none" }}
        onMouseDown={handleResizerMouseDown}
      ></div>
      <div
        key={`${id}-resizer-bottom-right`}
        className="resizer bottom-right-resizer"
        ref={resizerBottomRightRef}
        style={{ display: selected ? "block" : "none" }}
        onMouseDown={handleResizerMouseDown}
      ></div>
    </div>
  );
}
