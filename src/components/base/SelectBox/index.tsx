import Select from "react-select";
import { SelectBoxPropsType } from "./types";
import React from "react";

const SelectBox = (props: SelectBoxPropsType) => {
  return (
    <>
      <label className="block text-sm font-medium text-gray-700">
        {props.label.split('*')[0]}<span style={{ color: 'red' }}>{props.label.includes('*') && '*'}</span>
      </label>
      <Select
        ref={props.reference}
        className="basic-single mt-1 w-full rounded-md border-gray-300 text-sm"
        classNamePrefix="select"
        isSearchable
        isMulti
        name="color"
        options={props.options}
        onChange={(selectedOptions) => props.handleChange(selectedOptions)}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => props.handleKeyDown(e, props.refName)}
      />
    </>
  );
};

export default SelectBox;
