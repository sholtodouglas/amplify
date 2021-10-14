import React, {
    useReducer,
    useRef,
    useEffect,
    useCallback,
    useState,
  } from "react";

import { LabellerForm } from "./LabellerForm";

export function LabellerListItem({ index, rectangle, schema, dispatch }) {
    const itemRef = useRef(null)

    const itemClickHandler = (e) => {
        dispatch({ type: "update", payload: {id: rectangle.id, selected: true }})
    }

    console.log(rectangle.initialResizing)

    return (

        <div className="labeller-list-item"
         ref={itemRef} onClick={itemClickHandler} data-id={rectangle.id}>
            <div className="labeller-list-item-header">
                <div className={`labeller-list-item-status ${
            Object.keys(rectangle.labels).length > 0 ? "labelled" : ""
          }` }></div>
                <div className="labeller-list-item-title">{`${rectangle.id}`}</div>
            </div>

                        <LabellerForm rectangle={rectangle} schema={schema} dispatch={dispatch}/>

        </div>
    )
}