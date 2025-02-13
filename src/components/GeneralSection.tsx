import React, { useState, useEffect, useRef } from "react";
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
}

interface AccountNameProps {
  label: string;
  title: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  value?: string;
  onChange?: (value: string) => void;
  onEnterPress?: () => void;
}

const AccountName = React.forwardRef<HTMLInputElement, AccountNameProps>(
  ({ label, title, size = "md", value = "", onChange, onEnterPress }, ref) => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<any | null>(null);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const sizeClasses = {
      xs: "5rem",
      sm: "8rem",
      md: "12rem",
      lg: "30ch",
      xl: "39.5rem",
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter" && !menuIsOpen && onEnterPress) {
        e.preventDefault();
        onEnterPress();
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

const GeneralSection: React.FC<GeneralSectionProps> = ({
  dispatch,
  invoice,
  onDispatchChange,
  onInvoiceChange,
  onEnterPress,
}) => {
  const tagRef = useRef<HTMLInputElement>(null);
  const truckRef = useRef<HTMLInputElement>(null);
  const dispatcherRef = useRef<HTMLInputElement>(null);
  const kitRef = useRef<HTMLInputElement>(null);
  const memberNumRef = useRef<HTMLInputElement>(null);
  const memberExpRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const dateStoredRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLInputElement>(null);
  const whoCalledRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const refNumRef = useRef<HTMLInputElement>(null);
  const vehicleSectionRef = useRef<HTMLDivElement>(null);

  const focusVehicleSection = () => {
    const firstInput = vehicleSectionRef.current?.querySelector(
      "input"
    ) as HTMLElement;
    if (firstInput) {
      firstInput.focus();
    } else if (onEnterPress) {
      onEnterPress();
    }
  };

  return (
    <FormSection title="A - General Information">
      <div className="space-y-0">
        <div className="flex flex-wrap gap-2">
          <DateInput
            className="h-10 text-[14px]"
            label="Date"
            title="master.towdate"
            size="sm"
            value={dispatch.towdate || ""}
            onChange={(value) => onDispatchChange({ towdate: value })}
            onEnterPress={() => tagRef.current?.focus()}
          />
          <FormInput
            ref={tagRef}
            className="h-10 text-[14px]"
            label="Tag #"
            title="master.towtagnum"
            value={dispatch.towtagnum || ""}
            onChange={(e) => onDispatchChange({ towtagnum: e.target.value })}
            onEnterPress={() => truckRef.current?.focus()}
          />
          <TruckCombobox
            ref={truckRef}
            label="Truck"
            title="master.trucknum"
            size="lg"
            value={dispatch.trucknum || ""}
            onChange={(value) => onDispatchChange({ trucknum: value })}
            onEnterPress={() => dispatcherRef.current?.focus()}
          />
          <FormInput
            ref={dispatcherRef}
            label="Dispatcher"
            className="h-10 text-[14px]"
            title="master.dispatcher"
            value={dispatch.dispatcher || ""}
            onChange={(e) => onDispatchChange({ dispatcher: e.target.value })}
            onEnterPress={() => kitRef.current?.focus()}
          />
          <KitCombobox
            ref={kitRef}
            label="Kit #"
            title="master.kitnum"
            size="md"
            value={invoice.kitnum || ""}
            onChange={(value) => onInvoiceChange({ kitnum: value })}
            onEnterPress={() => memberNumRef.current?.focus()}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FormInput
            ref={memberNumRef}
            className="h-10 text-[14px]"
            label="Member #"
            title="master.membernum"
            value={invoice.membernum || ""}
            onChange={(e) => onInvoiceChange({ membernum: e.target.value })}
            onEnterPress={() => memberExpRef.current?.focus()}
          />
          <DateInput
            ref={memberExpRef}
            className="h-10 text-[14px]"
            label="Expires"
            title="master.memberexp"
            size="sm"
            value={invoice.memberexp || ""}
            onChange={(value) => onInvoiceChange({ memberexp: value })}
            onEnterPress={() => valueRef.current?.focus()}
          />
          <FormInput
            ref={valueRef}
            className="h-10 text-[14px]"
            label="Value"
            title="master.value"
            value={dispatch.value || ""}
            onChange={(e) => onDispatchChange({ value: e.target.value })}
            onEnterPress={() => dateStoredRef.current?.focus()}
          />
          <DateInput
            ref={dateStoredRef}
            className="h-10 text-[14px]"
            label="Date Stored"
            title="master.dateStored"
            size="sm"
            value={invoice.dateStored || ""}
            onChange={(value) => onInvoiceChange({ dateStored: value })}
            onEnterPress={() => accountRef.current?.focus()}
          />
        </div>
       
        <AccountName
          ref={accountRef}
          label="Account Name"
          title="master.account"
          size="xl"
          value={dispatch.callname || ""}
          onChange={(value) => onDispatchChange({ callname: value })}
          onEnterPress={() => whoCalledRef.current?.focus()}
        />
        <div className="flex flex-wrap gap-2">
          <FormInput
            ref={whoCalledRef}
            label="Who Called"
            className="h-10 text-[14px]"
            title="master.whocalled"
            value={dispatch.whocalled || ""}
            onChange={(e) => onDispatchChange({ whocalled: e.target.value })}
            onEnterPress={() => phoneRef.current?.focus()}
          />
          <PhoneInput
            ref={phoneRef}
            label="Phone #"
            title="master.phone"
            className="h-10 text-[14px]"
            size="lg"
            value={dispatch.callphone || ""}
            onChange={(value) => onDispatchChange({ callphone: value })}
            onEnterPress={() => refNumRef.current?.focus()}
          />
          <FormInput
            ref={refNumRef}
            className="h-10 text-[14px]"
            label="Reference #"
            title="master.refnum"
            value={dispatch.refnumber || ""}
            onChange={(e) => onDispatchChange({ refnumber: e.target.value })}
            onEnterPress={focusVehicleSection}
          />
        </div>
        
        <div ref={vehicleSectionRef} className="">
          <VehicleSection
            dispatch={dispatch} 
            onDispatchChange={onDispatchChange}
            onEnterPress={onEnterPress}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default GeneralSection;
