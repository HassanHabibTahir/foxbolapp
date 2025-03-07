import React, { useRef, useEffect, useState } from "react";
import { useFormState } from "../hooks/useFormState";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import DesktopLayout from "./layouts/DesktopLayout";
import SaveButton from "./SaveButton";
import NewButton from "./NewButton";
import InvoiceSearch from "./search/InvoiceSearch";
import Header from "./invoice/Header";
import FormSection from "./common/FormSection";
import TruckCombobox from "./common/TruckCombobox";
import KitCombobox from "./common/KitCombobox";
import DateInput from "./common/DateInput";
import FormInput from "./common/FormInput";
import PhoneInput from "./common/PhoneInput";
import DriverCombobox from "./common/DriverCombobox";
import MilitaryTimeInput from "./common/MilitaryTimeInput";
import { fetchTowData } from "../lib/saveHandlers";
import PrintButton from "./invoices/PrintButton";
import { printInvoice } from "../utils/printInvoice";
import StateInput from "./common/StateInput";
import { Search } from "lucide-react";
import { lookupLicensePlate } from "../lib/licenseLookup";
import VinLookupField from "./VinLookupField";
import AddressAutocomplete from "./common/AddressAutocomplete";
import NotesSection from "./NotesSection";
import ZipInput from "./common/ZipInput";
// import LienSection from "./LienSection";
import AccountName from "./common/AccountName";
import BooleanSelect from "./common/BooleanSelector";
import LienTypeInput from "./common/LienTypeInput";
import LienFeeSelect from "./common/LienFeeSelect";
import ChargesSection from "./ChargesSection";
import VehicleReasonsSelect from "./common/VehicleReasons";
import DollarFormInput from "./common/DollarFormInput";
import ColorSelect from "./common/ColorSelect";
import NumberInput from "./common/NumbeInput";
import CarMake from "./common/CarMake";
import CarMakeModels from "./common/CarModels";
import ConditionSelect from "./common/ConditionSelect";
import YearSlects from "./common/YearSelect";
import StateSelect from "./common/StateSelect";
import AddressSection from "./addressSection";
import { useMediaQuery } from "react-responsive";
// import VehicleDetailsSection from "./VehicleDetailsSection";

const FIELD_INDEXES: any = {
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
  type: 20,
  yearcar: 21,
  makecar: 22,
  modelcar: 23,
  colorcar: 24,
  bodytype: 25,
  licensest: 26,
  licensenum: 27,
  tagmonthyear: 28,
  vin: 29,
  odometer: 30,
  condition: 31,
  reason: 32,
  towedfrom: 33,
  towedto: 34,
  retowto: 35,
  lotsection: 36,
  calltype: 37,
  keysinfo: 38,
  holdnote: 39,
  notes: 40,
  invoicenum: 41,
  invdate: 42,
  itemgroup: 43,
  inreason: 44,
  billtoname: 45,
  ponumber: 46,
  billtoaddr1: 47,
  releaselic: 48,
  billtoaddr2: 49,
  billtophone: 50,
  billtocont: 51,
  billtocity: 52,
  billtost: 53,
  billtozip: 54,
  regname: 55,
  rtype: 56,
  auct_num: 57,
  regaddr1: 58,
  regcity: 59,
  regstate: 60,
  regzip: 61,
  datein: 62,
  dateout: 63,
  commission: 64,
  liendin: 65,
  liendout: 66,
  lientype: 67,
  lienfee: 68,
  description69: 69,
  description70: 70,
  description71: 71,
  description72: 72,
  description73: 73,
  description74: 74,
  description75: 75,
  description76: 76,
  description77: 77,
  description78: 78,
  description79: 79,
  description80: 80,
  //commit both
  // description81: 81,
  // description82: 82,
  //
  description83: 83,
};

const fieldOrder = Object.keys(FIELD_INDEXES);

