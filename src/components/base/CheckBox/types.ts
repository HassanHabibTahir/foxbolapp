type CheckBoxPropsType = {
  label: string,
  checked: boolean,
  reference: React.RefObject<HTMLInputElement>,
  refName: string,
  onChange: (value: any) => void,
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, field: string) => void,
}

export type { CheckBoxPropsType };