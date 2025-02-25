import React, { useState, useEffect, useRef, forwardRef } from "react";
import FormSection from "./common/FormSection";
import FormInput from "./common/FormInput";
import DateInput from "./common/DateInput";
import TruckCombobox from "./common/TruckCombobox";
import KitCombobox from "./common/KitCombobox";
import PhoneInput from "./common/PhoneInput";
import Select from "react-select";
import VehicleSection from "./VehicleSection";
import { supabase } from "../lib/supabase";

interface Dispatch {
  towdate?: string;
  towtagnum?: string;
  trucknum?: string;
  dispatcher?: string;
  callname?: string;
  whocalled?: string;
  callphone?: string;
  refnumber?: string;
  value?: string;
}

interface Invoice {
  kitnum?: string;
  membernum?: string;
  memberexp?: string;
  dateStored?: string;
}

interface GeneralSectionProps {
  dispatch: Dispatch;
  invoice: Invoice;
  onDispatchChange: (updates: Partial<Dispatch>) => void;
  onInvoiceChange: (updates: Partial<Invoice>) => void;
  onEnterPress?: () => void;
  // inputRefs?:any;
  // handleKeyDown?:any;
  
}

interface AccountNameProps {
  label: string;
  title: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  value?: string;
  onChange?: (value: string) => void;
  onEnterPress?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const AccountName = React.forwardRef<HTMLInputElement, AccountNameProps>(
  ({ label, title, size = "md", value = "", onChange, onEnterPress ,onKeyDown}, ref) => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<any | null>(null);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    const sizeClasses = {
      xs: "5rem",
      sm: "8rem",
      md: "12rem",
      lg: "30ch",
      xl: "100%",
      full: "100%",
    };

    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from("customer")
        .select("custname,custnum")
        .ilike("custname", `%${searchTerm}%`)
        .ilike("custnum", `%${searchTerm}%`)
        .limit(10);

      if (!error && data) {
        const result = data.map((item) => ({
          value: item.custname,
          label: `${item.custname} (${item.custnum})`,
        }));
        setCompanies(result);
      }
    };

    useEffect(() => {
      const debounce = setTimeout(fetchCompanies, 300);
      return () => clearTimeout(debounce);
    }, [searchTerm]);

    useEffect(() => {
      if (value) {
        const option = companies.find((company) => company.value === value);
        if (option) {
          setSelectedOption(option);
        }
      } else {
        setSelectedOption(null);
      }
    }, [value, companies]);

    const handleChange = (option: any | null, actionMeta: any) => {
      setSelectedOption(option);
      if (option) {
        onChange?.(option.value);
        if (actionMeta.action === "select-option" && onEnterPress) {
          setTimeout(onEnterPress, 0);
        }
      } else {
        onChange?.("");
      }
    };

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    //   if (e.key === "Enter" && !menuIsOpen && onEnterPress) {
    //     e.preventDefault();
    //     onEnterPress();
    //   }
    // };
   const handleKeyDown = (e: any) => {
     if (onKeyDown) {
       onKeyDown(e);
     }
   };
    const handleInputChange = (inputValue: string) => {
      setSearchTerm(inputValue);
    };

    const customStyles = {
      control: (provided: any, state: { isFocused: boolean }) => ({
        ...provided,
        borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
        "&:hover": {
          borderColor: state.isFocused ? "#3B82F6" : "#9CA3AF",
        },
        boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
        minHeight: "38px",
      }),
      option: (
        provided: any,
        state: { isSelected: boolean; isFocused: boolean }
      ) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "#3B82F6"
          : state.isFocused
          ? "#F3F4F6"
          : "white",
        color: state.isSelected ? "white" : "#111827",
        cursor: "pointer",
        "&:active": {
          backgroundColor: "#3B82F6",
          color: "white",
        },
      }),
      menu: (provided: any) => ({
        ...provided,
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        borderRadius: "0.375rem",
        zIndex: 1000,
      }),
      menuList: (provided: any) => ({
        ...provided,
        padding: "4px",
      }),
      input: (provided: any) => ({
        ...provided,
        color: "#111827",
      }),
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div style={{ width: sizeClasses[size] }}>
          <Select
            ref={ref as any}
            value={selectedOption}
            onChange={handleChange}
            options={companies}
            styles={customStyles}
            placeholder="Select a company"
            isClearable
            isSearchable
            onKeyDown={handleKeyDown}
            menuIsOpen={menuIsOpen}
            onInputChange={handleInputChange}
            onMenuOpen={() => setMenuIsOpen(true)}
            onMenuClose={() => setMenuIsOpen(false)}
            backspaceRemovesValue={true}
            blurInputOnSelect={true}
            captureMenuScroll={true}
            closeMenuOnSelect={true}
            filterOption={null}
            noOptionsMessage={() => "No companies found"}
          />
        </div>
      </div>
    );
  }
);

