type DateInputPropsType = {
  reference: React.RefObject<HTMLInputElement>,
  label: string,
  value: string,
  id?: string,
  refName: string,
  handleInputChange: (value: string) => void,
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, field: string) => void,
}

export type { DateInputPropsType };