const InvoiceForm = () => {
  const {
    formState,
    updateDispatch,
    updateInvoice,
    updateItems,
    resetForm,
    updateDriver,
  } = useFormState();
  const location = useLocation();
  const { dispatchNum } = location.state;

  const driverRef = useRef(null);
  const driver2Ref = useRef(null);
  const timerecRef = useRef(null);
  const timeinrtRef = useRef(null);
  const timearriveRef = useRef(null);
  const timeintowRef = useRef(null);
  const timeclearRef = useRef(null);
  const towdateRef = useRef(null);
  const towtagnumRef = useRef(null);
  const trucknumRef = useRef(null);
  const dispatcherRef = useRef(null);
  const kitnumRef = useRef(null);
  const membernumRef = useRef(null);
  const memberexpRef = useRef(null);
  const valueRef = useRef(null);
  const dateStoredRef = useRef(null);
  const callnameRef = useRef(null);
  const whocalledRef = useRef(null);
  const callphoneRef = useRef(null);
  const refnumberRef = useRef(null);
  const typeRef = useRef(null);
  const yearcarRef = useRef(null);
  const makecarRef = useRef(null);
  const modelcarRef = useRef(null);
  const colorcarRef = useRef(null);
  const bodytypeRef = useRef(null);
  const licensestRef = useRef(null);
  const licensenumRef = useRef(null);
  const tagmonthyearRef = useRef(null);
  const vinRef = useRef(null);
  const odometerRef = useRef(null);
  const conditionRef = useRef(null);
  const reasonRef = useRef(null);
  const towedfromRef = useRef(null);
  const towedtoRef = useRef(null);
  const retowtoRef = useRef(null);
  const lotsectionRef = useRef(null);
  const calltypeRef = useRef(null);
  const keysinfoRef = useRef(null);
  const holdnoteRef = useRef(null);
  const notesRef = useRef(null);
  const invoicenumRef = useRef(null);
  const invdateRef = useRef(null);
  const itemgroupRef = useRef(null);
  const inreasonRef = useRef(null);
  const billtonameRef = useRef(null);
  const ponumberRef = useRef(null);
  const billtoaddr1Ref = useRef(null);
  const releaselicRef = useRef(null);
  const billtoaddr2Ref = useRef(null);
  const billtophoneRef = useRef(null);
  const billtocityRef = useRef(null);
  const billtostRef = useRef(null);
  const billtozipRef = useRef(null);
  const billtocontRef = useRef(null);
  const regnameRef = useRef(null);
  const rtypeRef = useRef(null);
  const auct_numRef = useRef(null);
  const regaddr1Ref = useRef(null);
  const regcityRef = useRef(null);
  const regstateRef = useRef(null);
  const regzipRef = useRef(null);
  const dateinRef = useRef(null);
  const dateoutRef = useRef(null);
  const commissionRef = useRef(null);
  const liendinRef = useRef(null);
  const liendoutRef = useRef(null);
  const lientypeRef = useRef(null);
  const lienfeeRef = useRef(null);
  const description69Ref = useRef(null);
  const description70Ref = useRef(null);
  const description71Ref = useRef(null);
  const description72Ref = useRef(null);
  const description73Ref = useRef(null);
  const description74Ref = useRef(null);
  const description75Ref = useRef(null);
  const description76Ref = useRef(null);
  const description77Ref = useRef(null);
  const description78Ref = useRef(null);
  const description79Ref = useRef(null);
  const description80Ref = useRef(null);
  // const description81Ref = useRef(null);
  // const description82Ref = useRef(null);
  const description83Ref = useRef(null);

  const inputRefs: any = {
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
    type: typeRef,
    yearcar: yearcarRef,
    makecar: makecarRef,
    modelcar: modelcarRef,
    colorcar: colorcarRef,
    bodytype: bodytypeRef,
    licensest: licensestRef,
    licensenum: licensenumRef,
    tagmonthyear: tagmonthyearRef,
    vin: vinRef,
    odometer: odometerRef,
    condition: conditionRef,
    reason: reasonRef,
    towedfrom: towedfromRef,
    towedto: towedtoRef,
    retowto: retowtoRef,
    lotsection: lotsectionRef,
    calltype: calltypeRef,
    keysinfo: keysinfoRef,
    holdnote: holdnoteRef,
    notes: notesRef,
    invoicenum: invoicenumRef,
    invdate: invdateRef,
    itemgroup: itemgroupRef,
    inreason: inreasonRef,
    billtoname: billtonameRef,
    ponumber: ponumberRef,
    billtoaddr1: billtoaddr1Ref,
    releaselic: releaselicRef,
    billtoaddr2: billtoaddr2Ref,
    billtophone: billtophoneRef,
    billtocity: billtocityRef,
    billtost: billtostRef,
    billtozip: billtozipRef,
    billtocont: billtocontRef,
    regname: regnameRef,
    rtype: rtypeRef,
    auct_num: auct_numRef,
    regaddr1: regaddr1Ref,
    regcity: regcityRef,
    regstate: regstateRef,
    regzip: regzipRef,
    datein: dateinRef,
    dateout: dateoutRef,
    commission: commissionRef,
    liendin: liendinRef,
    liendout: liendoutRef,
    lientype: lientypeRef,
    lienfee: lienfeeRef,
    description69: description69Ref,
    description70: description70Ref,
    description71: description71Ref,
    description72: description72Ref,
    description73: description73Ref,
    description74: description74Ref,
    description75: description75Ref,
    description76: description76Ref,
    description77: description77Ref,
    description78: description78Ref,
    description79: description79Ref,
    description80: description80Ref,
    // description81: description81Ref,
    // description82: description82Ref,
    description83: description83Ref,
  };

  useEffect(() => {
    const foxtow_id = localStorage.getItem("foxtow_id") || "";
    const getDispatchNum = async () => {
      const { data, error } = await supabase
        .from("towmast")
        .select()
        .eq("dispnum", dispatchNum)
        .maybeSingle();

      if (!error && data) {
        handleInvoiceFound(data.dispnum, foxtow_id);
      }
    };
    getDispatchNum();
  }, [dispatchNum]);

  const handleSave = () => {
    return {
      dispatch: formState.dispatch,
      invoice: formState.invoice,
      items: formState.items,
      driver: formState.driver,
    };
  };

  const handleNew = (invoiceNumber: any) => {
    resetForm();
    console.log(invoiceNumber, "invoiceNumber");
    updateDispatch({ dispnum: invoiceNumber });
  };

  const handleInvoiceFound = async (dispatchNumber: any, foxtow_id: any) => {
    resetForm();
    const { invoice, driver, dispatch, items } = await fetchTowData(
      dispatchNumber,
      foxtow_id
    );
    updateDispatch(dispatch);
    updateInvoice(invoice);
    updateDriver(driver);
    updateItems(items);
  };

  const handlePrint = () => {
    printInvoice({
      dispatch: formState.dispatch,
      invoice: formState.invoice,
      items: formState.items,
      driver: formState.driver,
    });
  };

  const handleKeyDown = (e: any, fieldName: any) => {
    const currentIndex = FIELD_INDEXES[fieldName];
    if (currentIndex === 40|| currentIndex===47) {
      if (e.key === "Enter") {
        return;
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextField = fieldOrder[currentIndex + 1];
        if (nextField) {
          inputRefs[nextField].current?.focus();
        }
      }
    }

    if (e.key === "Enter" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextField = fieldOrder[currentIndex + 1];
      console.log(nextField, "nextField");
      if (nextField) {
        inputRefs[nextField].current?.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (currentIndex === 83) {
        e.preventDefault();
        const prevField = fieldOrder[currentIndex - 3];
        console.log(prevField, "prevField");
        if (prevField) {
          inputRefs[prevField].current?.focus();
        }
      }
      e.preventDefault();
      const prevField = fieldOrder[currentIndex - 1];
      console.log(prevField, "prevField");
      if (prevField) {
        inputRefs[prevField].current?.focus();
      }
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const expiresRef = useRef<HTMLInputElement>(null);
  const handleLookup = async () => {
    if (!formState.dispatch.licensenum || !formState.dispatch.licensest) {
      setError("Please enter both license plate and state");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const details = await lookupLicensePlate(
        formState.dispatch.licensenum,
        formState.dispatch.licensest
      );
      if (details) {
        console.log(details, "details");
        // onPlateDetails(details);
        updateDispatch((prev: any) => ({
          ...prev,
          vin: details.vin,
          yearcar: details.year,
          makecar: details.make,
          modelcar: details.model,
          colorcar: details.color,
        }));
      } else {
        setError("License plate not found");
      }
    } catch (err) {
      setError("Error looking up license plate");
      console.error("License plate lookup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVinDetails = (details: any) => {
    try {
      updateDispatch((prev: any) => ({
        ...prev,
        yearcar: details.year,
        makecar: details.make,
        modelcar: details.model,
        bodytype: details.bodyType,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setError(null);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [error]);

  const [carMakeId, setCarMakeId] = useState<string | null>(null);
  // const [isDesktopOrLaptop, setIsDesktop] = useState(false);
  // const [isDesktopOrLaptop2, setIsDesktop2] = useState(false);

  // useEffect(() => {
  //   const checkScreenSize = () => {
  //     setIsDesktop(window.matchMedia("(min-width: 1400px)").matches);
  //     setIsDesktop2(window.matchMedia("(min-width: 1100px)").matches);
  //   };

  //   checkScreenSize(); // Initial check
  //   window.addEventListener("resize", checkScreenSize); // Listen for screen changes

  //   return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  // }, []);


  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const showDesktop = useMediaQuery({ query: "(min-width: 1500px)" });
  const showDesktop2 =  useMediaQuery({ query: "(min-width: 1100px)" });

  const isDesktopOrLaptop = isClient && showDesktop;
  const isDesktopOrLaptop2 = isClient && showDesktop2;
  console.log(isDesktopOrLaptop,isDesktopOrLaptop2,"isDesktopOrLaptop")
  const sections = [
    <div key="actions" className="flex flex-wrap gap-2">
      <InvoiceSearch
        onInvoiceFound={handleInvoiceFound}
        className="flex-1 min-w-[200px]"
      />
      <NewButton onNew={handleNew} />
      <SaveButton onSave={handleSave} />
      <PrintButton onPrint={handlePrint} />
    </div>,
    <Header key="header" dispatchNumber={formState.dispatch.dispnum} />,
    <div key="general-wrapper">
      <FormSection title="Driver Information">
        <div className="flex flex-wrap items-center  gap-x-1">
          <DriverCombobox
            label="Driver 1"
            title="master.driver"
            size="md"
            className="h-8"
            value={formState.driver.driver || ""}
            onChange={(value) => updateDriver({ driver: value })}
            onKeyDown={(e: any) => handleKeyDown(e, "driver")}
            ref={inputRefs.driver}
            inputRefs={inputRefs.driver}
          />
          <DriverCombobox
            label="Driver 2"
            title="master.driver2"
            size="md"
            value={formState.driver.driver2 || ""}
            onChange={(value) => updateDriver({ driver2: value })}
            onKeyDown={(e: any) => handleKeyDown(e, "driver2")}
            ref={inputRefs.driver2}
            inputRefs={inputRefs.driver2}
          />
          {/* <div className="flex flex-wrap items-center gap-2"> */}
          <MilitaryTimeInput
            className="h-9"
            label="Received"
            title="drivetran.timerec"
            value={formState?.driver?.timerec || ""}
            onChange={(value) => updateDriver({ timerec: value })}
            onKeyDown={(e) => handleKeyDown(e, "timerec")}
            ref={inputRefs.timerec}
            FIELD_INDEXES={FIELD_INDEXES}
            inputRefs={inputRefs}
            fieldName="timerec"
          />
          <MilitaryTimeInput
            className="h-9"
            label="En route"
            title="drivetran.timeinrt"
            value={formState?.driver?.timeinrt || ""}
            onChange={(value) => updateDriver({ timeinrt: value })}
            onKeyDown={(e) => handleKeyDown(e, "timeinrt")}
            ref={inputRefs.timeinrt}
            FIELD_INDEXES={FIELD_INDEXES}
            fieldName="timeinrt"
            inputRefs={inputRefs}
          />
          <MilitaryTimeInput
            className="h-9"
            label="Arrived"
            title="drivetran.timearrive"
            value={formState?.driver?.timearrive || ""}
            onChange={(value) => updateDriver({ timearrive: value })}
            onKeyDown={(e) => handleKeyDown(e, "timearrive")}
            ref={inputRefs.timearrive}
            FIELD_INDEXES={FIELD_INDEXES}
            fieldName="timearrive"
            inputRefs={inputRefs}
          />
          <MilitaryTimeInput
            className="h-9"
            label="Loaded"
            title="drivetran.timeintow"
            value={formState?.driver?.timeintow || ""}
            onChange={(value) => updateDriver({ timeintow: value })}
            onKeyDown={(e) => handleKeyDown(e, "timeintow")}
            ref={inputRefs.timeintow}
            FIELD_INDEXES={FIELD_INDEXES}
            fieldName="timeintow"
            inputRefs={inputRefs}
          />
          <MilitaryTimeInput
            className="h-9"
            label="Cleared"
            title="drivetran.timeclear"
            value={formState?.driver?.timeclear || ""}
            onChange={(value) => updateDriver({ timeclear: value })}
            onKeyDown={(e) => handleKeyDown(e, "timeclear")}
            ref={inputRefs.timeclear}
            FIELD_INDEXES={FIELD_INDEXES}
            fieldName="timeclear"
            inputRefs={inputRefs}
          />
          {/* </div> */}
        </div>
      </FormSection>
      <div className="w-full max-w-full">
        <FormSection title="A - General Information">
          <div className="space-y-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full">
              <DateInput
                className="h-9 text-[14px] w-full"
                label="Date"
                title="master.towdate"
                size="sm"
                value={formState.dispatch.towdate || ""}
                onChange={(value) => updateDispatch({ towdate: value })}
                onKeyDown={(e) => handleKeyDown(e, "towdate")}
                ref={inputRefs.towdate}
                FIELD_INDEXES={FIELD_INDEXES}
                fieldName="towdate"
                inputRefs={inputRefs}
              />
              <FormInput
                className="h-9 text-[14px] w-full"
                label="Tag #"
                title="master.towtagnum"
                value={formState.dispatch.towtagnum || ""}
                onChange={(e) => updateDispatch({ towtagnum: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, "towtagnum")}
                ref={inputRefs.towtagnum}
              />
              <TruckCombobox
                className="w-full"
                label="Truck"
                title="master.trucknum"
                size="full"
                value={formState.dispatch.trucknum || ""}
                onChange={(value) => updateDispatch({ trucknum: value })}
                onKeyDown={(e) => handleKeyDown(e, "trucknum")}
                ref={inputRefs.trucknum}
                inputRefs={inputRefs.trucknum}
              />
              <FormInput
                className="h-9 text-[14px] w-full"
                label="Dispatcher"
                title="master.dispatcher"
                value={formState.dispatch.dispatcher || ""}
                onChange={(e) => updateDispatch({ dispatcher: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, "dispatcher")}
                ref={inputRefs.dispatcher}
              />
              <KitCombobox
                className="w-full"
                label="Kit #"
                title="master.kitnum"
                size="full"
                value={formState.invoice.kitnum || ""}
                onChange={(value) => updateInvoice({ kitnum: value })}
                onKeyDown={(e) => handleKeyDown(e, "kitnum")}
                ref={inputRefs.kitnum}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
              <FormInput
                className="h-9 text-[14px] w-full"
                label="Member #"
                title="master.membernum"
                value={formState.invoice.membernum || ""}
                onChange={(e) => updateInvoice({ membernum: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, "membernum")}
                ref={inputRefs.membernum}
              />
              <DateInput
                className="h-9 text-[14px] w-full"
                label="Expires"
                title="master.memberexp"
                size="sm"
                value={formState.invoice.memberexp || ""}
                onChange={(value) => updateInvoice({ memberexp: value })}
                onKeyDown={(e) => handleKeyDown(e, "memberexp")}
                ref={inputRefs.memberexp}
                FIELD_INDEXES={FIELD_INDEXES}
                fieldName="memberexp"
                inputRefs={inputRefs}
              />
              <DollarFormInput
                className="h-9 text-[14px] w-full"
                label="Value"
                title="master.value"
                value={formState.dispatch.value || ""}
                onChange={(e) => updateDispatch({ value: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, "value")}
                ref={inputRefs.value}
              />
              <DateInput
                className="h-9 text-[14px] w-full"
                label="Date Stored"
                title="master.dateStored"
                size="sm"
                value={formState.invoice.dateStored || ""}
                onChange={(value) => updateInvoice({ dateStored: value })}
                onKeyDown={(e) => handleKeyDown(e, "dateStored")}
                ref={inputRefs.dateStored}
                FIELD_INDEXES={FIELD_INDEXES}
                fieldName="dateStored"
                inputRefs={inputRefs}
              />
            </div>

            <div className=" max-w-[100%] flex-wrap items-center gap-2 w-full">
              <AccountName
                className="w-[60.5%] max-w-[60.5%]"
                label="Account Name"
                title="master.account"
                size="xl"
                value={formState.dispatch.callname || ""}
                onChange={(value) => updateDispatch({ callname: value })}
                onKeyDown={(e) => handleKeyDown(e, "callname")}
                ref={inputRefs.callname}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
              <FormInput
                className="h-9 text-[14px] w-full"
                label="Who Called"
                title="master.whocalled"
                value={formState.dispatch.whocalled || ""}
                onChange={(e) => updateDispatch({ whocalled: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, "whocalled")}
                ref={inputRefs.whocalled}
              />
              <PhoneInput
                className="h-9 text-[14px] w-full"
                label="Phone #"
                title="master.phone"
                size="lg"
                value={formState.dispatch.callphone || ""}
                onChange={(value) => updateDispatch({ callphone: value })}
                onKeyDown={(e) => handleKeyDown(e, "callphone")}
                ref={inputRefs.callphone}
              />
              <FormInput
                className="h-9 text-[14px] w-full"
                label="Reference #"
                title="master.refnum"
                value={formState.dispatch.refnumber || ""}
                onChange={(e) => updateDispatch({ refnumber: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, "refnumber")}
                ref={inputRefs.refnumber}
              />
            </div>
          </div>
        </FormSection>
      </div>

      <FormSection title="B - Vehicle Information" className="mt-4">
        <div className="space-y-4 items-center">
        <div className={`flex ${isDesktopOrLaptop ? "flex-row" : "flex-col"} items-start gap-4 w-full`}>
            <div className={`flex ${isDesktopOrLaptop?"":'flex-wrap'} gap-2`}>
              {" "}
              <FormInput
                label="Type"
                title="master.type"
                value={formState.dispatch.type || ""}
                onChange={(e) => updateDispatch({ type: e.target.value })}
                className="uppercase  w-[150px] h-9 text-[14px]"
                placeholder="Type"
                onKeyDown={(e) => handleKeyDown(e, "type")}
                ref={inputRefs.type}
              />
              <YearSlects
                label="Year"
                placeholder="Year"
                className="h-9 w-[150px] text-[14px]"
                title="master.yearcar"
                value={formState.dispatch.yearcar || ""}
                onChange={(value) => updateDispatch({ yearcar: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "yearcar")}
                ref={inputRefs.yearcar}
              />
            </div>

            <CarMake
              className="h-15 w-full min-w-[170px] text-[14px]"
              label="Make"
              placeholder="Select ..."
              title="master.makecar"
              value={formState.dispatch.makecar || ""}
              onChange={(value) => updateDispatch({ makecar: value })}
              size="full"
              onKeyDown={(e: any) => handleKeyDown(e, "makecar")}
              ref={inputRefs.makecar}
              setCarMakeId={setCarMakeId}
            />

            <CarMakeModels
              className="h-15 w-full min-w-[170px]  text-[14px]"
              label="Model"
              title="master.modelcar"
              carMakeId={carMakeId}
              value={formState.dispatch.modelcar || ""}
              onChange={(value) => updateDispatch({ modelcar: value })}
              size="full"
              onKeyDown={(e: any) => handleKeyDown(e, "modelcar")}
              ref={inputRefs.modelcar}
            />
          <div className={`flex ${isDesktopOrLaptop ? "flex-nowrap" : "flex-wrap"} gap-2`}>
              {" "}
              <ColorSelect
                label="Color"
                className="w-[150px]"
                title="master.colorcar"
                value={formState.dispatch.colorcar || ""}
                onChange={(value) => updateDispatch({ colorcar: value })}
                ref={inputRefs.colorcar}
                onKeyDown={(e: any) => handleKeyDown(e, "colorcar")}
                size="md"
              />
              <FormInput
                label="Body"
                title="master.bodytype"
                className="h-9 w-[150px] text-[14px]"
                value={formState?.dispatch.bodytype || ""}
                onChange={(e) => updateDispatch({ bodytype: e.target.value })}
                placeholder="Body type"
                ref={inputRefs.bodytype}
                onKeyDown={(e) => handleKeyDown(e, "bodytype")}
              />
            </div>
          </div>

          <div className="py-3  space-y-2">
    <div className={`flex ${isDesktopOrLaptop2 ? "flex-row" : "flex-col"} items-start gap-4 w-full`}>
              {/* State Select */}
              <StateSelect
                className={`w-full text-[14px]`}
                label="State"
                title="master.licensest"
                size="md"
                value={formState?.dispatch?.licensest || ""}
                onChange={(value) => updateDispatch({ licensest: value })}
                ref={inputRefs.licensest}
                onKeyDown={(e: any) => handleKeyDown(e, "licensest")}
              />

              {/* License Plate Input */}
              <StateInput
                maxLength={7}
                className="w-full  text-[14px]"
                label="License Plate"
                title="master.licensenum"
                value={formState.dispatch.licensenum || ""}
                onChange={(value) => updateDispatch({ licensenum: value })}
                placeholder="ABC1234"
                size="full"
                ref={inputRefs.licensenum}
                onKeyDown={(e: any) => handleKeyDown(e, "licensenum")}
              />

              {/* Expires Input with Button Inside */}
              <div className="flex items-end space-x-2">
                <FormInput
                  className={`h-9 ${isDesktopOrLaptop2?'w-[25ch]':'w-[30ch]'}  text-[14px]`}
                  label="Expires"
                  title="master.tagmonthyear"
                  value={formState.dispatch.tagmonthyear || ""}
                  onChange={(e) =>
                    updateDispatch({ tagmonthyear: e.target.value })
                  }
                  placeholder="MM/YY"
                  ref={inputRefs.tagmonthyear}
                  onKeyDown={(e: any) => handleKeyDown(e, "tagmonthyear")}
                />
                {/* Lookup Button */}
                <button
                  onClick={handleLookup}
                  disabled={
                    loading ||
                    !formState.dispatch.licensenum ||
                    !formState.dispatch.licensest
                  }
                  className="px-3 py-[7px] bg-blue-600 text-white rounded-md hover:bg-blue-700 
      disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none 
      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  title="Look up license plate information"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* VIN Lookup Field */}
              <VinLookupField
                ref={inputRefs.vin}
                value={formState.dispatch.vin || ""}
                onChange={(value) => updateDispatch({ vin: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "vin")}
                onVinDetails={handleVinDetails}
                className={` ${isDesktopOrLaptop2?"w-[35ch]":"w-[40ch]"} text-[14px]`}
              />
            </div>

            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
          <FormSection title="C - Vehicle Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {/* Odometer Input */}
              <NumberInput
                label="Odometer"
                className="h-9 w-full text-[14px]"
                title="master.odometer"
                value={formState.dispatch.odometer}
                onChange={(e) => updateDispatch({ odometer: e.target.value })}
                onKeyDown={(e: any) => handleKeyDown(e, "odometer")}
                ref={inputRefs.odometer}
              />

              {/* Condition Select */}
              <ConditionSelect
                size="full"
                label="Condition"
                className="h-9 w-full text-[14px]"
                title="master.condition"
                value={formState.dispatch.condition}
                onChange={(value) => updateDispatch({ condition: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "condition")}
                ref={inputRefs.condition}
              />

              {/* Vehicle Reason Select */}
              <VehicleReasonsSelect
                ref={inputRefs.reason}
                label="Reason"
                title="master.reason"
                value={formState.dispatch.reason}
                onChange={(value) => updateDispatch({ reason: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "reason")}
                size="full"
                className="h-9 w-full text-[14px]"
              />
            </div>
          </FormSection>
          <FormSection title="D - Location Information">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <AddressAutocomplete
                  label="Towed From"
                  // onChange={(e) => updateDispatch({towedfrom: e.target.value})}
                  value={formState.dispatch.towedfrom || ""}
                  onChange={(newValue: any, placeDetails: any) =>
                    updateDispatch({ towedfrom: newValue })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "towedfrom")}
                  ref={inputRefs.towedfrom}
                  className="h-9 w-full text-[14px]"
                />
                <AddressAutocomplete
                  label="Towed To"
                  value={formState?.dispatch.towedto || ""}
                  onChange={(newValue: any, placeDetails: any) =>
                    updateDispatch({ towedto: newValue })
                  }
                  className="h-9 w-full text-[14px]"
                  onKeyDown={(e: any) => handleKeyDown(e, "towedto")}
                  ref={inputRefs.towedto}
                />

                <AddressAutocomplete
                  ref={inputRefs?.retowto}
                  label="Retow To"
                  value={formState?.dispatch.retowto || ""}
                  onChange={(newValue: any, placeDetails: any) =>
                    updateDispatch({ retowto: newValue })
                  }
                  className="h-9 w-full text-[14px]"
                  onKeyDown={(e: any) => handleKeyDown(e, "retowto")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <FormInput
                  ref={inputRefs?.lotsection}
                  size="address"
                  label="Lot Section"
                  title="master.lotsection"
                  value={formState.dispatch.lotsection || ""}
                  onChange={(e) =>
                    updateDispatch({ lotsection: e.target.value })
                  }
                  placeholder="Enter lot section"
                  className="h-9 w-full text-[14px] "
                  onKeyDown={(e: any) => handleKeyDown(e, "lotsection")}
                />
                <FormInput
                  ref={inputRefs?.calltype}
                  label="Call Type"
                  title="master.calltype"
                  className="h-9 w-full text-[14px] "
                  value={formState.dispatch.calltype || ""}
                  onChange={(e) => updateDispatch({ calltype: e.target.value })}
                  placeholder="Enter call type"
                  onKeyDown={(e: any) => handleKeyDown(e, "calltype")}
                />
                <BooleanSelect
                  className="h-10 w-full text-[14px]"
                  label="Have Key?"
                  title="master.keyinfo"
                  ref={inputRefs?.keysinfo}
                  value={
                    formState?.dispatch.keysinfo === true ||
                    formState?.dispatch.keysinfo === "true"
                  }
                  onChange={(value: boolean) =>
                    updateDispatch({ keysinfo: value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "keysinfo")}
                  size="lg"
                  // onEnterPress={() => lienStartRef.current?.focus()}
                />

                <BooleanSelect
                  className="h-9 w-full text-[14px]"
                  ref={inputRefs?.holdnote}
                  label="Hold Note"
                  title="master.holdnote"
                  value={
                    formState?.dispatch.holdnote === true ||
                    formState?.dispatch.holdnote === "true"
                  }
                  onChange={(value: boolean) =>
                    updateDispatch({ holdnote: value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "holdnote")}
                  size="lg"
                  // onEnterPress={() => lienStartRef.current?.focus()}
                />
              </div>
            </div>
          </FormSection>
          <NotesSection
            ref={inputRefs?.notes}
            value={formState.dispatch.callremark || ""}
            onChange={(notes) => updateDispatch({ callremark: notes })}
            onKeyDown={(e: any) => handleKeyDown(e, "notes")}
            // onEnterPress={() => focusSection(invoiceSectionRef)}
          />

          <FormSection title="F - Invoice Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <FormInput
                  ref={inputRefs?.invoicenum}
                  label="Inv #"
                  title="master.invoicenum"
                  value={formState.invoice.invoicenum || ""}
                  onChange={(e) =>
                    updateInvoice({ invoicenum: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "invoicenum")}
                  placeholder="Invoice number"
                  className="h-9 w-full"
                />
                <DateInput
                  ref={inputRefs?.invdate}
                  label="Date"
                  title="master.invdate"
                  size="md"
                  value={formState.invoice.invdate || ""}
                  onChange={(value) => updateInvoice({ invdate: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "invdate")}
                  FIELD_INDEXES={FIELD_INDEXES}
                  fieldName="invdate"
                  inputRefs={inputRefs}
                  className="h-9 w-full"
                />

                <FormInput
                  ref={inputRefs?.itemgroup}
                  label="Group"
                  className="h-9 w-full"
                  title="master.group"
                  value={formState.invoice.itemgroup || ""}
                  onChange={(e) => updateInvoice({ itemgroup: e.target.value })}
                  placeholder="Item group"
                  onKeyDown={(e: any) => handleKeyDown(e, "itemgroup")}
                />

                <FormInput
                  ref={inputRefs?.inreason}
                  label="Reason"
                  title="master.reason"
                  value={formState.invoice.reason || ""}
                  onChange={(e) => updateInvoice({ reason: e.target.value })}
                  placeholder="Reason"
                  className="h-9 w-full"
                  onKeyDown={(e: any) => handleKeyDown(e, "inreason")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">
                <FormInput
                  ref={inputRefs?.billtoname}
                  label="Name"
                  title="master.billtoname"
                  value={formState.invoice.billtoname || ""}
                  onChange={(e) =>
                    updateInvoice({ billtoname: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtoname")}
                  className="h-9 w-full"
                  placeholder="Customer name"
                />

                <FormInput
                  ref={inputRefs?.ponumber}
                  label="PO#"
                  title="master.ponumber"
                  value={formState.invoice.ponumber || ""}
                  onChange={(e) => updateInvoice({ ponumber: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "ponumber")}
                  className="h-9 w-full"
                  placeholder="PO number"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full ">
                <div className="">
                  <AddressSection
                    ref={inputRefs?.billtoaddr1}
                    value={formState.dispatch.billtoaddr1 || ""}
                    onChange={(notes) => updateDispatch({ billtoaddr1: notes })}
                    onKeyDown={(e:any) => handleKeyDown(e, "billtoaddr1")}
                  />
                </div>
                {/* <div className=""> */}
                  <div className="grid grid-cols-1  sm:grid-cols-2 gap-2 w-full mt-4 ">
                    <FormInput
                      ref={inputRefs?.releaselic}
                      label="RelLic#"
                      title="master.releaselic"
                      value={formState.invoice.releaselic || ""}
                      onChange={(e) =>
                        updateInvoice({ releaselic: e.target.value })
                      }
                      onKeyDown={(e) => handleKeyDown(e, "releaselic")}
                      className="h-9 w-full"
                      placeholder="Release license"
                    />

                    <StateSelect
                      // ref={inputRefs?.billtost}
                      ref={inputRefs?.billtoaddr2}
                      label="State"
                      title="master.billtoaddr2"
                      value={formState.invoice.billtoaddr2 || ""}
                      onChange={(value) => updateInvoice({ billtoaddr2: value })}
                      onKeyDown={(e:any) => handleKeyDown(e, "billtoaddr2")}
                      className="h-9 w-full"
                    />

                    <PhoneInput
                      ref={inputRefs?.billtophone}
                      label="Phone"
                      title="master.billtophone"
                      size="md"
                      className="h-9 w-full"
                      value={formState.invoice.billtophone || ""}
                      onChange={(value) =>
                        updateInvoice({ billtophone: value })
                      }
                      onKeyDown={(e) => handleKeyDown(e, "billtophone")}
                    />

                    <FormInput
                      ref={inputRefs?.billtocont}
                      label="Contact"
                      title="master.billtocont"
                      value={formState.invoice.billtocont || ""}
                      onChange={(e) =>
                        updateInvoice({ billtocont: e.target.value })
                      }
                      onKeyDown={(e) => handleKeyDown(e, "billtocont")}
                      className="h-9 w-full"
                      placeholder="Contact name"
                    />
                  </div>
                {/* </div> */}
              </div>
              <div>
                {/* <FormInput
                  ref={inputRefs?.billtoaddr1}
                  label="Address 1"
                  title="master.billtoaddr1"
                  size="full"
                  value={formState.invoice.billtoaddr1 || ""}
                  onChange={(e) =>
                    updateInvoice({ billtoaddr1: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtoaddr1")}
                  className="h-10 w-full"
                  placeholder="Street address"
                /> */}
                {/* <FormInput
                  ref={inputRefs?.billtoaddr2}
                  label="Address 2"
                  title="master.billtoaddr2"
                  size="full"
                  value={formState.invoice.billtoaddr2 || ""}
                  onChange={(e) =>
                    updateInvoice({ billtoaddr2: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtoaddr2")}
                  className="h-9 w-full"
                  placeholder="Apt, Suite, etc."
                /> */}
                {/* <PhoneInput
                  ref={inputRefs?.billtophone}
                  label="Phone"
                  title="master.billtophone"
                  size="md"
                 className="h-9 w-full"
                  value={formState.invoice.billtophone || ""}
                  onChange={(value) => updateInvoice({ billtophone: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "billtophone")}
                /> */}

                {/* <FormInput
                  ref={inputRefs?.billtocity}
                  label="City"
                  title="master.billtocity"
                  value={formState.invoice.billtocity || ""}
                  onChange={(e) =>
                    updateInvoice({ billtocity: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtocity")}
                  className="h-9 w-full"
                  placeholder="City"
                /> */}
                {/* <FormInput
                  ref={inputRefs?.billtocont}
                  label="Contact"
                  title="master.billtocont"
                  value={formState.invoice.billtocont || ""}
                  onChange={(e) =>
                    updateInvoice({ billtocont: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtocont")}
                  className="h-9 w-full"
                  placeholder="Contact name"
                />  */}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-2 w-full">
                <FormInput
                  ref={inputRefs?.billtocity}
                  label="City"
                  title="master.billtocity"
                  value={formState.invoice.billtocity || ""}
                  onChange={(e) =>
                    updateInvoice({ billtocity: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtocity")}
                  className="h-9 w-full"
                  placeholder="City"
                />
                <StateSelect
                  ref={inputRefs?.billtost}
                  label="State"
                  title="master.billtost"
                  value={formState.invoice.billtost || ""}
                  onChange={(value) => updateInvoice({ billtost: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "billtost")}
                  className="h-9 w-full"
                />

                <ZipInput
                  ref={inputRefs?.billtozip}
                  label="Zip"
                  className="h-9 w-full"
                  title="master.billtozip"
                  value={formState.invoice.billtozip || ""}
                  onChange={(value) => updateInvoice({ billtozip: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "billtozip")}
                />
                {/* <FormInput
                  ref={inputRefs?.billtocont}
                  label="Contact"
                  title="master.billtocont"
                  value={formState.invoice.billtocont || ""}
                  onChange={(e) =>
                    updateInvoice({ billtocont: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtocont")}
                  className="h-9 w-full"
                  placeholder="Contact name"
                />  */}
              </div>
            </div>
          </FormSection>
          <FormSection title="G - Registration Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                <FormInput
                  ref={inputRefs?.regname}
                  label="Registered Owner"
                  title="master.regname"
                  value={formState.invoice.regname || ""}
                  onChange={(e) => updateInvoice({ regname: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "regname")}
                  className="h-9 w-full"
                  placeholder="Enter registered owner name"
                />

                <FormInput
                  ref={inputRefs?.rtype}
                  label="R-Type"
                  title="master.rtype"
                  value={formState.invoice.rtype || ""}
                  onChange={(e) => updateInvoice({ rtype: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "rtype")}
                  className="h-9 w-full"
                  placeholder="Type"
                />
                <FormInput
                  ref={inputRefs?.auct_num}
                  label="Auction #"
                  title="master.auctionnum"
                  value={formState.dispatch.auct_num || ""}
                  onChange={(e) => updateDispatch({ auct_num: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "auct_num")}
                  className="h-9 w-full"
                  placeholder="Enter auction number"
                />
              </div>

              <div className={`flex ${isDesktopOrLaptop2 ? "flex-row" : "flex-col"} items-start gap-4 w-full`}>
              <FormInput
                  ref={inputRefs?.regaddr1}
                  label="Address"
                  title="master.regaddr1"
                  value={formState.invoice.regaddr1 || ""}
                  onChange={(e) => updateInvoice({ regaddr1: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "regaddr1")}
                  //  className="h-9 w-full md:w-[480px]"
                  className={`h-9  ${isDesktopOrLaptop?"w-[500px]":"w-[480px]"}`}
                  placeholder="Enter registration address"
                />

                <FormInput
                  ref={inputRefs?.regcity}
                  label="City"
                  title="master.regcity"
                  value={formState.invoice.regcity || ""}
                  onChange={(e) => updateInvoice({ regcity: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "regcity")}
                  //  className="h-9 w-full md:w-[480px]"
                  className={`h-9  ${isDesktopOrLaptop?"w-[480px]":"w-[400px"}`}
                  placeholder="Enter city"
                />

                <StateSelect
                  ref={inputRefs?.regstate}
                  label="State"
                  title="master.regstate"
                  value={formState.invoice.regstate || ""}
                  onChange={(value) => updateInvoice({ regstate: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "regstate")}
                  className="h-9 w-[150px]"
                  // className={`h-9  ${isDesktopOrLaptop2?"w-[150px]":"w-[220px]"}`}
                />

                <ZipInput
                  ref={inputRefs?.regzip}
                  label="Zip"
                  title="master.regzip"
                  value={formState.invoice.regzip || ""}
                  onChange={(value) => updateInvoice({ regzip: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "regzip")}
                  className="h-9 w-[150px]"
                />
              </div>
            </div>
          </FormSection>
          <FormSection title="H - Storage Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">
              <DateInput
                label="Storage In"
                title="master.storagein"
                size="sm"
                className="w-full h-9"
                value={formState.dispatch.datein || ""}
                onChange={(value) => updateDispatch({ datein: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "datein")}
                ref={inputRefs.datein}
                FIELD_INDEXES={FIELD_INDEXES}
                fieldName="datein"
                inputRefs={inputRefs}
              />
              <DateInput
                ref={inputRefs?.dateout}
                label="Storage Out"
                title="master.storageout"
                className="w-full h-9"
                size="sm"
                value={formState.dispatch.dateout || ""}
                onChange={(value) => updateDispatch({ dateout: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "dateout")}
                FIELD_INDEXES={FIELD_INDEXES}
                fieldName="dateout"
                inputRefs={inputRefs}
              />
            </div>
          </FormSection>

          <FormSection title="I - Lien Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full items-center">
              <BooleanSelect
                className=" w-full  text-[14px]"
                label="Commission"
                ref={inputRefs?.commission}
                value={formState.dispatch.commission || false}
                onChange={(value: boolean) =>
                  updateDispatch({ commission: value })
                }
                onKeyDown={(e: any) => handleKeyDown(e, "commission")}
                size="lg"
                // onEnterPress={() => lienStartRef.current?.focus()}
              />

              <DateInput
                ref={inputRefs?.liendin}
                className="h-9 w-full text-[14px]"
                label="Lien Start"
                title="master.liendin"
                size="md"
                value={formState.dispatch.liendin || ""}
                onChange={(value) => updateDispatch({ liendin: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "liendin")}
                FIELD_INDEXES={FIELD_INDEXES}
                fieldName="liendin"
                inputRefs={inputRefs}
                // onEnterPress={() => lienClearRef.current?.focus()}
              />
              <DateInput
                ref={inputRefs?.liendout}
                className="h-9  w-full text-[14px]"
                label="Lien Start"
                title="master.liendout"
                size="md"
                value={formState.dispatch.liendout || ""}
                onChange={(value) => updateDispatch({ liendout: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "liendout")}
                FIELD_INDEXES={FIELD_INDEXES}
                fieldName="liendout"
                inputRefs={inputRefs}
                // onEnterPress={() => lienClearRef.current?.focus()}
              />
              <LienTypeInput
                ref={inputRefs?.lientype}
                label="Lien Type"
                className="h-9 w-full"
                title="master.lientype"
                value={formState.dispatch.lientype || ""}
                onChange={(value) => updateDispatch({ lientype: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "lientype")}
              />

              <LienFeeSelect
                ref={inputRefs?.lienfee}
                label="Lien Fee"
                title="master.lienfee"
                value={formState.dispatch.lienfee || 50}
                onChange={(value) => updateDispatch({ lienfee: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "lienfee")}
                className="w-full"
              />
            </div>
          </FormSection>
          <ChargesSection
            key="charges"
            refs={inputRefs}
            onKeyDown={handleKeyDown}
            transactionItems={formState.items || []}
            onItemsChange={updateItems}
            invoice={formState.invoice}
            onInvoiceChange={updateInvoice}
          />
        </div>
      </FormSection>
    </div>,
  ];

  return <DesktopLayout sections={sections} />;
};

export default InvoiceForm;
