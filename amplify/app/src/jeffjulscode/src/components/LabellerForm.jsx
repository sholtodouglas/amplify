import React from 'react'

export function LabellerForm({ schema }) {


  const makeLabel = (label, key) => {
    return <label for={key} name={key}>{label}</label>
  }

  const createSelectField = (key, options, optionGroups) => {

    // Adds the singular options
    const createSingularOptions = options => {
      const optionElements = []

      // Iterate through the options and add the elements
      for (let option of options) {
        const { label, value } = option
        const optionElement = <option label={label} value={value}></option>
        optionElements.push(optionElement)
      }

      return optionElements
    }

    // Deals with the grouped options
    const createGroupedOptions = optionGroups => {

      const optionGroupElements = []

      // iterate through the groups and add create the elements
      for (let group of optionGroups) {
        const { label, options } = group
        const optionGroupElement =
          <optgroup label={label}>
            {createSingularOptions(options)}
          </optgroup>
        optionGroupElements.push(optionGroupElement)
      }

      return optionGroupElements

    }

    // Creates the select field
    const selectField =
      <select name={key}>
        {
          [
            ...createSingularOptions(options),
            ...createGroupedOptions(optionGroups)
          ]
        }
      </select>

    return selectField
  }

  const createInputField = (key, type, attributes = {}) => {
    return <input type={type} name={key} {...attributes} />
  }

  const createForm = () => {
    const formElements = []

    for (const field of schema) {
      const {
        label,
        key,
        type,
        attributes = {},
        options = [],
        optionGroups = [],
      } = field

      // Make the label
      const labelElement = makeLabel(label, key)
      formElements.push(labelElement)

      // Make a input or select element
      if (type == 'select') {
        const selectField = createSelectField(key, options, optionGroups)
        formElements.push(selectField)
      } else {
        const inputField = createInputField(key, type, attributes)
        formElements.push(inputField)
      }

    }

    const submitButton = <input type="submit" value="Complete Label"></input>
    formElements.push(submitButton)

    return formElements
  }


  return (
    <div class="labeling">
      <form class="labels">
        {createForm()}
      </form>
    </div>
  )

}