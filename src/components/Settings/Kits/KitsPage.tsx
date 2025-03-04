import { useEffect, useRef, useState, KeyboardEvent } from "react";

import KitsForm from "./KitsForm";
import { NavigationType } from "./types";
import { SelectOptionType } from "../../base/types";
import { MultiValue } from "react-select";

const KitsPage = () => {
  const [kit, setKit] = useState<string>("");
  const [cus, setCus] = useState<string>("");
  const [classVal, setClassVal] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [itemGroup, setItemGroup] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [glaccount, setGlaccount] = useState<string>("");
  const [lotSec, setLotSec] = useState<string>("");
  const [transactions, setTransactions] = useState<string[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);

  const kitRef = useRef<HTMLInputElement>(null);
  const cusRef = useRef<HTMLInputElement>(null);
  const classRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const itemGroupRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLInputElement>(null);
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const glaccountRef = useRef<HTMLInputElement>(null);
  const lotSecRef = useRef<HTMLInputElement>(null);
  const transactionRef = useRef<HTMLInputElement>(null);
  const customerRef = useRef<HTMLInputElement>(null);

  const buttonNewRef = useRef<HTMLButtonElement>(null);
  const buttonSaveRef = useRef<HTMLButtonElement>(null);
  const buttonPrevRef = useRef<HTMLButtonElement>(null);
  const buttonNextRef = useRef<HTMLButtonElement>(null);

  const transactionOptions = [
    { value: "Transaction 1", label: "Transport" },
    { value: "Transaction 2", label: "Use Reason" },
    { value: "Transaction 3", label: "Autorelease" },
    { value: "Transaction 4", label: "Taxable" },
    { value: "Transaction 5", label: "Autoinsert" },
    { value: "Transaction 6", label: "Commision" },
  ];

  const customerOptions = [
    { value: "Customer 1", label: "Autoinvdate" },
    { value: "Customer 2", label: "Callactnumisbill" },
    { value: "Customer 3", label: "Poisinvnum" },
    { value: "Customer 4", label: "Autoacctmonth" },
    { value: "Customer 5", label: "Autoinvnum" },
  ];

  useEffect(() => {
    kitRef.current?.focus();
  }, []);

  const fieldNavigation: NavigationType = {
    kit: { down: cusRef },
    cus: { up: kitRef, down: classRef },
    class: { up: cusRef, down: descriptionRef },
    description: { up: classRef, down: itemGroupRef },
    itemGroup: { up: descriptionRef, down: quantityRef },
    quantity: { up: itemGroupRef, down: priceRef },
    price: { up: quantityRef, down: reasonRef },
    reason: { up: priceRef, down: fromRef },
    from: { up: reasonRef, down: toRef },
    to: { up: fromRef, down: glaccountRef },
    glaccount: { up: toRef, down: lotSecRef },
    lotSec: { up: glaccountRef, down: transactionRef },
    transaction: { up: lotSecRef, down: customerRef },
    customer: { up: transactionRef, down: buttonNewRef },
    buttonNew: { up: customerRef, down: buttonSaveRef },
    buttonSave: { up: buttonNewRef, down: buttonPrevRef },
    buttonPrev: { up: buttonSaveRef, down: buttonNextRef },
    buttonNext: { up: buttonPrevRef },
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement> | KeyboardEvent<HTMLButtonElement>, field: string) => {
    if (
      field === 'transaction' ||
      field === 'customer'
    ) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        fieldNavigation[field]?.up?.current?.focus();
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        fieldNavigation[field]?.down?.current?.focus();
      }
    } else {
      if (
        field === 'buttonNew' ||
        field === 'buttonSave' ||
        field === 'buttonPrev' ||
        field === 'buttonNext'
      ) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          fieldNavigation[field]?.up?.current?.focus();
        }

        if (e.key === "ArrowRight") {
          e.preventDefault();
          fieldNavigation[field]?.down?.current?.focus();
        }
      }

      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        fieldNavigation[field]?.down?.current?.focus();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        fieldNavigation[field]?.up?.current?.focus();
      }
    }

    if (e.ctrlKey) {
      switch (e.key) {
        case "k":
          e.preventDefault();
          kitRef.current?.focus();
          break;
        case "c":
          e.preventDefault();
          cusRef.current?.focus();
          break;
        case "d":
          e.preventDefault();
          descriptionRef.current?.focus();
          break;
        case "i":
          e.preventDefault();
          itemGroupRef.current?.focus();
          break;
        case "q":
          e.preventDefault();
          quantityRef.current?.focus();
          break;
        case "p":
          e.preventDefault();
          priceRef.current?.focus();
          break;
        case "r":
          e.preventDefault();
          reasonRef.current?.focus();
          break;
        case "f":
          e.preventDefault();
          fromRef.current?.focus();
          break;
        case "t":
          e.preventDefault();
          toRef.current?.focus();
          break;
        case "g":
          e.preventDefault();
          glaccountRef.current?.focus();
          break;
        case "l":
          e.preventDefault();
          lotSecRef.current?.focus();
          break;
        case "n":
          e.preventDefault();
          buttonNewRef.current?.focus();
          break;
        case "s":
          e.preventDefault();
          buttonSaveRef.current?.focus();
          break;
      }
    }
  };

  const handleKitValue = (value: string) => {
    // Kit value should be number
    const filteredValue = value.replace(/[^0-9.]/g, '');

    if (filteredValue.length >= 4) {
      setKit(filteredValue.slice(0, 4));
      cusRef.current?.focus();
    } else {
      setKit(filteredValue);
    }
  }

  const handleCusValue = (value: string) => {
    if (value.length >= 6) {
      setCus(value.substring(0, 6));
      classRef.current?.focus();
    } else {
      setCus(value);
    }
  }

  const handleClassValue = (value: string) => {
    if (value.length >= 1) {
      setClassVal(value.substring(0, 1));
      descriptionRef.current?.focus();
    } else {
      setClassVal(value);
    }
  }

  const handleItemGroupValue = (value: string) => {
    if (value.length >= 1) {
      setItemGroup(value.substring(0, 1));
      quantityRef.current?.focus();
    } else {
      setItemGroup(value);
    }
  }

  const handleQuantityValue = (value: string) => {
    // Quantity value should be number
    const filteredValue = value.replace(/[^0-9.]/g, '');

    if (filteredValue.length >= 7) {
      setQuantity(filteredValue.substring(0, 6));
      priceRef.current?.focus();
    } else {
      setQuantity(filteredValue);
    }
  }

  const handlePriceValue = (value: string) => {
    // Price value should be number
    const filteredValue = value.replace(/[^0-9.]/g, '');
    setPrice(filteredValue);
  }

  const handleReasonValue = (value: string) => {
    if (value.length >= 50) {
      setReason(value.substring(0, 50));
      fromRef.current?.focus();
    } else {
      setReason(value);
    }
  }

  const handleGlaccountValue = (value: string) => {
    if (value.length >= 5) {
      setGlaccount(value.substring(0, 5));
      lotSecRef.current?.focus();
    } else {
      setGlaccount(value);
    }
  }

  const handleLotSecValue = (value: string) => {
    if (value.length >= 4) {
      setLotSec(value.substring(0, 4));
      transactionRef.current?.focus();
    } else {
      setLotSec(value);
    }
  }

  const handleTransactions = (selectedOptions: MultiValue<SelectOptionType>) => {
    const values: string[] = [];
    selectedOptions.map((selectedOption: SelectOptionType) => values.push(selectedOption.value));
    setTransactions(values);
  }

  const handleCustomers = (selectedOptions: MultiValue<SelectOptionType>) => {
    const values: string[] = [];
    selectedOptions.map((selectedOption: SelectOptionType) => values.push(selectedOption.value));
    console.log(values)
    setCustomers(values);
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <KitsForm
        kitVal={kit}
        cusVal={cus}
        classVal={classVal}
        descriptionVal={description}
        itemGroupVal={itemGroup}
        quantityVal={quantity}
        priceVal={price}
        reasonVal={reason}
        fromVal={from}
        toVal={to}
        glaccountVal={glaccount}
        lotSecVal={lotSec}
        transactionVal={transactions}
        customerVal={customers}
        transactionOptions={transactionOptions}
        customerOptions={customerOptions}
        kitRef={kitRef}
        cusRef={cusRef}
        classRef={classRef}
        descriptionRef={descriptionRef}
        itemGroupRef={itemGroupRef}
        quantityRef={quantityRef}
        priceRef={priceRef}
        reasonRef={reasonRef}
        fromRef={fromRef}
        toRef={toRef}
        glaccountRef={glaccountRef}
        lotSecRef={lotSecRef}
        transactionRef={transactionRef}
        customerRef={customerRef}

        buttonNewRef={buttonNewRef}
        buttonSaveRef={buttonSaveRef}
        buttonPrevRef={buttonPrevRef}
        buttonNextRef={buttonNextRef}

        handleKitValChange={(e) => handleKitValue(e)}
        handleCusValChange={(e) => handleCusValue(e)}
        handleClassValChange={(e) => handleClassValue(e)}
        handleDescriptionValChange={(e) => setDescription(e)}
        handleItemGroupValChange={(e) => handleItemGroupValue(e)}
        handleQuantityValChange={(e) => handleQuantityValue(e)}
        handlePriceValChange={(e) => handlePriceValue(e)}
        handleReasonValChange={(e) => handleReasonValue(e)}
        handleFromValChange={(e) => setFrom(e)}
        handleToValChange={(e) => setTo(e)}
        handleGlaccountValChange={(e) => handleGlaccountValue(e)}
        handleLotSecValChange={(e) => handleLotSecValue(e)}
        handleTransactionValChange={(e) => handleTransactions(e)}
        handleCustomerValChange={(e) => handleCustomers(e)}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default KitsPage;
