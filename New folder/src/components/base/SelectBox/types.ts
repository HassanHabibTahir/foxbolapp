import { MultiValue } from "react-select"
import { SelectOptionType } from "../types"

type SelectBoxPropsType = {
  reference: React.RefObject<HTMLDivElement>|any,
  refName: string,
  options: SelectOptionType[],
  label: string,
  value?: SelectOptionType[],
  handleChange: (selectedOptions: MultiValue<SelectOptionType>) => void,
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, field: string) => void,
  ref?:any
}

export type { SelectBoxPropsType }
