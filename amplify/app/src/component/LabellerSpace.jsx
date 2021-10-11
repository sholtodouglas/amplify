import React, {
  useReducer,
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import { getId } from "../utilities/id";
import { Rectangle } from "./Rectangle";
import { LabellerForm } from "./LabellerForm";

function rectanglesReducer(state, action) {
  // console.log(action);
  const { type, payload } = action;

  switch (type) {
    case "create":
      const newRectangle = {
        id: payload.id,
        position: payload.position,
        selected: false,
        initialResizingMouseEvent: payload.initialResizingMouseEvent,
        labels: payload.labels || {},
      };
      return [...state, newRectangle];
    case "update":
      return state.map((rectangle) => {
        if (rectangle.id === payload.id) {
          if (payload.position !== null) {
            rectangle.position = { ...rectangle.position, ...payload.position };
          }
          if (payload.selected !== undefined) {
            rectangle.selected = payload.selected;
          }
          if (payload.initialResizingMouseEvent !== undefined) {
            rectangle.initialResizingMouseEvent =
              payload.initialResizingMouseEvent;
          }
          if (payload.labels !== null) {
            rectangle.labels = { ...rectangle.labels, ...payload.labels };
          }
        }
        return rectangle;
      });
    case "delete":
      return state.filter((rectangle) => rectangle.id !== payload.id);
    case "deleteAll":
      return []
    default:
      throw new Error(`rectanglesReducer: Invalid action of ${action}`);
  }
}

export function LabellerSpace({ src, alt, schema, update_fn, appDispatch, taskPubKey, wallet}) {
  const imgRef = useRef(null);
  const labellerFormRef = useRef(null);

  const [rectangles, dispatch] = useReducer(rectanglesReducer, []);
  const [imageAspectRatio, setImageAspectRatio] = useState(16 / 9);
  console.log(src, 'src')
  const handleImageOnLoad = (e) => {
    const element = e.target;
    const aspectRatio = element.naturalWidth / element.naturalHeight;
    setImageAspectRatio(aspectRatio);
  };

  // Make a new rectangle when the image is clicked on
  const handleImgMouseDown = useCallback((e) => {
    e.preventDefault();

    // Get the image dimensions
    const imgDimensions = imgRef.current.getBoundingClientRect();
    const imgWidth = imgDimensions.width;
    const imgHeight = imgDimensions.height;
    const imgLeft = imgDimensions.left;
    const imgTop = imgDimensions.top;

    // Get initial mouse point
    const initialX = ((e.pageX - imgLeft) / imgWidth) * 100;
    const initialY = ((e.pageY - imgTop) / imgHeight) * 100;

    const newRectangleId = getId(8);

    // Use the initial mouse point to make a new rectangle
    dispatch({
      type: "create",
      payload: {
        id: newRectangleId,
        position: {
          x: initialX,
          y: initialY,
          width: 0,
          height: 0,
        },
        initialResizingMouseEvent: e,
        labels: {},
      },
    });
  }, []);

  useEffect(() => {
    window.test = dispatch;
  }, []);

  const getLabellerForm = () => {
    // Get all the selected rectangles
    const selectedRectangles = rectangles.filter((r) => r.selected);

    let displayForm = false;
    let selectedRectangle = null;

    // When there is exactly one rectangle set, show the labeller form
    if (selectedRectangles.length === 1) {
      displayForm = true;
      selectedRectangle = selectedRectangles[0];
    }
    return (
      <LabellerForm
        forwardRef={labellerFormRef}
        rectangle={selectedRectangle}
        dispatch={dispatch}
        schema={schema}
        displayForm={displayForm}
      />
    );
  };

  const finishLabelling = () => {
    const labels = rectangles.map((rect) => rect.labels);

    // Checks if there are any labels
    if (labels.length === 0) {
      alert("No labels yet");
      return;
    }
    // Checks for any incomplete labels
    const incompleteLabels = labels.filter(
      (label) => Object.keys(label).length === 0
    );
    if (incompleteLabels.length !== 0) {
      alert("Some labels are incomplete");
      return;
    }

    const data = rectangles.map(rect => {
      const filteredRect = {}
      filteredRect.position = rect.position
      filteredRect.labels = rect.labels
      return filteredRect
    })
    update_fn({type:"next", payload: {'wallet': wallet, 'id': taskPubKey, 'data': data}})
    // appDispatch({type:"next", payload: {'wallet': wallet, 'id': taskPubKey, 'data': data}})
    dispatch({type:"deleteAll"})
  };

  return (
    <>
      <div className="labeller-container">
        <div
          className="labeller-space"
          style={{
            width: imageAspectRatio > 16 / 9 ? "100%" : "fit-content",
            height: imageAspectRatio > 16 / 9 ? "fit-content" : "100%",
          }}
        >
          {rectangles.map((r) => (
            <Rectangle
              key={r.id}
              {...r}
              imgRef={imgRef}
              dispatch={dispatch}
              labellerFormRef={labellerFormRef}
            />
          ))}

          <img
            onLoad={handleImageOnLoad}
            onMouseDown={handleImgMouseDown}
            draggable={false}
            src={src}
            alt={alt}
            ref={imgRef}
          />
        </div>
        <button className="finish-labelling" onClick={finishLabelling}>
          Finish Labelling
        </button>
      </div>

      {getLabellerForm()}
    </>
  );
}
