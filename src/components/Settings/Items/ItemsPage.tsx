import { useRef, useState, KeyboardEvent } from "react";
import { MultiValue } from "react-select";
import '@coreui/coreui-pro/dist/css/coreui.min.css';

import { CheckBox, DateInput, TextInput, SelectBox } from "../../base";
import { NavigationType } from "../Kits/types";

import { SelectOptionType } from "../../base/types";

const ItemsPage = () => {
  const [excludeWindow, setExcludeWindow] = useState(false);
  const [taxable, setTaxable] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  // const [updatedAt, setUpdatedAt] = useState("");
  const [description, setDescription] = useState("");
  const [shortcut1, setShortcut1] = useState("");
  const [shortcut2, setShortcut2] = useState("");
  const [measure, setMeasure] = useState<string[]>([]);;
  // const [author, setAuthor] = useState("");
  const [financial, setFinancial] = useState<string[]>([]);
  const [miscellaneous, setMiscellaneous] = useState<string[]>([]);

  const excludeRef = useRef<HTMLInputElement>(null);
  const taxableRef = useRef<HTMLInputElement>(null);
  const createdAtRef = useRef<HTMLInputElement>(null);
  // const updatedAtRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const shortcut1Ref = useRef<HTMLInputElement>(null);
  const shortcut2Ref = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLInputElement>(null);
  // const authorRef = useRef<HTMLInputElement>(null);
  const financialRef = useRef<HTMLInputElement>(null);
  const miscellaneousRef = useRef<HTMLInputElement>(null);

  const buttonSendRef = useRef<HTMLButtonElement>(null);
  const buttonDeleteRef = useRef<HTMLButtonElement>(null);
  const buttonNextRef = useRef<HTMLButtonElement>(null);

  const measureOptions = [
    { value: "mile", label: "Mile" },
    { value: "day", label: "Day" },
    { value: "hour", label: "Hour" },
    { value: "min", label: "Minute" },
  ]

  const financialOptions = [
    { value: "profit", label: "Profit Item" },
    { value: "percent", label: "Percent Discount" },
    { value: "charge", label: "Advanced Charges" },
  ]

  const miscellaneousOptions = [
    { value: "allowExceptions", label: "Allow exceptions" },
    { value: "housetow", label: "Housetow" },
  ];

  const fieldNavigation: NavigationType = {
    exclude: { down: taxableRef },
    taxable: { up: excludeRef, down: buttonSendRef },
    buttonSend: { up: taxableRef, down: buttonNextRef },
    buttonNext: { up: buttonSendRef, down: shortcut1Ref },
    shortcut1: { up: buttonNextRef, down: shortcut2Ref },
    shortcut2: { up: shortcut1Ref, down: measureRef },
    measure: { up: shortcut2Ref, down: financialRef },
    financial: { up: measureRef, down: miscellaneousRef },
    miscellaneous: { up: financialRef, down: descriptionRef },
    description: { up: miscellaneousRef, down: buttonDeleteRef },
    buttonDelete: { up: descriptionRef, down: createdAtRef },
    createdAt: { up: buttonDeleteRef },
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement> | KeyboardEvent<HTMLButtonElement>, field: string) => {
    if (
      field === 'measure' ||
      field === 'financial' ||
      field === 'miscellaneous'
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
        field === 'buttonSend' ||
        field === 'buttonDelete' ||
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
        case "t":
          e.preventDefault();
          taxableRef.current?.focus();
          break;
        case "c":
          e.preventDefault();
          createdAtRef.current?.focus();
          break;
        case "s":
          e.preventDefault();
          shortcut1Ref.current?.focus();
          break;
        case "m":
          e.preventDefault();
          measureRef.current?.focus();
          break;
        case "f":
          e.preventDefault();
          financialRef.current?.focus();
          break;
      }
    }
  };

  const handleExcludeWindowChange = (value: string) => {
    setExcludeWindow(value ? true : false);
    console.log(value);
  }

  const handleTaxableChange = (value: string) => {
    setTaxable(value ? true : false);
    console.log(value);
  }

  const handleCreatedAtChange = (value: string) => {
    const digits = value.replace(/\D/g, ""); // Remove non-numeric characters

    // const parts = digits.split("/");
    // if (parts.length === 3) {
    //   const day = parts[0].padStart(2, "0");
    //   const month = parts[1].padStart(2, "0");
    //   let year = parts[2];

    //   if (year.length === 2) {
    //     const numericYear = parseInt(year, 10);
    //     year = numericYear >= 20 ? `20${year}` : `19${year}`;
    //   }
    //   setCreatedAt(`${day}/${month}/${year}`);
    // }
    // setCreatedAt(digits);

    if (digits.length >= 8) {
      setCreatedAt(digits.substring(0, 8));
    } else {
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);

      let validDay = "";
      if (parseInt(day, 10) >= 1 && parseInt(day, 10) <= 31) {
        validDay = day;
      } else if (parseInt(day, 10) < 1) {
        validDay = '1';
      } else if (parseInt(day, 10) > 31) {
        validDay = '31';
      }

      let validMonth = "";
      if (parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12) {
        validMonth = month;
      } else if (parseInt(month, 10) < 1) {
        validMonth = '1';
      } else if (parseInt(month, 10) > 12) {
        validMonth = '12';
      }
      setCreatedAt(`${validDay}/${validMonth}/${year}`); // Show partial input while typing
    }
  }

  /*
  const handleUpdatedAtChange = (value: string) => {
    const digits = value.replace(/\D/g, ""); // Remove non-numeric characters

    if (digits.length >= 8) {
      setUpdatedAt(digits.substring(0, 8));
      updatedAtRef.current?.focus();
    } else {
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);

      let validDay = "";
      if (parseInt(day, 10) >= 1 && parseInt(day, 10) <= 31) {
        validDay = day;
      } else if (parseInt(day, 10) < 1) {
        validDay = '1';
      } else if (parseInt(day, 10) > 31) {
        validDay = '31';
      }

      let validMonth = "";
      if (parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12) {
        validMonth = month;
      } else if (parseInt(month, 10) < 1) {
        validMonth = '1';
      } else if (parseInt(month, 10) > 12) {
        validMonth = '12';
      }
      setUpdatedAt(`${validDay}/${validMonth}/${year}`); // Show partial input while typing
    }
  }
  */

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  }

  const handleShortcut1Change = (value: string) => {
    if (value.length >= 18) {
      setShortcut1(value.substring(0, 18));
      shortcut2Ref.current?.focus();
    } else {
      setShortcut1(value);
    }
  }

  const handleShortcut2Change = (value: string) => {
    if (value.length >= 18) {
      setShortcut2(value.substring(0, 18));
      measureRef.current?.focus();
    } else {
      setShortcut2(value);
    }
  }

  const handleMeasureChange = (selectedOptions: MultiValue<SelectOptionType>) => {
    const values: string[] = [];
    selectedOptions.map((selectedOption: SelectOptionType) => values.push(selectedOption.value));
    setMeasure(values);
    console.log({ measure });
  }

  /*
  const handleAuthorChange = (value: string) => {
    console.log(value);
    setAuthor(value);
  }
  */

  const handleFinancialChange = (selectedOptions: MultiValue<SelectOptionType>) => {
    const values: string[] = [];
    selectedOptions.map((selectedOption: SelectOptionType) => values.push(selectedOption.value));
    setFinancial(values);
    console.log({ financial });
  }

  const handleMiscellaneousChange = (selectedOptions: MultiValue<SelectOptionType>) => {
    const values: string[] = [];
    selectedOptions.map((selectedOption: SelectOptionType) => values.push(selectedOption.value));
    setMiscellaneous(values);
    console.log({ miscellaneous });
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-4">
          <h1 className="text-center font-bold">Items Form</h1>
          <div className="grid grid-cols-2 gap-4">
            <CheckBox
              label="Exclude From Lookup Window"
              checked={excludeWindow}
              reference={excludeRef}
              refName="exclude"
              onChange={handleExcludeWindowChange}
              handleKeyDown={handleKeyDown}
            />

            <CheckBox
              label="Taxable"
              checked={taxable}
              reference={taxableRef}
              refName="taxable"
              onChange={handleTaxableChange}
              handleKeyDown={handleKeyDown}
            />
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <TextInput
                reference={shortcut1Ref}
                refName="shortcut1"
                placeholder="Shortcut 1"
                label="Shortcut 1"
                value={shortcut1}
                handleInputChange={handleShortcut1Change}
                handleKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <TextInput
                reference={shortcut2Ref}
                refName="shortcut2"
                placeholder="Shortcut 2"
                label="Shortcut 2"
                value={shortcut2}
                handleInputChange={handleShortcut2Change}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <SelectBox
                label="Measure *"
                refName="measure"
                reference={measureRef}
                options={measureOptions}
                handleChange={handleMeasureChange}
                handleKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <SelectBox
                label="Financial *"
                refName="financial"
                reference={financialRef}
                options={financialOptions}
                handleChange={handleFinancialChange}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <SelectBox
                label="Miscellaneous *"
                refName="miscellaneous"
                reference={miscellaneousRef}
                options={miscellaneousOptions}
                handleChange={handleMiscellaneousChange}
                handleKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <DateInput
                label="Creation Date *"
                value={createdAt}
                reference={createdAtRef}
                refName="createdAt"
                handleInputChange={handleCreatedAtChange}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div>
            <TextInput
              reference={descriptionRef}
              refName="description"
              placeholder="Description"
              label="Description *"
              value={description}
              handleInputChange={handleDescriptionChange}
              handleKeyDown={handleKeyDown}
            />
          </div>

          {/* <div className="grid grid-cols-2 gap-12">
            <div>
              <DateInput
                label="Last Update *"
                value={updatedAt}
                reference={updatedAtRef}
                refName="updatedAt"
                handleInputChange={handleUpdatedAtChange}
                handleKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <TextInput
                reference={authorRef}
                refName="author"
                placeholder="Entered By"
                label="Entered By *"
                value={author}
                handleInputChange={handleAuthorChange}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div> */}

          <div className="grid grid-cols-4 gap-12 mt-5">
            <div></div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-2 rounded duration-300"
              ref={buttonSendRef}
              onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => handleKeyDown(e, 'buttonSend')}
            >
              Send Page
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-2 rounded duration-300"
              ref={buttonDeleteRef}
              onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => handleKeyDown(e, 'buttonDelete')}
            >
              Delete
            </button>


            <button
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-2 rounded duration-300"
              ref={buttonNextRef}
              onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => handleKeyDown(e, 'buttonNext')}
            >
              Next
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            src="https://i.ibb.co/vxS8m30b/sg-Invoicing-Hero-l1.jpg"
            alt="Items"
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      </div >
    </div>
  )
}

export default ItemsPage;
