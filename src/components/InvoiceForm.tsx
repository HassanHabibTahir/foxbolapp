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
import LienSection from "./LienSection";
import AccountName from "./common/AccountName";
import BooleanSelect from "./common/BooleanSelector";
import LienTypeInput from "./common/LienTypeInput";
import LienFeeSelect from "./common/LienFeeSelect";
import ChargesSection from "./ChargesSection";
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
  billtocity: 51,
  billtost: 52,
  billtozip: 53,
  billtocont: 54,
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
  // description81: 81,
  // description82: 82,
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
    if (currentIndex === 40) {
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
        <div className="flex flex-wrap items-center gap-x-1">
          <DriverCombobox
            label="Driver 1"
            title="master.driver"
            size="md"
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
          <div className="flex flex-wrap gap-2">
            <MilitaryTimeInput
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
          </div>
        </div>
      </FormSection>

      <FormSection title="A - General Information">
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
              FIELD_INDEXES={FIELD_INDEXES}
              fieldName="towdate"
              inputRefs={inputRefs}
            />
            <FormInput
              className="h-10 text-[14px]"
              label="Tag #"
              title="master.towtagnum"
              value={formState.dispatch.towtagnum || ""}
              onChange={(e) => updateDispatch({ towtagnum: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, "towtagnum")}
              ref={inputRefs.towtagnum}
              // FIELD_INDEXES ={FIELD_INDEXES}
              // fieldName="towtagnum"
              // inputRefs = {inputRefs}
            />
            <TruckCombobox
              label="Truck"
              title="master.trucknum"
              size="lg"
              value={formState.dispatch.trucknum || ""}
              onChange={(value) => updateDispatch({ trucknum: value })}
              onKeyDown={(e) => handleKeyDown(e, "trucknum")}
              ref={inputRefs.trucknum}
              inputRefs={inputRefs.trucknum}
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
              FIELD_INDEXES={FIELD_INDEXES}
              fieldName="memberexp"
              inputRefs={inputRefs}
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
              FIELD_INDEXES={FIELD_INDEXES}
              fieldName="dateStored"
              inputRefs={inputRefs}
            />

            <AccountName
              label="Account Name"
              title="master.account"
              size="xl"
              value={formState.dispatch.callname || ""}
              onChange={(value: any) => updateDispatch({ callname: value })}
              onKeyDown={(e: any) => handleKeyDown(e, "callname")}
              ref={inputRefs.callname}
            />
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
      </FormSection>
      <FormSection title="B - Vehicle Information" className="mt-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <FormInput
              label="Type"
              title="master.type"
              value={formState.dispatch.type || ""}
              onChange={(e) => updateDispatch({ type: e.target.value })}
              className="uppercase w-[7ch] h-10 text-[14px]"
              placeholder="Type"
              onKeyDown={(e) => handleKeyDown(e, "type")}
              ref={inputRefs.type}
            />
            <FormInput
              label="Year"
              className="h-10 text-[14px]"
              title="master.yearcar"
              value={formState.dispatch.yearcar || ""}
              onChange={(e) => updateDispatch({ yearcar: e.target.value })}
              placeholder="YYYY"
              onKeyDown={(e) => handleKeyDown(e, "yearcar")}
              ref={inputRefs.yearcar}
            />
            <FormInput
              className="h-10 text-[14px]"
              label="Make"
              title="master.makecar"
              value={formState.dispatch.makecar || ""}
              onChange={(e) => updateDispatch({ makecar: e.target.value })}
              placeholder="Make"
              onKeyDown={(e) => handleKeyDown(e, "makecar")}
              ref={inputRefs.makecar}
            />
            <FormInput
              className="h-10 text-[14px]"
              label="Model"
              title="master.modelcar"
              value={formState.dispatch.modelcar || ""}
              onChange={(e) => updateDispatch({ modelcar: e.target.value })}
              placeholder="Model"
              onKeyDown={(e) => handleKeyDown(e, "modelcar")}
              ref={inputRefs.modelcar}
            />
            <FormInput
              label="Color"
              title="master.colorcar"
              className="h-10 text-[14px]"
              value={formState.dispatch.colorcar || ""}
              onChange={(e) => updateDispatch({ colorcar: e.target.value })}
              placeholder="Color"
              ref={inputRefs.colorcar}
              onKeyDown={(e) => handleKeyDown(e, "colorcar")}
            />
            <FormInput
              label="Body"
              title="master.bodytype"
              className="h-10 text-[14px]"
              value={formState?.dispatch.bodytype || ""}
              onChange={(e) => updateDispatch({ bodytype: e.target.value })}
              placeholder="Body type"
              ref={inputRefs.bodytype}
              onKeyDown={(e) => handleKeyDown(e, "bodytype")}
            />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2 items-end">
              <StateInput
                className="h-10 text-[14px]"
                label="State"
                title="master.licensest"
                size="xs"
                value={formState?.dispatch?.licensest || ""}
                onChange={(value) => updateDispatch({ licensest: value })}
                ref={inputRefs.licensest}
                maxLength={2}
                placeholder="XX"
                onKeyDown={(e: any) => handleKeyDown(e, "licensest")}
              />
              <StateInput
                maxLength={7}
                label="License Plate"
                title="master.licensenum"
                value={formState.dispatch.licensenum || ""}
                onChange={(value) => updateDispatch({ licensenum: value })}
                placeholder="ABC1234"
                size="md"
                ref={inputRefs.licensenum}
                onKeyDown={(e: any) => handleKeyDown(e, "licensenum")}
              />
              <FormInput
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
              <button
                onClick={handleLookup}
                disabled={
                  loading ||
                  !formState.dispatch.licensenum ||
                  !formState.dispatch.licensest
                }
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none 
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                title="Look up license plate information"
              >
                <Search className="w-5 h-5" />
              </button>
              <VinLookupField
                ref={inputRefs.vin}
                value={formState.dispatch.vin || ""}
                onChange={(value) => updateDispatch({ vin: value })}
                onKeyDown={(e: any) => handleKeyDown(e, "vin")}
                onVinDetails={handleVinDetails}
              />
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
          <FormSection title="C - Vehicle Details">
            <div className="flex flex-wrap gap-4 items-start">
              <FormInput
                label="Odometer"
                className="h-10 text-[14px]"
                title="master.odometer"
                value={formState.dispatch.odometer}
                onChange={(e) => updateDispatch({ odometer: e.target.value })}
                onKeyDown={(e: any) => handleKeyDown(e, "odometer")}
                ref={inputRefs.odometer}
              />
              <FormInput
                size="full"
                label="Condition"
                className="h-10 text-[14px] min-w-[600px]"
                title="master.condition"
                value={formState.dispatch.condition}
                onChange={(e) => updateDispatch({ condition: e.target.value })}
                onKeyDown={(e: any) => handleKeyDown(e, "condition")}
                ref={inputRefs.condition}
              />
              <FormInput
                className="h-10 text-[14px]"
                label="Reason"
                title="master.reason"
                value={formState.dispatch.reason}
                onChange={(e) => updateDispatch({ reason: e.target.value })}
                onKeyDown={(e: any) => handleKeyDown(e, "reason")}
                placeholder="Enter reason"
                ref={inputRefs.reason}
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
                  onChange={(newValue, placeDetails) =>
                    updateDispatch({ towedfrom: newValue })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "towedfrom")}
                  ref={inputRefs.towedfrom}
                  className="h-10 w-full text-[14px]"
                />
                <AddressAutocomplete
                  label="Towed To"
                  value={formState?.dispatch.towedto || ""}
                  onChange={(newValue, placeDetails) =>
                    updateDispatch({ towedto: newValue })
                  }
                  className="h-10 w-full text-[14px]"
                  onKeyDown={(e: any) => handleKeyDown(e, "towedto")}
                  ref={inputRefs.towedto}
                />

                <AddressAutocomplete
                  ref={inputRefs?.retowto}
                  label="Retow To"
                  value={formState?.dispatch.retowto || ""}
                  onChange={(newValue, placeDetails) =>
                    updateDispatch({ retowto: newValue })
                  }
                  className="h-10 w-full text-[14px]"
                  onKeyDown={(e: any) => handleKeyDown(e, "retowto")}
                />
              </div>

              <div className="flex flex-wrap gap-4">
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
                  className="h-10 w-[15rem] text-[14px] "
                  onKeyDown={(e: any) => handleKeyDown(e, "lotsection")}
                />
                <FormInput
                  ref={inputRefs?.calltype}
                  label="Call Type"
                  title="master.calltype"
                  className="h-10 w-[15rem] text-[14px] "
                  value={formState.dispatch.calltype || ""}
                  onChange={(e) => updateDispatch({ calltype: e.target.value })}
                  placeholder="Enter call type"
                  onKeyDown={(e: any) => handleKeyDown(e, "calltype")}
                />
                <FormInput
                  ref={inputRefs?.keysinfo}
                  label="Have Key?"
                  title="master.keyinfo"
                  value={formState.dispatch.keysinfo || ""}
                  onChange={(e) => updateDispatch({ keysinfo: e.target.value })}
                  placeholder="Key information"
                  className="h-10 w-[15rem] text-[14px] "
                  onKeyDown={(e: any) => handleKeyDown(e, "keysinfo")}
                />
                <FormInput
                  ref={inputRefs?.holdnote}
                  label="Hold Note"
                  title="master.holdnote"
                  value={formState.dispatch.holdnote || ""}
                  onChange={(e) => updateDispatch({ holdnote: e.target.value })}
                  placeholder="Enter hold note"
                  className="h-10 w-[15rem] text-[14px]"
                  onKeyDown={(e: any) => handleKeyDown(e, "holdnote")}
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

          <FormSection title="Invoice Information">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
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
                />

                <FormInput
                  ref={inputRefs?.itemgroup}
                  label="Group"
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
                  onKeyDown={(e: any) => handleKeyDown(e, "inreason")}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <FormInput
                  ref={inputRefs?.billtoname}
                  label="Name"
                  title="master.billtoname"
                  value={formState.invoice.billtoname || ""}
                  onChange={(e) =>
                    updateInvoice({ billtoname: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtoname")}
                  className=""
                  placeholder="Customer name"
                />

                <FormInput
                  ref={inputRefs?.ponumber}
                  label="PO#"
                  title="master.ponumber"
                  value={formState.invoice.ponumber || ""}
                  onChange={(e) => updateInvoice({ ponumber: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "ponumber")}
                  className="w-48"
                  placeholder="PO number"
                />
                <FormInput
                  ref={inputRefs?.billtoaddr1}
                  label="Address 1"
                  title="master.billtoaddr1"
                  size="full"
                  value={formState.invoice.billtoaddr1 || ""}
                  onChange={(e) =>
                    updateInvoice({ billtoaddr1: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtoaddr1")}
                  className="flex-1"
                  placeholder="Street address"
                />

                <FormInput
                  ref={inputRefs?.releaselic}
                  label="RelLic#"
                  title="master.releaselic"
                  value={formState.invoice.releaselic || ""}
                  onChange={(e) =>
                    updateInvoice({ releaselic: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "releaselic")}
                  className="w-48"
                  placeholder="Release license"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <FormInput
                  ref={inputRefs?.billtoaddr2}
                  label="Address 2"
                  title="master.billtoaddr2"
                  size="full"
                  value={formState.invoice.billtoaddr2 || ""}
                  onChange={(e) =>
                    updateInvoice({ billtoaddr2: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtoaddr2")}
                  className="flex-1"
                  placeholder="Apt, Suite, etc."
                />
                <PhoneInput
                  ref={inputRefs?.billtophone}
                  label="Phone"
                  title="master.billtophone"
                  size="md"
                  value={formState.invoice.billtophone || ""}
                  onChange={(value) => updateInvoice({ billtophone: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "billtophone")}
                />

                <FormInput
                  ref={inputRefs?.billtocity}
                  label="City"
                  title="master.billtocity"
                  value={formState.invoice.billtocity || ""}
                  onChange={(e) =>
                    updateInvoice({ billtocity: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtocity")}
                  className="flex-1"
                  placeholder="City"
                />
              </div>

              <div className="flex gap-2">
                <StateInput
                  ref={inputRefs?.billtost}
                  label="State"
                  title="master.billtost"
                  value={formState.invoice.billtost || ""}
                  onChange={(value) => updateInvoice({ billtost: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "billtost")}
                />
                <ZipInput
                  ref={inputRefs?.billtozip}
                  label="Zip"
                  title="master.billtozip"
                  value={formState.invoice.billtozip || ""}
                  onChange={(value) => updateInvoice({ billtozip: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "billtozip")}
                />
                <FormInput
                  ref={inputRefs?.billtocont}
                  label="Contact"
                  title="master.billtocont"
                  value={formState.invoice.billtocont || ""}
                  onChange={(e) =>
                    updateInvoice({ billtocont: e.target.value })
                  }
                  onKeyDown={(e: any) => handleKeyDown(e, "billtocont")}
                  className="w-64"
                  placeholder="Contact name"
                />
              </div>
            </div>
          </FormSection>
          <FormSection title="G - Registration Information">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <FormInput
                  ref={inputRefs?.regname}
                  label="Registered Owner"
                  title="master.regname"
                  value={formState.invoice.regname || ""}
                  onChange={(e) => updateInvoice({ regname: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "regname")}
                  className="flex-1"
                  placeholder="Enter registered owner name"
                />

                <FormInput
                  ref={inputRefs?.rtype}
                  label="R-Type"
                  title="master.rtype"
                  value={formState.invoice.rtype || ""}
                  onChange={(e) => updateInvoice({ rtype: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "rtype")}
                  className="w-32"
                  placeholder="Type"
                />
                <FormInput
                  ref={inputRefs?.auct_num}
                  label="Auction #"
                  title="master.auctionnum"
                  value={formState.dispatch.auct_num || ""}
                  onChange={(e) => updateDispatch({ auct_num: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "auct_num")}
                  className="w-48"
                  placeholder="Enter auction number"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <FormInput
                  ref={inputRefs?.regaddr1}
                  label="Address"
                  title="master.regaddr1"
                  value={formState.invoice.regaddr1 || ""}
                  onChange={(e) => updateInvoice({ regaddr1: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "regaddr1")}
                  className="flex-1"
                  placeholder="Enter registration address"
                />

                <FormInput
                  ref={inputRefs?.regcity}
                  label="City"
                  title="master.regcity"
                  value={formState.invoice.regcity || ""}
                  onChange={(e) => updateInvoice({ regcity: e.target.value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "regcity")}
                  className="w-48"
                  placeholder="Enter city"
                />

                <StateInput
                  ref={inputRefs?.regstate}
                  label="State"
                  title="master.regstate"
                  value={formState.invoice.regstate || ""}
                  onChange={(value) => updateInvoice({ regstate: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "regstate")}
                />

                <ZipInput
                  ref={inputRefs?.regzip}
                  label="Zip"
                  title="master.regzip"
                  value={formState.invoice.regzip || ""}
                  onChange={(value) => updateInvoice({ regzip: value })}
                  onKeyDown={(e: any) => handleKeyDown(e, "regzip")}
                />
              </div>
            </div>
          </FormSection>
          <FormSection title="Storage Information">
            <div className="flex flex-wrap gap-4">
              <DateInput
                label="Storage In"
                title="master.storagein"
                size="sm"
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
            <div className="flex flex-wrap gap-4">
              <BooleanSelect
                className="h-10  text-[14px]"
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
                className="h-10  text-[14px]"
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
                className="h-10  text-[14px]"
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
                className=""
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

          {/* <LienSection
    dispatch={formState.dispatch}
    onDispatchChange={updateDispatch}
    /> */}
          {/* <div className="flex flex-wrap gap-4">
          <LicensePlateLookup
            ref={plateRef}
            stateRef={stateRef}
            onPlateDetails={handlePlateDetails}
            maxLength={7}
            onDispatchChange={onDispatchChange}
            dispatch={dispatch}
            onEnterPress={() => vinRef.current?.focus()}
          />
          <VinLookupField
            ref={vinRef}
            value={dispatch.vin || ''}
            onChange={(value) => onDispatchChange({ vin: value })}
            onVinDetails={handleVinDetails}
            onEnterPress={onEnterPress}
          />
          */}
          {/* </div> */}
          {/* </div> */}
        </div>
      </FormSection>
    </div>,
  ];

  return <DesktopLayout sections={sections} />;
};

export default InvoiceForm;

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
//   <VehicleDetailsSection
//   key="vehicle-details"
//   // ref={vehicleDetailsSectionRef}
//     odometer={formState.dispatch.odometer}
//     condition={formState.dispatch.condition}
//     reason={formState.dispatch.reason}
//     onChange={(field, value) => updateDispatch({ [field]: value })}
//     // onEnterPress={() => focusSection(locationSectionRef)}
//   />
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
// <ChargesSection
// key="charges"
// // ref={chargesSectionRef}
//   transactionItems={formState.items || []}
//   onItemsChange={updateItems}
//   invoice={formState.invoice}
//   onInvoiceChange={updateInvoice}
// />
//     // </div>
//   ];

//   return <DesktopLayout sections={sections} />;
// };

// export default InvoiceForm;
