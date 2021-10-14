import {LabellerListItem} from "./LabellerListItem";


export function LabellerList({ rectangles, schema, dispatch }) {

  return (
    <>

      <div className="labeller-list">
      <div className="labeller-list-item-holder">
        {
          rectangles.filter(r => !r.initialResizing).map((r, index) => (
            <LabellerListItem
              rectangle={r}
              dispatch={dispatch}
              schema={schema}
              index={index + 1}
            />
          ))
        }
      </div>
      </div>

    </>
  );
}