AccountName.displayName = "AccountName";

const GeneralSection = forwardRef<HTMLDivElement, GeneralSectionProps>(
  ({ dispatch, invoice, onDispatchChange, onInvoiceChange }, ref) => {
    // const inputRefs = {
    //   date: useRef<HTMLInputElement>(null),
    //   tag: useRef<HTMLInputElement>(null),
    //   truck: useRef<HTMLInputElement>(null),
    //   dispatcher: useRef<HTMLInputElement>(null),
    //   kit: useRef<HTMLInputElement>(null),
    //   memberNum: useRef<HTMLInputElement>(null),
    //   memberExp: useRef<HTMLInputElement>(null),
    //   value: useRef<HTMLInputElement>(null),
    //   dateStored: useRef<HTMLInputElement>(null),
    //   account: useRef<HTMLInputElement>(null),
    //   whoCalled: useRef<HTMLInputElement>(null),
    //   phone: useRef<HTMLInputElement>(null),
    //   refNum: useRef<HTMLInputElement>(null),
    //   vehicleSection: useRef<HTMLDivElement>(null),
    // }

    // const inputOrder = [
    //   "date",
    //   "tag",
    //   "truck",
    //   "dispatcher",
    //   "kit",
    //   "memberNum",
    //   "memberExp",
    //   "value",
    //   "dateStored",
    //   "account",
    //   "whoCalled",
    //   "phone",
    //   "refNum",
    //   "vehicleSection",
    // ]

    // const focusNextInput = (currentIndex: number) => {
    //   const nextIndex = (currentIndex + 1) % inputOrder.length
    //   const nextRef = inputRefs[inputOrder[nextIndex] as keyof typeof inputRefs]
    //   if (nextRef.current) {
    //     nextRef.current.focus()
    //   }
    // }

    // const focusPreviousInput = (currentIndex: number) => {
    //   const previousIndex = (currentIndex - 1 + inputOrder.length) % inputOrder.length
    //   const previousRef = inputRefs[inputOrder[previousIndex] as keyof typeof inputRefs]
    //   if (previousRef.current) {
    //     previousRef.current.focus()
    //   }
    // }

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
    //   console.log(index,"what is  the index")
    //   if (e.key === "Enter") {
    //     e.preventDefault()
    //     focusNextInput(index)
    //   } else if (e.key === "ArrowUp") {
    //     e.preventDefault()
    //     focusPreviousInput(index)
    //   }
    // }
    // const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
    //   console.log("Current index before timeout:", index);
    //   if (e.key === "Enter") {
    //     e.preventDefault();
    //     setTimeout(() => {
    //       console.log("Index after timeout:", index);
    //       focusNextInput(index);
    //     }, 0);
    //   } else if (e.key === "ArrowUp") {
    //     e.preventDefault();
    //     setTimeout(() => {
    //       focusPreviousInput(index);
    //     }, 0);
    //   }
    // };

    return (
      <FormSection title="A - General Information" ref={ref}>
        <div className="space-y-0">
          <div className="flex flex-wrap gap-2">
            <DateInput
              // ref={inputRefs.date}
              className="h-10 text-[14px]"
              label="Date"
              title="master.towdate"
              size="sm"
              value={dispatch.towdate || ""}
              onChange={(value) => onDispatchChange({ towdate: value })}
              // onKeyDown={(e) => handleKeyDown(e, 0)}
            />
            <FormInput
              // ref={inputRefs.tag}
              className="h-10 text-[14px]"
              label="Tag #"
              title="master.towtagnum"
              value={dispatch.towtagnum || ""}
              onChange={(e) => onDispatchChange({ towtagnum: e.target.value })}
              // onKeyDown={(e) => handleKeyDown(e, 1)}
            />
            {/* <TruckCombobox
              // ref={inputRefs.truck}
              label="Truck"
              title="master.trucknum"
              size="lg"
              value={dispatch.trucknum || ""}
              onChange={(value) => onDispatchChange({ trucknum: value })}
              // onKeyDown={(e) => handleKeyDown(e, 2)}
            /> */}
            <FormInput
              // ref={inputRefs.dispatcher}
              label="Dispatcher"
              className="h-10 text-[14px]"
              title="master.dispatcher"
              value={dispatch.dispatcher || ""}
              onChange={(e) => onDispatchChange({ dispatcher: e.target.value })}
              // onKeyDown={(e) => handleKeyDown(e, 3)}
            />
            <KitCombobox
              // ref={inputRefs.kit}
              label="Kit #"
              title="master.kitnum"
              size="md"
              value={invoice.kitnum || ""}
              onChange={(value) => onInvoiceChange({ kitnum: value })}
              // onKeyDown={(e) => handleKeyDown(e, 4)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FormInput
              // ref={inputRefs.memberNum}
              className="h-10 text-[14px]"
              label="Member #"
              title="master.membernum"
              value={invoice.membernum || ""}
              onChange={(e) => onInvoiceChange({ membernum: e.target.value })}
              // onKeyDown={(e) => handleKeyDown(e, 5)}
            />
            <DateInput
              // ref={inputRefs.memberExp}
              className="h-10 text-[14px]"
              label="Expires"
              title="master.memberexp"
              size="sm"
              value={invoice.memberexp || ""}
              onChange={(value) => onInvoiceChange({ memberexp: value })}
              // onKeyDown={(e) => handleKeyDown(e, 6)}
            />
            <FormInput
              // ref={inputRefs.value}
              className="h-10 text-[14px]"
              label="Value"
              title="master.value"
              value={dispatch.value || ""}
              onChange={(e) => onDispatchChange({ value: e.target.value })}
              // onKeyDown={(e) => handleKeyDown(e, 7)}
            />
            <DateInput
              // ref={inputRefs.dateStored}
              className="h-10 text-[14px]"
              label="Date Stored"
              title="master.dateStored"
              size="sm"
              value={invoice.dateStored || ""}
              onChange={(value) => onInvoiceChange({ dateStored: value })}
              // onKeyDown={(e) => handleKeyDown(e, 8)}
            />
            <AccountName
              // ref={inputRefs.account}
              label="Account Name"
              title="master.account"
              size="xl"
              value={dispatch.callname || ""}
              onChange={(value) => onDispatchChange({ callname: value })}
              // onKeyDown={(e) => handleKeyDown(e, 9)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FormInput
              // ref={inputRefs.whoCalled}
              label="Who Called"
              className="h-10 text-[14px]"
              title="master.whocalled"
              value={dispatch.whocalled || ""}
              onChange={(e) => onDispatchChange({ whocalled: e.target.value })}
              // onKeyDown={(e) => handleKeyDown(e, 10)}
            />
            <PhoneInput
              // ref={inputRefs.phone}
              label="Phone #"
              title="master.phone"
              className="h-10 text-[14px]"
              size="lg"
              value={dispatch.callphone || ""}
              onChange={(value) => onDispatchChange({ callphone: value })}
              // onKeyDown={(e) => handleKeyDown(e, 11)}
            />
            <FormInput
              // ref={inputRefs.refNum}
              className="h-10 text-[14px]"
              label="Reference #"
              title="master.refnum"
              value={dispatch.refnumber || ""}
              onChange={(e) => onDispatchChange({ refnumber: e.target.value })}
              // onKeyDown={(e) => handleKeyDown(e, 12)}
            />
          </div>

          {/* <div ref={inputRefs.vehicleSection} className="">
            <VehicleSection
              dispatch={dispatch}
              onDispatchChange={onDispatchChange}
              // onKeyDown={(e) => handleKeyDown(e, 13)}
            />
          </div> */}
        </div>
      </FormSection>
    )
  },
)

export default GeneralSection;
