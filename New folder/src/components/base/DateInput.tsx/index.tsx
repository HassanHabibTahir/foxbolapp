import { DateInputPropsType } from "./types";

const DateInput = (props: DateInputPropsType) => {
  return (
    <>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {props.label.split('*')[0]}<span style={{ color: 'red' }}>{props.label.includes('*') && '*'}</span>
      </label>
      <input
        ref={props.reference}
        type="text"
        value={props.value}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-1 text-sm border border-gray-120"
        placeholder="dd/mm/yyyy"
        onChange={(e) => props.handleInputChange(e.target.value)}
        onKeyDown={(e) => props.handleKeyDown(e, props.refName)}
      />
    </>
  )
}

export default DateInput;