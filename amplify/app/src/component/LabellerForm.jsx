export function LabellerForm({
  rectangle,
  schema,
  forwardRef,
  displayForm,
  dispatch,
}) {
  const makeLabel = (label, key) => {
    return (
      <label key={label} htmlFor={key} name={key}>
        {label}
      </label>
    );
  };

  const createSelectField = (key, options, optionGroups) => {
    // Adds the singular options
    const createSingularOptions = (options) => {
      const optionElements = [];

      // Iterate through the options and add the elements
      for (let option of options) {
        const { label, value } = option;
        const optionElement = (
          <option key={`${key}-${label}`} label={label} value={value}></option>
        );
        optionElements.push(optionElement);
      }

      return optionElements;
    };

    // Deals with the grouped options
    const createGroupedOptions = (optionGroups) => {
      const optionGroupElements = [];

      // iterate through the groups and add create the elements
      for (let group of optionGroups) {
        const { label, options } = group;
        const optionGroupElement = (
          <optgroup key={`group-${key}-${label}`} label={label}>
            {createSingularOptions(options)}
          </optgroup>
        );
        optionGroupElements.push(optionGroupElement);
      }

      return optionGroupElements;
    };

    // Creates the select field
    const selectField = (
      <select key={key} name={key}>
        {[
          ...createSingularOptions(options),
          ...createGroupedOptions(optionGroups),
        ]}
      </select>
    );

    return selectField;
  };

  const createInputField = (key, type, attributes = {}) => {
    const value = rectangle?.labels?.[key] ? rectangle?.labels?.[key] : null;
    return (
      <input
        key={key}
        type={type}
        name={key}
        defaultValue={value}
        {...attributes}
      />
    );
  };

  const createForm = () => {
    const formElements = [];
    console.log('shc', schema)
    for (const field of schema) {
      const {
        label,
        key,
        type,
        attributes = {},
        options = [],
        optionGroups = [],
      } = field;

      // Make the label
      const labelElement = makeLabel(label, key);
      formElements.push(labelElement);

      // Make a input or select element
      if (type === "select") {
        const selectField = createSelectField(key, options, optionGroups);
        formElements.push(selectField);
      } else {
        const inputField = createInputField(key, type, attributes);
        formElements.push(inputField);
      }
    }

    const submitButton = (
      <input key="submit" type="submit" value="Complete Label"></input>
    );
    formElements.push(submitButton);

    return formElements;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formEntry = {};
    for (let [key, value] of formData.entries()) {
      formEntry[key] = value;
    }
    dispatch({
      type: "update",
      payload: {
        id: rectangle.id,
        labels: formEntry,
      },
    });

    dispatch({
      type: "update",
      payload: {
        id: rectangle.id,
        selected: false,
      },
    });
    e.target.reset();
  };
  return (
    <div className="labeling">
      <form
        className={`label-form ${displayForm ? "" : "hide"}`}
        ref={forwardRef}
        onSubmit={handleSubmit}
      >
        {createForm()}
      </form>
    </div>
  );
}
