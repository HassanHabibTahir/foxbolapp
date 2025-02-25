import React, { useRef, useEffect, useState } from "react"
import { useFormState } from "../hooks/useFormState"
import { useLocation } from "react-router-dom"
import { supabase } from "../lib/supabase"
import DesktopLayout from "./layouts/DesktopLayout"
import SaveButton from "./SaveButton"
import NewButton from "./NewButton"
import InvoiceSearch from "./search/InvoiceSearch"
import Header from "./invoice/Header"
import FormSection from "./common/FormSection"
import TruckCombobox from "./common/TruckCombobox"
import KitCombobox from "./common/KitCombobox"
import DateInput from "./common/DateInput"
import FormInput from "./common/FormInput"
import PhoneInput from "./common/PhoneInput"
import DriverCombobox from "./common/DriverCombobox"
import MilitaryTimeInput from "./common/MilitaryTimeInput"
import Select from "react-select";
import { fetchTowData } from "../lib/saveHandlers"
import PrintButton from "./invoices/PrintButton"
import { printInvoice } from "../utils/printInvoice"



interface AccountNameProps {
  label: string;
  title: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  value?: string;
  onChange?: (value: string) => void;
  onEnterPress?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

// this is account Name
const AccountName = React.forwardRef<HTMLInputElement, AccountNameProps>(
  (
    {
      label,
      title,
      size = "md",
      value = "",
      onChange,
      onEnterPress,
      onKeyDown,
    },
    ref
  ) => {
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




const FIELD_INDEXES:any = {
  driver: 0,
  driver2: 1,
  timerec: 2,
  timeinrt: 3,
  timearrive: 4,
  timeintow: 5,
  timeclear: 6,
  towdate: 7,
  towtagnum: 8,
  trucknum: 9,
  dispatcher: 10,
  kitnum: 11,
  membernum: 12,
  memberexp: 13,
  value: 14,
  dateStored: 15,
  callname: 16,
  whocalled: 17,
  callphone: 18,
  refnumber: 19,
}

const fieldOrder = Object.keys(FIELD_INDEXES)

const InvoiceForm = () => {
  const { formState, updateDispatch, updateInvoice, updateItems, resetForm, updateDriver } = useFormState()
  const location = useLocation()
  const { dispatchNum } = location.state

  const driverRef = useRef(null)
  const driver2Ref = useRef(null)
  const timerecRef = useRef(null)
  const timeinrtRef = useRef(null)
  const timearriveRef = useRef(null)
  const timeintowRef = useRef(null)
  const timeclearRef = useRef(null)
  const towdateRef = useRef(null)
  const towtagnumRef = useRef(null)
  const trucknumRef = useRef(null)
  const dispatcherRef = useRef(null)
  const kitnumRef = useRef(null)
  const membernumRef = useRef(null)
  const memberexpRef = useRef(null)
  const valueRef = useRef(null)
  const dateStoredRef = useRef(null)
  const callnameRef = useRef(null)
  const whocalledRef = useRef(null)
  const callphoneRef = useRef(null)
  const refnumberRef = useRef(null)

  const inputRefs:any = {
    driver: driverRef,
    driver2: driver2Ref,
    timerec: timerecRef,
    timeinrt: timeinrtRef,
    timearrive: timearriveRef,
    timeintow: timeintowRef,
    timeclear: timeclearRef,
    towdate: towdateRef,
    towtagnum: towtagnumRef,
    trucknum: trucknumRef,
    dispatcher: dispatcherRef,
    kitnum: kitnumRef,
    membernum: membernumRef,
    memberexp: memberexpRef,
    value: valueRef,
    dateStored: dateStoredRef,
    callname: callnameRef,
    whocalled: whocalledRef,
    callphone: callphoneRef,
    refnumber: refnumberRef,
  }

  useEffect(() => {
    const foxtow_id = localStorage.getItem("foxtow_id") || ""
    const getDispatchNum = async () => {
      const { data, error } = await supabase.from("towmast").select().eq("dispnum", dispatchNum).maybeSingle()

      if (!error && data) {
        handleInvoiceFound(data.dispnum, foxtow_id)
      }
    }
    getDispatchNum()
  }, [dispatchNum])

  const handleSave = () => {
    return {
      dispatch: formState.dispatch,
      invoice: formState.invoice,
      items: formState.items,
      driver: formState.driver,
    }
  }

  const handleNew = (invoiceNumber:any) => {
    resetForm()
    updateDispatch({ dispnum: invoiceNumber })
  }

  const handleInvoiceFound = async (dispatchNumber:any, foxtow_id:any) => {
    resetForm()
    const { invoice, driver, dispatch, items } = await fetchTowData(dispatchNumber, foxtow_id)
    updateDispatch(dispatch)
    updateInvoice(invoice)
    updateDriver(driver)
    updateItems(items)
  }

  const handlePrint = () => {
    printInvoice({
      dispatch: formState.dispatch,
      invoice: formState.invoice,
      items: formState.items,
      driver: formState.driver,
    })
  }

  const handleKeyDown = (e:any, fieldName:any) => {
    const currentIndex = FIELD_INDEXES[fieldName] 

    if (e.key === "Enter") {
      e.preventDefault()
      const nextField = fieldOrder[currentIndex + 1]
      if (nextField) {
        inputRefs[nextField].current?.focus()
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prevField = fieldOrder[currentIndex - 1]
      if (prevField) {
        inputRefs[prevField].current?.focus()
      }
    }
  }

  const sections = [
    <div key="actions" className="flex flex-wrap gap-2">
      <InvoiceSearch onInvoiceFound={handleInvoiceFound} className="flex-1 min-w-[200px]" />
      <NewButton onNew={handleNew} />
      <SaveButton onSave={handleSave} />
      <PrintButton onPrint={handlePrint} />
    </div>,
    <Header key="header" dispatchNumber={formState.dispatch.dispnum} />,
    <div key="general-wrapper">
      <FormSection title="Driver Information">
        <div className="flex flex-wrap items-center gap-x-1">
          <DriverCombobox
            label="Driver 1"
            title="master.driver"
            size="md"
            value={formState.driver.driver || ""}
            onChange={(value) => updateDriver({ driver: value })}
            onKeyDown={(e:any) => handleKeyDown(e, "driver")}
            ref={inputRefs.driver}
            inputRefs={inputRefs.driver}
            
          />
          <DriverCombobox
            label="Driver 2"
            title="master.driver2"
            size="md"
            value={formState.driver.driver2 || ""}
            onChange={(value) => updateDriver({ driver2: value })}
            onKeyDown={(e:any) => handleKeyDown(e, "driver2")}
            ref={inputRefs.driver2}
            inputRefs={inputRefs.driver2}

          />
          <div className="flex flex-wrap gap-2">
            <MilitaryTimeInput
              label="Received"
              title="drivetran.timerec"
              value={formState?.driver?.timerec || ""}
              onChange={(value) => updateDriver({ timerec: value })}
              onKeyDown={(e) => handleKeyDown(e, "timerec")}
              ref={inputRefs.timerec}
            />
            <MilitaryTimeInput
              label="En route"
              title="drivetran.timeinrt"
              value={formState?.driver?.timeinrt || ""}
              onChange={(value) => updateDriver({ timeinrt: value })}
              onKeyDown={(e) => handleKeyDown(e, "timeinrt")}
              ref={inputRefs.timeinrt}
            />
            <MilitaryTimeInput
              label="Arrived"
              title="drivetran.timearrive"
              value={formState?.driver?.timearrive || ""}
              onChange={(value) => updateDriver({ timearrive: value })}
              onKeyDown={(e) => handleKeyDown(e, "timearrive")}
              ref={inputRefs.timearrive}
            />
            <MilitaryTimeInput
              label="Loaded"
              title="drivetran.timeintow"
              value={formState?.driver?.timeintow || ""}
              onChange={(value) => updateDriver({ timeintow: value })}
              onKeyDown={(e) => handleKeyDown(e, "timeintow")}
              ref={inputRefs.timeintow}
            />
            <MilitaryTimeInput
              label="Cleared"
              title="drivetran.timeclear"
              value={formState?.driver?.timeclear || ""}
              onChange={(value) => updateDriver({ timeclear: value })}
              onKeyDown={(e) => handleKeyDown(e, "timeclear")}
              ref={inputRefs.timeclear}
            />
          </div>
        </div>
      </FormSection>

      {/* <FormSection title="A - General Information">
        <div className="space-y-0">
          <div className="flex flex-wrap gap-2">
            <DateInput
              className="h-10 text-[14px]"
              label="Date"
              title="master.towdate"
              size="sm"
              value={formState.dispatch.towdate || ""}
              onChange={(value) => updateDispatch({ towdate: value })}
              onKeyDown={(e) => handleKeyDown(e, "towdate")}
              ref={inputRefs.towdate}
            />
            <FormInput
              className="h-10 text-[14px]"
              label="Tag #"
              title="master.towtagnum"
              value={formState.dispatch.towtagnum || ""}
              onChange={(e) => updateDispatch({ towtagnum: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, "towtagnum")}
              ref={inputRefs.towtagnum}
            />
            <TruckCombobox
              label="Truck"
              title="master.trucknum"
              size="lg"
              value={formState.dispatch.trucknum || ""}
              onChange={(value) => updateDispatch({ trucknum: value })}
              onKeyDown={(e) => handleKeyDown(e, "trucknum")}
              ref={inputRefs.trucknum}
            />
            <FormInput
              label="Dispatcher"
              className="h-10 text-[14px]"
              title="master.dispatcher"
              value={formState.dispatch.dispatcher || ""}
              onChange={(e) => updateDispatch({ dispatcher: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, "dispatcher")}
              ref={inputRefs.dispatcher}
            />
            <KitCombobox
              label="Kit #"
              title="master.kitnum"
              size="md"
              value={formState.invoice.kitnum || ""}
              onChange={(value) => updateInvoice({ kitnum: value })}
              onKeyDown={(e) => handleKeyDown(e, "kitnum")}
              ref={inputRefs.kitnum}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FormInput
              className="h-10 text-[14px]"
              label="Member #"
              title="master.membernum"
              value={formState.invoice.membernum || ""}
              onChange={(e) => updateInvoice({ membernum: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, "membernum")}
              ref={inputRefs.membernum}
            />
            <DateInput
              className="h-10 text-[14px]"
              label="Expires"
              title="master.memberexp"
              size="sm"
              value={formState.invoice.memberexp || ""}
              onChange={(value) => updateInvoice({ memberexp: value })}
              onKeyDown={(e) => handleKeyDown(e, "memberexp")}
              ref={inputRefs.memberexp}
            />
            <FormInput
              className="h-10 text-[14px]"
              label="Value"
              title="master.value"
              value={formState.dispatch.value || ""}
              onChange={(e) => updateDispatch({ value: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, "value")}
              ref={inputRefs.value}
            />
            <DateInput
              className="h-10 text-[14px]"
              label="Date Stored"
              title="master.dateStored"
              size="sm"
              value={formState.invoice.dateStored || ""}
              onChange={(value) => updateInvoice({ dateStored: value })}
              onKeyDown={(e) => handleKeyDown(e, "dateStored")}
              ref={inputRefs.dateStored}
            />
            <AccountName
              label="Account Name"
              title="master.account"
              size="xl"
              value={formState.dispatch.callname || ""}
              onChange={(value:any) => updateDispatch({ callname: value })}
              onKeyDown={(e:any) => handleKeyDown(e, "callname")}
              ref={inputRefs.callname}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FormInput
              label="Who Called"
              className="h-10 text-[14px]"
              title="master.whocalled"
              value={formState.dispatch.whocalled || ""}
              onChange={(e) => updateDispatch({ whocalled: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, "whocalled")}
              ref={inputRefs.whocalled}
            />
            <PhoneInput
              label="Phone #"
              title="master.phone"
              className="h-10 text-[14px]"
              size="lg"
              value={formState.dispatch.callphone || ""}
              onChange={(value) => updateDispatch({ callphone: value })}
              onKeyDown={(e) => handleKeyDown(e, "callphone")}
              ref={inputRefs.callphone}
            />
            <FormInput
              className="h-10 text-[14px]"
              label="Reference #"
              title="master.refnum"
              value={formState.dispatch.refnumber || ""}
              onChange={(e) => updateDispatch({ refnumber: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, "refnumber")}
              ref={inputRefs.refnumber}
            />
          </div>
        </div>
      </FormSection> */}
    </div>,
  ]

  return <DesktopLayout sections={sections} />
}

export default InvoiceForm





















// // import { useDeviceType } from '../hooks/useDeviceType';
// import { useFormState } from "../hooks/useFormState";
// import { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { supabase } from "../lib/supabase";
// import DesktopLayout from "./layouts/DesktopLayout";
// import SaveButton from "./SaveButton";
// import NewButton from "./NewButton";
// import InvoiceSearch from "./search/InvoiceSearch";
// import Header from "./invoice/Header";
// import GeneralSection from "./GeneralSection";
// import DriverSection from "./DriverSection";
// // import VehicleSection from './VehicleSection';
// import VehicleDetailsSection from "./VehicleDetailsSection";
// import LocationSection from "./LocationSection";
// import NotesSection from "./NotesSection";
// import RegistrationSection from "./RegistrationSection";
// import InvoiceSection from "./InvoiceSection";
// import StorageSection from "./StorageSection";
// import LienSection from "./LienSection";
// import ChargesSection from "./ChargesSection";
// import { fetchTowData } from "../lib/saveHandlers";
// import PrintButton from "./invoices/PrintButton";
// import { printInvoice } from "../utils/printInvoice";
// import { useFocusNavigation } from "../hooks/useFocusNavigation";
// import FormSection from "./common/FormSection";
// import TruckCombobox from "./common/TruckCombobox";
// import KitCombobox from "./common/KitCombobox";
// import DateInput from "./common/DateInput";
// import FormInput from "./common/FormInput";
// import PhoneInput from "./common/PhoneInput";
// import Select from "react-select";
// import React, { useState } from "react";
// import DriverCombobox from "./common/DriverCombobox";
// import MilitaryTimeInput from "./common/MilitaryTimeInput";

// interface AccountNameProps {
//   label: string;
//   title: string;
//   size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
//   value?: string;
//   onChange?: (value: string) => void;
//   onEnterPress?: () => void;
//   onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
// }

// // this is account Name
// const AccountName = React.forwardRef<HTMLInputElement, AccountNameProps>(
//   (
//     {
//       label,
//       title,
//       size = "md",
//       value = "",
//       onChange,
//       onEnterPress,
//       onKeyDown,
//     },
//     ref
//   ) => {
//     const [companies, setCompanies] = useState<any[]>([]);
//     const [selectedOption, setSelectedOption] = useState<any | null>(null);
//     const [menuIsOpen, setMenuIsOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");

//     const sizeClasses = {
//       xs: "5rem",
//       sm: "8rem",
//       md: "12rem",
//       lg: "30ch",
//       xl: "100%",
//       full: "100%",
//     };

//     const fetchCompanies = async () => {
//       const { data, error } = await supabase
//         .from("customer")
//         .select("custname,custnum")
//         .ilike("custname", `%${searchTerm}%`)
//         .ilike("custnum", `%${searchTerm}%`)
//         .limit(10);

//       if (!error && data) {
//         const result = data.map((item) => ({
//           value: item.custname,
//           label: `${item.custname} (${item.custnum})`,
//         }));
//         setCompanies(result);
//       }
//     };

//     useEffect(() => {
//       const debounce = setTimeout(fetchCompanies, 300);
//       return () => clearTimeout(debounce);
//     }, [searchTerm]);

//     useEffect(() => {
//       if (value) {
//         const option = companies.find((company) => company.value === value);
//         if (option) {
//           setSelectedOption(option);
//         }
//       } else {
//         setSelectedOption(null);
//       }
//     }, [value, companies]);

//     const handleChange = (option: any | null, actionMeta: any) => {
//       setSelectedOption(option);
//       if (option) {
//         onChange?.(option.value);
//         if (actionMeta.action === "select-option" && onEnterPress) {
//           setTimeout(onEnterPress, 0);
//         }
//       } else {
//         onChange?.("");
//       }
//     };

//     // const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
//     //   if (e.key === "Enter" && !menuIsOpen && onEnterPress) {
//     //     e.preventDefault();
//     //     onEnterPress();
//     //   }
//     // };
//     const handleKeyDown = (e: any) => {
//       if (onKeyDown) {
//         onKeyDown(e);
//       }
//     };
//     const handleInputChange = (inputValue: string) => {
//       setSearchTerm(inputValue);
//     };

//     const customStyles = {
//       control: (provided: any, state: { isFocused: boolean }) => ({
//         ...provided,
//         borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
//         "&:hover": {
//           borderColor: state.isFocused ? "#3B82F6" : "#9CA3AF",
//         },
//         boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
//         minHeight: "38px",
//       }),
//       option: (
//         provided: any,
//         state: { isSelected: boolean; isFocused: boolean }
//       ) => ({
//         ...provided,
//         backgroundColor: state.isSelected
//           ? "#3B82F6"
//           : state.isFocused
//           ? "#F3F4F6"
//           : "white",
//         color: state.isSelected ? "white" : "#111827",
//         cursor: "pointer",
//         "&:active": {
//           backgroundColor: "#3B82F6",
//           color: "white",
//         },
//       }),
//       menu: (provided: any) => ({
//         ...provided,
//         boxShadow:
//           "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
//         borderRadius: "0.375rem",
//         zIndex: 1000,
//       }),
//       menuList: (provided: any) => ({
//         ...provided,
//         padding: "4px",
//       }),
//       input: (provided: any) => ({
//         ...provided,
//         color: "#111827",
//       }),
//     };

//     return (
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//         </label>
//         <div style={{ width: sizeClasses[size] }}>
//           <Select
//             ref={ref as any}
//             value={selectedOption}
//             onChange={handleChange}
//             options={companies}
//             styles={customStyles}
//             placeholder="Select a company"
//             isClearable
//             isSearchable
//             onKeyDown={handleKeyDown}
//             menuIsOpen={menuIsOpen}
//             onInputChange={handleInputChange}
//             onMenuOpen={() => setMenuIsOpen(true)}
//             onMenuClose={() => setMenuIsOpen(false)}
//             backspaceRemovesValue={true}
//             blurInputOnSelect={true}
//             captureMenuScroll={true}
//             closeMenuOnSelect={true}
//             filterOption={null}
//             noOptionsMessage={() => "No companies found"}
//           />
//         </div>
//       </div>
//     );
//   }
// );

// const InvoiceForm = () => {
//   const {
//     formState,
//     updateDispatch,
//     updateInvoice,
//     updateItems,
//     resetForm,
//     updateDriver,
//   } = useFormState();
//   const location = useLocation();
//   const { dispatchNum } = location.state;

//   // Create refs for each section
//   const driverSectionRef = useRef<HTMLDivElement>(null);
//   const generalSectionRef = useRef<HTMLDivElement>(null);
//   const vehicleDetailsSectionRef = useRef<HTMLDivElement>(null);
//   const locationSectionRef = useRef<HTMLDivElement>(null);
//   const notesSectionRef = useRef<HTMLDivElement>(null);
//   const invoiceSectionRef = useRef<HTMLDivElement>(null);
//   const registrationSectionRef = useRef<HTMLDivElement>(null);
//   const storageSectionRef = useRef<HTMLDivElement>(null);
//   const lienSectionRef = useRef<HTMLDivElement>(null);
//   const chargesSectionRef = useRef<HTMLDivElement>(null);

//   const sectionRefs = [
//     driverSectionRef,
//     generalSectionRef,
//     vehicleDetailsSectionRef,
//     locationSectionRef,
//     notesSectionRef,
//     invoiceSectionRef,
//     registrationSectionRef,
//     storageSectionRef,
//     lienSectionRef,
//     chargesSectionRef,
//   ];
//   useFocusNavigation(sectionRefs);

//   useEffect(() => {
//     const foxtow_id = localStorage.getItem("foxtow_id") || "";
//     const getDispatchNum = async () => {
//       const { data, error } = await supabase
//         .from("towmast")
//         .select()
//         .eq("dispnum", dispatchNum)
//         .maybeSingle();

//       if (!error && data) {
//         handleInvoiceFound(data.dispnum, foxtow_id);
//       }
//     };
//     getDispatchNum();
//   }, []);

//   const handleSave = () => {
//     return {
//       dispatch: formState.dispatch,
//       invoice: formState.invoice,
//       items: formState.items,
//       driver: formState.driver,
//     };
//   };

//   const handleNew = (invoiceNumber: string) => {
//     resetForm();
//     updateDispatch({ dispnum: invoiceNumber });
//   };

//   const handleInvoiceFound = async (
//     dispatchNumber: number,
//     foxtow_id: string
//   ) => {
//     resetForm();
//     const { invoice, driver, dispatch, items } = await fetchTowData(
//       dispatchNumber,
//       foxtow_id
//     );
//     updateDispatch(dispatch);
//     updateInvoice(invoice);
//     updateDriver(driver);
//     updateItems(items);
//   };

//   const handlePrint = () => {
//     printInvoice({
//       dispatch: formState.dispatch,
//       invoice: formState.invoice,
//       items: formState.items,
//       driver: formState.driver,
//     });
//   };

//   // // Helper function to focus the first input in a section
//   // const focusSection = (ref: React.RefObject<HTMLDivElement>) => {
//   //   const focusableElement = ref.current?.querySelector('input, select, textarea, button') as HTMLElement;
//   //   if (focusableElement) {
//   //     focusableElement.focus();
//   //   }
//   // };

//   // const inputRefs = {
//   //   driver1: useRef<HTMLInputElement>(null),
//   //   driver2: useRef<HTMLInputElement>(null),
//   //   receivedRef: useRef<HTMLInputElement>(null),
//   //   enRouteRef: useRef<HTMLInputElement>(null),
//   //   arrivedRef: useRef<HTMLInputElement>(null),
//   //   loadedRef: useRef<HTMLInputElement>(null),
//   //   clearedRef: useRef<HTMLInputElement>(null),
//   //   date: useRef<HTMLInputElement>(null),
//   //   tag: useRef<HTMLInputElement>(null),
//   //   truck: useRef<HTMLInputElement>(null),
//   //   dispatcher: useRef<HTMLInputElement>(null),
//   //   kit: useRef<HTMLInputElement>(null),
//   //   memberNum: useRef<HTMLInputElement>(null),
//   //   memberExp: useRef<HTMLInputElement>(null),
//   //   value: useRef<HTMLInputElement>(null),
//   //   dateStored: useRef<HTMLInputElement>(null),
//   //   account: useRef<HTMLInputElement>(null),
//   //   whoCalled: useRef<HTMLInputElement>(null),
//   //   phone: useRef<HTMLInputElement>(null),
//   //   refNum: useRef<HTMLInputElement>(null),
//   //   vehicleSection: useRef<HTMLDivElement>(null),
//   // }
//   // const inputOrder = [
//   //   // "driver1",
//   //   // "driver2",
//   //   // "receivedRef",
//   //   // "enRouteRef",
//   //   // "arrivedRef",
//   //   // "loadedRef",
//   //   // "clearedRef",
//   //   "date",
//   //   "tag",
//   //   "truck",
//   //   "dispatcher",
//   //   "kit",
//   //   "memberNum",
//   //   "memberExp",
//   //   "value",
//   //   "dateStored",
//   //   "account",
//   //   "whoCalled",
//   //   "phone",
//   //   "refNum",
//   //   "vehicleSection",
//   // ]
//   //     const focusNextInput = (currentIndex: number) => {
//   //       const nextIndex = (currentIndex + 1) % inputOrder.length
//   //       const nextRef = inputRefs[inputOrder[nextIndex] as keyof typeof inputRefs]
//   //       if (nextRef.current) {
//   //         nextRef.current.focus()
//   //       }
//   //     }

//   //     const focusPreviousInput = (currentIndex: number) => {
//   //       const previousIndex = (currentIndex - 1 + inputOrder.length) % inputOrder.length
//   //       const previousRef = inputRefs[inputOrder[previousIndex] as keyof typeof inputRefs]
//   //       if (previousRef.current) {
//   //         previousRef.current.focus()
//   //       }
//   //     }

//   //   const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
//   //       console.log("Current index before timeout:", index);
//   //       if (e.key === "Enter") {
//   //         e.preventDefault();
//   //         setTimeout(() => {
//   //           console.log("Index after timeout:", index);
//   //           focusNextInput(index);
//   //         }, 0);
//   //       } else if (e.key === "ArrowUp") {
//   //         e.preventDefault();
//   //         setTimeout(() => {
//   //           focusPreviousInput(index);
//   //         }, 0);
//   //       }
//   //     };

  



//   const FIELD_INDEXES:any = {
//     driver: 0,
//     driver2: 1,
//     timerec: 2,
//     timeinrt: 3,
//     timearrive: 4,
//     timeintow: 5,
//     timeclear: 6,
//     // state: 7,
//     // zip: 8,
//     // contact: 9,
//   };  
 
//   const inputRefs:any = {
//     driver: useRef(null),
//     driver2: useRef(null),
//     timerec: useRef(null),
//     timeinrt: useRef(null),
//     timearrive: useRef(null),
//     timeintow: useRef(null),
//     timeclear: useRef(null),
//     // state: useRef(null),
//     // zip: useRef(null),
//     // contact: useRef(null),
//   };

//   const fieldOrder:any = [
//     "driver",
//     "driver2",
//     "timerec",
//     "timeinrt",
//     "timearrive",
//     "timeintow",
//     "timeclear",
//     // "state",
//     // "zip",
//     // "contact",
//   ];



//   const handleKeyDown = (e:any, fieldName:any) => {
//     const currentIndex = FIELD_INDEXES[fieldName];
//     console.log(currentIndex, fieldName, "currentIndex");

//     if (e.key === "Enter") {
//       if (fieldName === "textBox" && e.shiftKey) {
//         // Allow Shift+Enter to create a new line in the textarea
//         return;
//       }

//       e.preventDefault();
//       // const isLastField =
//       //   currentIndex === Object.keys(FIELD_INDEXES).length - 1;

//       // if (isLastField) {
//       //   console.log("Last field reached, triggering submit button click...");
//       //   document.getElementById("submitButton").click();
//       //   return;
//       // }
//       // if (fieldName === "select") {
//       //   console.log("slect this is select");
//       //   const selectElement = document.querySelector(".react-select__menu");
//       //   if (selectElement) {
//       //     window._keyboardNavigation = true;
//       //     const selectInstance = inputRefs[fieldName]?.current;
//       //     if (selectInstance) {
//       //       const selectedOption = selectInstance.props.options.find(
//       //         (opt) =>
//       //           opt.label ===
//       //           document.querySelector(".react-select__option--is-focused")
//       //             ?.innerText
//       //       );
//       //       if (selectedOption) {
//       //         console.log("Selected Value:", selectedOption.value);
//       //       }
//       //       if (selectedOption) {
//       //         setFormData((prevState) => ({
//       //           ...prevState,
//       //           select: {
//       //             label: selectedOption.label,
//       //             value: selectedOption.value,
//       //           },
//       //         }));
//       //       }
//       //     }
//       //     setTimeout(() => {
//       //       if (formData.select) {
//       //         const nextField = Object.keys(FIELD_INDEXES).find(
//       //           (key) => FIELD_INDEXES[key] === currentIndex + 1
//       //         );
//       //         if (nextField) inputRefs[nextField].current?.focus();
//       //       }
//       //     }, 100);
//       //     return;
//       //   }
//       // }
//       const nextField = Object.keys(FIELD_INDEXES).find(
//         (key) => FIELD_INDEXES[key] === currentIndex + 1
//       );
//       if (nextField) inputRefs[nextField].current?.focus();
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       const prevField = Object.keys(FIELD_INDEXES).find(
//         (key) => FIELD_INDEXES[key] === currentIndex - 1
//       );
//       if (prevField) inputRefs[prevField].current?.focus();
//     }
//   };

//   const sections = [
//     // Top actions and header
//     <div key="actions" className="flex flex-wrap gap-2">
//       <InvoiceSearch
//         onInvoiceFound={handleInvoiceFound}
//         className="flex-1 min-w-[200px]"
//       />
//       <NewButton onNew={handleNew} />
//       <SaveButton onSave={handleSave} />
//       <PrintButton onPrint={handlePrint} />
//     </div>,
//     <Header key="header" dispatchNumber={formState.dispatch.dispnum} />,

//     // // Driver info
//     // <div ref={driverSectionRef} key="driver-wrapper">
//     //   <DriverSection
//     //     key="driver"
//     //     driver={formState.driver}
//     //     onUpdateDriver={updateDriver}
//     //     ref={driverSectionRef}
//     //     // handleKeyDown={handleKeyDown}
//     //     // inputRefs={inputRefs}
//     //     // onEnterPress={() => focusSection(generalSectionRef)}
//     //   />
//     //  </div>,
//     <div key="general-wrapper">
//       <FormSection title="Driver Information">
//         <div className="flex flex-wrap items-center gap-x-1">
//           <DriverCombobox
//             label="Driver 1"
//             title="master.driver"
//             size="md"
//             value={formState.driver.driver || ""}
//             onChange={(value) => updateDriver({ driver: value })}
//             onKeyDown={(e:any) => handleKeyDown(e, "driver")}
//             ref={inputRefs.driver}
//             // onKeyDown={(e:any) => handleKeyDown(e, 0)}
//             // ref={inputRefs.driver1}
//           />
//           <DriverCombobox
//             label="Driver 2"
//             title="master.driver2"
//             size="md"
//             value={formState.driver.driver2 || ""}
//             onChange={(value) => updateDriver({ driver2: value })}
//             onKeyDown={(e:any) => handleKeyDown(e, "driver2")}
//             ref={inputRefs.driver2}
//             // onKeyDown={(e:any) => handleKeyDown(e, 1)}
//             // ref={inputRefs.driver2}
//           />
//           <div className="flex flex-wrap gap-2">
//             <MilitaryTimeInput
//               label="Received"
//               title="drivetran.timerec"
//               value={formState?.driver?.timerec || ""}
//               onChange={(value) => updateDriver({ timerec: value })}
//               // onKeyDown={(e:any) => handleKeyDown(e, "timerec")}
//             // ref={inputRefs.timerec}
//               // onChange={(field:any, value:any) => updateDriver({ [field]: value })}

//               // inputRef={inputRefs.receivedRef}
//               // onKeyDown={(e:any) => handleKeyDown(e, 2)}
//             />
//             <MilitaryTimeInput
//               label="En route"
//               title="drivetran.timeinrt"
//               value={formState?.driver?.timeinrt || ""}
//               onChange={(value) => updateDriver({ timeinrt: value })}
//               // onChange={(value) => onTimeChange('timeinrt', value)}
//               // inputRef={inputRefs.enRouteRef}
//               // onKeyDown={(e:any)=>handleKeyDown(e,3)}
//             />

//             <MilitaryTimeInput
//               label="Arrived"
//               title="drivetran.timearrive"
//               value={formState?.driver?.timearrive || ""}
//               // onChange={(value) => onTimeChange('timearrive', value)}
//               onChange={(value) => updateDriver({ timearrive: value })}

//               // inputRef={inputRefs.arrivedRef}
//               // onKeyDown={(e:any)=>handleKeyDown(e,4)}
//             />
//             <MilitaryTimeInput
//               label="Loaded"
//               title="drivetran.timeintow"
//               value={formState?.driver?.timeintow || ""}
//               onChange={(value) => updateDriver({ timeintow: value })}
//               // onChange={(value) => ('timeintow', value)}
//               // inputRef={inputRefs.loadedRef}
//               // onKeyDown={(e:any)=>handleKeyDown(e,4)}
//             />
//             <MilitaryTimeInput
//               label="Cleared"
//               title="drivetran.timeclear"
//               value={formState?.driver?.timeclear || ""}
//               onChange={(value) => updateDriver({ timeclear: value })}
//               // onChange={(value) => onTimeChange('timeclear', value)}
//               // onEnterPress={onEnterPress}
//               // inputRef={inputRefs.clearedRef}
//               // onKeyDown={(e:any)=>handleKeyDown(e,4)}
//             />
//           </div>
//           {/* <div className="flex-grow">
//             <StatusSection
//               handleKeyDown={handleKeyDown}
//               inputRefs={inputRefs}
//               times={driver}
//               onTimeChange={(field, value) => onUpdateDriver({ [field]: value })}
//             />
//           </div> */}
//         </div>
//       </FormSection>

//       <FormSection title="A - General Information">
//         <div className="space-y-0">
//           <div className="flex flex-wrap gap-2">
//             <DateInput
//               // ref={inputRefs.date}
//               className="h-10 text-[14px]"
//               label="Date"
//               title="master.towdate"
//               size="sm"
//               value={formState.dispatch.towdate || ""}
//               onChange={(value) => updateDispatch({ towdate: value })}
//               // onKeyDown={(e) => handleKeyDown(e, 0)}
//             />
//             <FormInput
//               // ref={inputRefs.tag}
//               className="h-10 text-[14px]"
//               label="Tag #"
//               title="master.towtagnum"
//               value={formState.dispatch.towtagnum || ""}
//               onChange={(e) => updateDispatch({ towtagnum: e.target.value })}
//               // onKeyDown={(e) => handleKeyDown(e, 1)}
//             />
//             <TruckCombobox
//               // ref={inputRefs.truck}
//               label="Truck"
//               title="master.trucknum"
//               size="lg"
//               value={formState.dispatch.trucknum || ""}
//               onChange={(value) => updateDispatch({ trucknum: value })}
//               // onKeyDown={(e) => handleKeyDown(e, 2)}
//             />
//             <FormInput
//               // ref={inputRefs.dispatcher}
//               label="Dispatcher"
//               className="h-10 text-[14px]"
//               title="master.dispatcher"
//               value={formState.dispatch.dispatcher || ""}
//               onChange={(e) => updateDispatch({ dispatcher: e.target.value })}
//               // onKeyDown={(e) => handleKeyDown(e, 3)}
//             />
//             <KitCombobox
//               // ref={inputRefs.kit}
//               label="Kit #"
//               title="master.kitnum"
//               size="md"
//               value={formState.invoice.kitnum || ""}
//               onChange={(value) => updateInvoice({ kitnum: value })}
//               // onKeyDown={(e) => handleKeyDown(e, 4)}
//             />
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <FormInput
//               // ref={inputRefs.memberNum}
//               className="h-10 text-[14px]"
//               label="Member #"
//               title="master.membernum"
//               value={formState.invoice.membernum || ""}
//               onChange={(e) => updateInvoice({ membernum: e.target.value })}
//               // onKeyDown={(e) => handleKeyDown(e, 5)}
//             />
//             <DateInput
//               // ref={inputRefs.memberExp}
//               className="h-10 text-[14px]"
//               label="Expires"
//               title="master.memberexp"
//               size="sm"
//               value={formState.invoice.memberexp || ""}
//               onChange={(value) => updateInvoice({ memberexp: value })}
//               // onKeyDown={(e) => handleKeyDown(e, 6)}
//             />
//             <FormInput
//               // ref={inputRefs.value}
//               className="h-10 text-[14px]"
//               label="Value"
//               title="master.value"
//               value={formState.dispatch.value || ""}
//               onChange={(e) => updateDispatch({ value: e.target.value })}
//               // onKeyDown={(e) => handleKeyDown(e, 7)}
//             />
//             <DateInput
//               // ref={inputRefs.dateStored}
//               className="h-10 text-[14px]"
//               label="Date Stored"
//               title="master.dateStored"
//               size="sm"
//               value={formState.invoice.dateStored || ""}
//               onChange={(value) => updateInvoice({ dateStored: value })}
//               // onKeyDown={(e) => handleKeyDown(e, 8)}
//             />
//             <AccountName
//               // ref={inputRefs.account}
//               label="Account Name"
//               title="master.account"
//               size="xl"
//               value={formState.dispatch.callname || ""}
//               onChange={(value) => updateDispatch({ callname: value })}
//               // onKeyDown={(e) => handleKeyDown(e, 9)}
//             />
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <FormInput
//               // ref={inputRefs.whoCalled}
//               label="Who Called"
//               className="h-10 text-[14px]"
//               title="master.whocalled"
//               value={formState.dispatch.whocalled || ""}
//               onChange={(e) => updateDispatch({ whocalled: e.target.value })}
//               // onKeyDown={(e) => handleKeyDown(e, 10)}
//             />
//             <PhoneInput
//               // ref={inputRefs.phone}
//               label="Phone #"
//               title="master.phone"
//               className="h-10 text-[14px]"
//               size="lg"
//               value={formState.dispatch.callphone || ""}
//               onChange={(value) => updateDispatch({ callphone: value })}
//               // onKeyDown={(e) => handleKeyDown(e, 11)}
//             />
//             <FormInput
//               // ref={inputRefs.refNum}
//               className="h-10 text-[14px]"
//               label="Reference #"
//               title="master.refnum"
//               value={formState.dispatch.refnumber || ""}
//               onChange={(e) => updateDispatch({ refnumber: e.target.value })}
//               // onKeyDown={(e) => handleKeyDown(e, 12)}
//             />
//           </div>
//           {/* this is vehiclesecion */}
//           {/* <div ref={inputRefs.vehicleSection} className="">
//             <VehicleSection
//               dispatch={dispatch}
//               onDispatchChange={onDispatchChange}
//               // onKeyDown={(e) => handleKeyDown(e, 13)}
//             />
//           </div> */}
//         </div>
//       </FormSection>
//       {/* <GeneralSection 
//          key="general"
//         dispatch={formState.dispatch}
//         onDispatchChange={updateDispatch}
//         invoice={formState.invoice}
//         onInvoiceChange={updateInvoice}
//         ref={generalSectionRef}
//         // handleKeyDown={handleKeyDown}
//         // inputRefs={inputRefs}
//         // onEnterPress={() => focusSection(vehicleDetailsSectionRef)}
//       /> */}
//     </div>,
//     // <div ref={vehicleDetailsSectionRef} key="vehicle-details-wrapper">
//     //   <VehicleDetailsSection
//     //   key="vehicle-details"
//     //   // ref={vehicleDetailsSectionRef}
//     //     odometer={formState.dispatch.odometer}
//     //     condition={formState.dispatch.condition}
//     //     reason={formState.dispatch.reason}
//     //     onChange={(field, value) => updateDispatch({ [field]: value })}
//     //     // onEnterPress={() => focusSection(locationSectionRef)}
//     //   />
//     // </div>,
//     // <div ref={locationSectionRef} key="location-wrapper">
//     //   <LocationSection
//     //      key="location"
//     //     dispatch={formState.dispatch}
//     //     onDispatchChange={updateDispatch}
//     //     // ref={locationSectionRef}
//     //     // onEnterPress={() => focusSection(notesSectionRef)}
//     //   />
//     // </div>,
//     // <div ref={notesSectionRef} key="notes-wrapper">
//     //   <NotesSection
//     //   key="notes"
//     //   // ref={notesSectionRef}
//     //     value={formState.dispatch.callremark || ''}
//     //     onChange={(notes) => updateDispatch({ 'callremark': notes })}
//     //     // onEnterPress={() => focusSection(invoiceSectionRef)}
//     //   />
//     // </div>,
//     // <div ref={invoiceSectionRef} key="invoice-wrapper">
//     //   <InvoiceSection
//     //   key="invoice"
//     //   // ref={invoiceSectionRef}
//     //     invoice={formState.invoice}
//     //     onInvoiceChange={updateInvoice}
//     //     // onEnterPress={() => focusSection(registrationSectionRef)}
//     //   />
//     // </div>,
//     // <div ref={registrationSectionRef} key="registration-wrapper">
//     //   <RegistrationSection
//     //   key="registration"
//     //   // ref={registrationSectionRef}
//     //     invoice={formState.invoice}
//     //     onInvoiceChange={updateInvoice}
//     //     dispatch={formState.dispatch}
//     //     onDispatchChange={updateDispatch}
//     //     // onEnterPress={() => focusSection(storageSectionRef)}
//     //   />
//     // </div>,
//     // <div ref={storageSectionRef} key="storage-wrapper">
//     //   <StorageSection
//     //   key="storage"
//     //   // ref={storageSectionRef}
//     //     dispatch={formState.dispatch}
//     //     onDispatchChange={updateDispatch}
//     //     // onEnterPress={() => focusSection(lienSectionRef)}
//     //   />
//     // </div>,
//     // <div ref={lienSectionRef} key="lien-wrapper">
//     //   <LienSection
//     //   key="lien"
//     //   // ref={lienSectionRef}
//     //     dispatch={formState.dispatch}
//     //     onDispatchChange={updateDispatch}
//     //     // onEnterPress={() => focusSection(chargesSectionRef)}
//     //   />
//     // </div>,
//     // <div ref={chargesSectionRef} key="charges-wrapper">
//     //   <ChargesSection
//     //   key="charges"
//     //   // ref={chargesSectionRef}
//     //     transactionItems={formState.items || []}
//     //     onItemsChange={updateItems}
//     //     invoice={formState.invoice}
//     //     onInvoiceChange={updateInvoice}
//     //   />
//     // </div>
//   ];

//   return <DesktopLayout sections={sections} />;
// };

// export default InvoiceForm;
