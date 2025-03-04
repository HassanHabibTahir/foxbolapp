import { KeyboardEvent } from "react";
import { TextInput, SelectBox } from "../../base";

import { KitFormPropsType } from "./types";
import '@coreui/coreui-pro/dist/css/coreui.min.css';

const KitsForm = (props: KitFormPropsType) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-4">
          <h1 className="text-center font-bold">Kits Form</h1>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <TextInput
                reference={props.kitRef}
                refName="kit"
                placeholder="Kit"
                label="Kit *"
                value={props.kitVal}
                handleInputChange={props.handleKitValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>

            <div>
              <TextInput
                reference={props.cusRef}
                refName="cus"
                placeholder="Cus"
                label="Cus *"
                value={props.cusVal}
                handleInputChange={props.handleCusValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>

            <div>
              <TextInput
                reference={props.classRef}
                refName="class"
                placeholder="Class"
                label="Class *"
                value={props.classVal}
                handleInputChange={props.handleClassValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>
          </div>

          <div>
            <TextInput
              reference={props.descriptionRef}
              refName="description"
              placeholder="Description"
              label="Description *"
              value={props.descriptionVal}
              handleInputChange={props.handleDescriptionValChange}
              handleKeyDown={props.handleKeyDown}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <TextInput
                reference={props.itemGroupRef}
                refName="itemGroup"
                placeholder="Item Group"
                label="Item Group *"
                value={props.itemGroupVal}
                handleInputChange={props.handleItemGroupValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>

            <div>
              <TextInput
                reference={props.quantityRef}
                refName="quantity"
                placeholder="Quantity"
                label="Quantity *"
                value={props.quantityVal}
                handleInputChange={props.handleQuantityValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>

            <div>
              <TextInput
                reference={props.priceRef}
                refName="price"
                placeholder="Price"
                label="Price *"
                value={props.priceVal}
                handleInputChange={props.handlePriceValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>
          </div>

          <div>
            <TextInput
              reference={props.reasonRef}
              refName="reason"
              placeholder="Reason"
              label="Reason *"
              value={props.reasonVal}
              handleInputChange={props.handleReasonValChange}
              handleKeyDown={props.handleKeyDown}
            />
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <TextInput
                reference={props.fromRef}
                refName="from"
                placeholder="From"
                label="From *"
                value={props.fromVal}
                handleInputChange={props.handleFromValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>

            <div>
              <TextInput
                reference={props.toRef}
                refName="to"
                placeholder="To"
                label="To *"
                value={props.toVal}
                handleInputChange={props.handleToValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <TextInput
                reference={props.glaccountRef}
                refName="glaccount"
                placeholder="Glaccount"
                label="Glaccount *"
                value={props.glaccountVal}
                handleInputChange={props.handleGlaccountValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>

            <div>
              <TextInput
                reference={props.lotSecRef}
                refName="lotSec"
                placeholder="Lotsec"
                label="Lotsec *"
                value={props.lotSecVal}
                handleInputChange={props.handleLotSecValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <SelectBox
                label="Transaction & Processing Rules *"
                refName="transaction"
                reference={props.transactionRef}
                options={props.transactionOptions}
                handleChange={props.handleTransactionValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>

            <div>
              <SelectBox
                label="For this customer *"
                refName="customer"
                reference={props.customerRef}
                options={props.customerOptions}
                handleChange={props.handleCustomerValChange}
                handleKeyDown={props.handleKeyDown}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mt-5">
            <div className="grid grid-cols-2 gap-4">
              <button
                className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-2 rounded duration-300"
                ref={props.buttonNewRef}
                onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => props.handleKeyDown(e, 'buttonNew')}
              >
                Add New Kit
              </button>

              <button
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-2 rounded duration-300"
                ref={props.buttonSaveRef}
                onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => props.handleKeyDown(e, 'buttonSave')}
              >
                Save changes
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-2 rounded duration-300"
                ref={props.buttonPrevRef}
                onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => props.handleKeyDown(e, 'buttonPrev')}
              >
                Previous
              </button>

              <button
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-2 rounded duration-300"
                ref={props.buttonNextRef}
                onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => props.handleKeyDown(e, 'buttonNext')}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1581091870598-36ce9bad5c77?auto=format&fit=crop&q=80&w=500"
            alt="Kits"
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      </div>
    </>
  );
};

export default KitsForm;
