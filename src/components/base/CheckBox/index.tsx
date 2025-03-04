import { ChangeEvent } from "react";
import { CheckBoxPropsType } from "./types";

const CheckBox = (props: CheckBoxPropsType) => {
  return (
    < div className="flex">
      <input
        type="checkbox"
        checked={props.checked}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        ref={props.reference}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.onChange(e.target.checked)}
        onKeyDown={(e) => props.handleKeyDown(e, props.refName)}
      />
      <label className="block text-sm font-medium text-gray-700 ml-2">
        {props.label.split('*')[0]}<span style={{ color: 'red' }}>{props.label.includes('*') && '*'}</span>
      </label>
    </div>
  )
}

export default CheckBox;