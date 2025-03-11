import { useRef, useState, KeyboardEvent } from "react";

import { TextInput, CheckBox } from "../../base";
import { NavigationType } from "../Kits/types";

const PricesPage = () => {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compercent, setCompercent] = useState("");
  const [flatamount, setFlatamount] = useState("");
  const [itemGroup, setItemGroup] = useState("")
  const [noDiscount, setNoDiscount] = useState(false);
  const [computeTime, setComputeTime] = useState(false);
  const [taxable, setTaxable] = useState(false);

  const descriptionRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const compercentRef = useRef<HTMLInputElement>(null);
  const flatamountRef = useRef<HTMLInputElement>(null);
  const itemGroupRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const computeRef = useRef<HTMLInputElement>(null);
  const taxableRef = useRef<HTMLInputElement>(null);
  const buttonDeleteRef = useRef<HTMLButtonElement>(null);

  const fieldNavigation: NavigationType = {
    description: { down: priceRef },
    price: { up: descriptionRef, down: compercentRef },
    compercent: { up: priceRef, down: flatamountRef },
    flatamount: { up: compercentRef, down: buttonDeleteRef },
    buttonDelete: { up: flatamountRef, down: itemGroupRef },
    itemgroup: { up: buttonDeleteRef, down: discountRef },
    discount: { up: itemGroupRef, down: computeRef },
    compute: { up: discountRef, down: taxableRef },
    taxable: { up: computeRef },
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement> | KeyboardEvent<HTMLButtonElement>, field: string) => {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      fieldNavigation[field]?.down?.current?.focus();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      fieldNavigation[field]?.up?.current?.focus();
    }


    if (e.ctrlKey) {
      switch (e.key) {
        case "d":
          e.preventDefault();
          descriptionRef.current?.focus();
          break;
        case "i":
          e.preventDefault();
          itemGroupRef.current?.focus();
          break;
        case "p":
          e.preventDefault();
          priceRef.current?.focus();
          break;
        case "c":
          e.preventDefault();
          compercentRef.current?.focus();
          break;
        case "f":
          e.preventDefault();
          flatamountRef.current?.focus();
          break;
        case "n":
          e.preventDefault();
          discountRef.current?.focus();
          break;
        case "t":
          e.preventDefault();
          taxableRef.current?.focus();
          break;
      }
    }
  };

  const handlePriceChange = (value: string) => {
    const filteredValue = value.replace(/[^0-9.]/g, '');

    if (filteredValue.length >= 7) {
      setPrice(filteredValue.substring(0, 6));
      compercentRef.current?.focus();
    } else {
      setPrice(filteredValue);
    }
  }

  const handleCompercentChange = (value: string) => {
    const filteredValue = value.replace(/[^0-9.]/g, '');

    if (filteredValue.length >= 7) {
      setCompercent(filteredValue.substring(0, 6));
      compercentRef.current?.focus();
    } else {
      setCompercent(filteredValue);
    }
  }

  const handleFlatamountChange = (value: string) => {
    const filteredValue = value.replace(/[^0-9.]/g, '');

    if (filteredValue.length >= 7) {
      setFlatamount(filteredValue.substring(0, 6));
      compercentRef.current?.focus();
    } else {
      setFlatamount(filteredValue);
    }
  }

  const handleItemGroupValue = (value: string) => {
    if (value.length >= 1) {
      setItemGroup(value.substring(0, 1));
      // quantityRef.current?.focus();
    } else {
      setItemGroup(value);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-4">
          <h1 className="text-center font-bold">Prices Form</h1>
          <div>
            <TextInput
              reference={descriptionRef}
              refName="description"
              placeholder="Description"
              label="Description *"
              value={description}
              handleInputChange={(e) => setDescription(e)}
              handleKeyDown={handleKeyDown}
            />
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <TextInput
                reference={priceRef}
                refName="price"
                placeholder="0"
                label="Price *"
                value={price}
                handleInputChange={handlePriceChange}
                handleKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <TextInput
                reference={compercentRef}
                refName="compercent"
                placeholder="0"
                label="Compercent *"
                value={compercent}
                handleInputChange={handleCompercentChange}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <TextInput
                reference={flatamountRef}
                refName="flatamount"
                placeholder="0"
                label="Flat Amount *"
                value={flatamount}
                handleInputChange={handleFlatamountChange}
                handleKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <TextInput
                reference={itemGroupRef}
                refName="itemgroup"
                placeholder="0"
                label="Item Group *"
                value={itemGroup}
                handleInputChange={handleItemGroupValue}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <CheckBox
              label="No Discount"
              checked={noDiscount}
              reference={discountRef}
              refName="discount"
              onChange={(value) => setNoDiscount(value)}
              handleKeyDown={handleKeyDown}
            />

            <CheckBox
              label="Compute Time"
              checked={computeTime}
              reference={computeRef}
              refName="compute"
              onChange={(value) => setComputeTime(value)}
              handleKeyDown={handleKeyDown}
            />

            <CheckBox
              label="Taxable"
              checked={taxable}
              reference={taxableRef}
              refName="taxable"
              onChange={(value) => setTaxable(value)}
              handleKeyDown={handleKeyDown}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div></div>
            <div></div>
            <div></div>
            <div className="mt-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-2 rounded duration-300 w-100"
                ref={buttonDeleteRef}
                onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => handleKeyDown(e, 'buttonDelete')}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricesPage;
