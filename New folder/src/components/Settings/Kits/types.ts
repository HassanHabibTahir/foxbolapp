import { RefObject, KeyboardEvent } from "react";
import { SelectOptionType } from "../../base/types";
import { MultiValue } from "react-select";

type KitFormPropsType = {
  kitVal: string,
  cusVal: string,
  classVal: string,
  descriptionVal: string,
  itemGroupVal: string,
  quantityVal: string,
  priceVal: string,
  reasonVal: string,
  fromVal: string,
  toVal: string,
  glaccountVal: string,
  lotSecVal: string,
  transactionVal: string[],
  customerVal: string[],
  transactionOptions: SelectOptionType[],
  customerOptions: SelectOptionType[],

  kitRef: RefObject<HTMLInputElement>,
  cusRef: RefObject<HTMLInputElement>,
  classRef: RefObject<HTMLInputElement>,
  descriptionRef: RefObject<HTMLInputElement>,
  itemGroupRef: RefObject<HTMLInputElement>,
  quantityRef: RefObject<HTMLInputElement>,
  priceRef: RefObject<HTMLInputElement>,
  reasonRef: RefObject<HTMLInputElement>,
  fromRef: RefObject<HTMLInputElement>,
  toRef: RefObject<HTMLInputElement>,
  glaccountRef: RefObject<HTMLInputElement>,
  lotSecRef: RefObject<HTMLInputElement>,
  transactionRef: RefObject<HTMLInputElement>,
  customerRef: RefObject<HTMLInputElement>,
  buttonNewRef: RefObject<HTMLButtonElement>,
  buttonSaveRef: RefObject<HTMLButtonElement>,
  buttonPrevRef: RefObject<HTMLButtonElement>,
  buttonNextRef: RefObject<HTMLButtonElement>,

  handleKitValChange: (e: string) => void,
  handleCusValChange: (e: string) => void,
  handleClassValChange: (e: string) => void,
  handleDescriptionValChange: (e: string) => void,
  handleItemGroupValChange: (e: string) => void,
  handleQuantityValChange: (e: string) => void,
  handlePriceValChange: (e: string) => void,
  handleReasonValChange: (e: string) => void,
  handleFromValChange: (e: string) => void,
  handleToValChange: (e: string) => void,
  handleGlaccountValChange: (e: string) => void,
  handleLotSecValChange: (e: string) => void,
  handleTransactionValChange: (e: MultiValue<SelectOptionType>) => void,
  handleCustomerValChange: (e: MultiValue<SelectOptionType>) => void,

  handleKeyDown: (e: KeyboardEvent<HTMLDivElement> | KeyboardEvent<HTMLButtonElement>, field: string) => void,
}

type NavigationType = {
  [key: string]: {
    up?: RefObject<HTMLElement> | RefObject<HTMLButtonElement>,
    down?: RefObject<HTMLElement> | RefObject<HTMLButtonElement>,
    left?: RefObject<HTMLElement> | RefObject<HTMLButtonElement>,
    right?: RefObject<HTMLElement> | RefObject<HTMLButtonElement>,
    enter?: RefObject<HTMLElement | RefObject<HTMLButtonElement>>
  },
}

export type {
  KitFormPropsType,
  NavigationType,
}
