type TextInputPropsType = {
  reference: React.RefObject<HTMLInputElement>,
  placeholder: string,
  label: string,
  value: string,
  refName: string,
  id?: string,
  handleInputChange: (e: string) => void,
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, field: string) => void,
}

export type {TextInputPropsType}