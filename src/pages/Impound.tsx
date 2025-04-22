import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Search,
  FileText,
  Eye,
  Edit,
  Mail,
  Printer,
  DollarSign,
  Image,
  File,
  History,
  Gavel,
  ChevronLeft,
  ChevronRight,
  Menu,
  GripVertical,
  ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";

function Impounds() {
  const { t } = useTranslation();

  const foxtow_id = localStorage.getItem("foxtow_id");
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [records, setRecords] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchVin, setSearchVin] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set([
      "Stock #",
      "Dispatch #",
      "Invoice #",
      "Account",
      "Vehicle",
      "Plate",
      "VIN",
      "Impound Date",
      "Days Held",
      "Total",
      "Balance Due",
      "Storage Lot",
    ])
  );
  const [orderedFields, setOrderedFields] = useState<string[]>(
    Array.from(selectedFields)
  );
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    {}
  );
  const [isResizing, setIsResizing] = useState(false);
  const resizingRef = useRef<{
    column: string;
    startX: number;
    startWidth: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const recordsPerPage = 25;
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Field mapping for database columns
  const fieldToColumnMap: { [key: string]: string } = {
    "Dispatch #": "dispnum",
    "Stock #": "stocknum",
    "Call #": "callnum",
    "Invoice #": "invoicenum",
    Account: "callname",
    Vehicle: "vehicle",
    Plate: "licensenum",
    VIN: "vin",
    "Impound Date": "towdate",
    "Days Held": "days",
    Total: "total",
    "Balance Due": "balancedue",
    "Storage Lot": "lotsection",
    "Call Reason": "reason",
    Driver: "driver",
    "Have Keys": "keysinfo",
    "Impound Reason": "impoundreason",
    "PO #": "ponum",
    Status: "status",
    "Towed From": "towedfrom",
    "Zip Code": "zipcode",
    Color: "colorcar",
    Make: "makecar",
    Model: "modelcar",
    Odometer: "odometer",
    "Plate State": "licensest",
    "Foxtow ID": "foxtow_id",
    "Lien Fee": "lienfee",
    "Lien Start": "liendin",
    "Lien Type": "lientype",
    "Lien Clear": "liendout",
  };

  const callType = [
    { value: "", label: t("impounds.filters.callTypes.none") },
    { value: "3", label: t("impounds.filters.callTypes.thirtyDayImpound") },
    { value: "A", label: t("impounds.filters.callTypes.abandoned") },
    { value: "H", label: t("impounds.filters.callTypes.holdForEvidence") },
    { value: "I", label: t("impounds.filters.callTypes.impoundRelease") },
    { value: "P", label: t("impounds.filters.callTypes.privateProperty") },
    { value: "R", label: t("impounds.filters.callTypes.recovered") },
    { value: "S", label: t("impounds.filters.callTypes.stored") },
    { value: "T", label: t("impounds.filters.callTypes.towed") },
    { value: "W", label: t("impounds.filters.callTypes.wreck") },
  ];

  // Field categories for the dropdown
  const fieldCategories = [
    {
      title: t("impounds.categories.callData"),
      fields: [
        "Call #",
        "Call Reason",
        "Driver",
        "Have Keys",
        "Impound Reason",
        "Invoice #",
        "PO #",
        "Status",
        "Stock #",
        "Storage Lot",
        "Towed From",
        "Zip Code",
      ],
    },
    {
      title: t("impounds.categories.customFields"),
      fields: [
        "Bid number",
        "Branch",
        "Car Sold Date?",
        "Case #",
        "Cat?",
        "Complete?",
        "Forsale?",
        "Impound Reason",
        "Lien Clear",
        "Lien Fee",
        "Lien Start",
        "Lien Type",
        "MC Coverage Amt",
      ],
    },
    {
      title: t("impounds.categories.dates"),
      fields: [
        "Arrival Time",
        "Completion Time",
        "Create Date",
        "Enroute Time",
        "Impound Date",
      ],
    },
    {
      title: t("impounds.categories.feesCharges"),
      fields: [
        "Balance Due",
        "Days Held",
        "Inv. Items",
        "Payments",
        "Storage Total",
        "Tax",
        "Total",
      ],
    },
    {
      title: t("impounds.categories.tasksReminders"),
      fields: [
        "Check to See if Car is Released",
        "Check to See if Car Sold",
        "Start Lien Complete Date",
        "Start Lien Due Date",
        "Take to Pick n Pull...",
      ],
    },
    {
      title: t("impounds.categories.vehicle"),
      fields: ["Color", "Make", "Model", "Odometer", "Plate", "Plate State"],
    },
  ];

  const newPageHandler = () => {
    navigate("/new-impound");
  };

  // Initialize column widths
  useEffect(() => {
    const initialWidths: { [key: string]: number } = {};
    orderedFields.forEach((field) => {
      initialWidths[field] = columnWidths[field] || 200; // Default width
    });
    setColumnWidths(initialWidths);
  }, [orderedFields]);

  // Update orderedFields when selectedFields changes
  useEffect(() => {
    setOrderedFields((prev) => {
      const newFields = Array.from(selectedFields);
      const existingFields = prev.filter((field) => selectedFields.has(field));
      const newlyAddedFields = newFields.filter(
        (field) => !prev.includes(field)
      );
      return [...existingFields, ...newlyAddedFields];
    });
  }, [selectedFields]);

  // Get display value for a field
  const getFieldValue = (record: any, field: string) => {
    const columnName = fieldToColumnMap[field];

    if (!columnName) return "-";

    const value = record[columnName];

    // console.log(columnName,"columnNAME==>",value,"value==>")
    if (field === "Impound Date" && value) {
      return formatDate(new Date(value));
    }

    if (field === "Have Keys") {
      return value || "-";
    }

    if (field === "Vehicle") {
      let vehicle = "";
      if (record.yearcar) {
        vehicle += `${record.yearcar} `;
      }
      if (record.makecar) {
        vehicle += `${record.makecar} `;
      }
      if (record.modelcar) {
        vehicle += `${record.modelcar} `;
      }
      if (record.colorcar) {
        vehicle += `${record.colorcar} `;
      }
      return vehicle.trim() || "-";
    } else if (field === "Total") {
      let total = 0;
      for (const trans of record.towtrans) {
        if (trans.price) {
          total += parseFloat(trans.quantity) * parseFloat(trans.price);
        }
      }
      return total || "-";
    }

    return value || "-";
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleResizeStart = (e: React.MouseEvent, field: string) => {
    e.preventDefault();
    e.stopPropagation();

    const startWidth = columnWidths[field] || 200;

    setIsResizing(true);
    resizingRef.current = {
      column: field,
      startX: e.clientX,
      startWidth,
    };

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizingRef.current) return;

    const { column, startX, startWidth } = resizingRef.current;
    const width = Math.max(100, startWidth + (e.clientX - startX));

    setColumnWidths((prev) => ({
      ...prev,
      [column]: width,
    }));
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    resizingRef.current = null;
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    field: string
  ) => {
    setDraggedColumn(field);
    e.currentTarget.classList.add("opacity-50");
    e.dataTransfer.setData("text/plain", field);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedColumn(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-400");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("border-blue-400");
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetField: string
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-400");

    if (!draggedColumn || draggedColumn === targetField) return;

    setOrderedFields((prev) => {
      const newOrder = [...prev];
      const draggedIdx = newOrder.indexOf(draggedColumn);
      const targetIdx = newOrder.indexOf(targetField);

      newOrder.splice(draggedIdx, 1);
      newOrder.splice(targetIdx, 0, draggedColumn);

      return newOrder;
    });
  };

  const toggleField = (field: string) => {
    const newSelectedFields = new Set(selectedFields);
    if (newSelectedFields.has(field)) {
      newSelectedFields.delete(field);
    } else {
      newSelectedFields.add(field);
    }
    setSelectedFields(newSelectedFields);
  };

  // const fetchImpounds = async (page: number, vinSearch?: string, callType?: string) => {
  //   setIsSearching(true);

  //   let query = supabase
  //     .from('towmast')
  // .eq("dispcleared", true)
  //     .select('*, towtrans(price,quantity)', { count: 'exact' }) // Include all fields from `towtrans`
  //     .eq('foxtow_id', foxtow_id);

  //   if (vinSearch) {
  //     query = query.or(`vin.ilike.%${vinSearch}%, licensenum.ilike.%${vinSearch}%`);
  //   }

  //   if (callType && callType !== 'all') {
  //     query = query.eq('calltype', callType);
  //   }

  //   try {
  //     const { count } = await supabase
  //       .from('towmast')
  //       .select(undefined, { count: 'exact' })
  // .eq("dispcleared", true)
  //       .eq('foxtow_id', foxtow_id);

  //     setTotalCount(count || 0);

  //     const { data, error } = await query
  //       .range((page - 1) * recordsPerPage, page * recordsPerPage - 1)
  //       .order('dispnum', { ascending: false });

  //     if (error) {
  //       console.error('Error fetching data:', error);
  //     } else {
  //       setRecords(data);
  //     }
  //   } catch (error) {
  //     console.error('Unexpected error:', error);
  //   }

  //   setIsSearching(false);
  // };

  // Debounced search function

  const fetchImpounds = async (
    page: number,
    vinSearch?: string,
    callType?: string
  ) => {
    setIsSearching(true);

    try {
      // Fetch `towmast` count
      const { count } = await supabase
        .from("towmast")
        .select(undefined, { count: "exact" }) // Only count
        .eq("foxtow_id", foxtow_id);
      // .eq("shown",true);

      setTotalCount(count || 0);

      // Fetch `towmast` data
      let query = supabase
        .from("towmast")
        .select("*")
        .eq("foxtow_id", foxtow_id)
        // .eq("shown",true)
        .eq("dispcleared", true)
        .range((page - 1) * recordsPerPage, page * recordsPerPage - 1)
        .order("updated_at", { ascending: false });
      // .order('dispnum', { ascending: false });

      // Apply vinSearch filter if provided
      if (vinSearch) {
        query = query.or(
          `vin.ilike.%${vinSearch}%, licensenum.ilike.%${vinSearch}%`
        );
      }

      // Apply callType filter if provided
      if (callType && callType !== "all") {
        query = query.eq("calltype", callType);
      }

      const { data: towmastData, error: towmastError } = await query;

      if (towmastError) {
        console.error("Error fetching towmasters:", towmastError);
        setIsSearching(false);
        return;
      }

      // Fetch `towtrans` data separately
      const { data: towtransData, error: towtransError } = await supabase
        .from("towtrans")
        .select("price, quantity, foxtow_id")
        .eq("foxtow_id", foxtow_id)
        .order("updated_at", { ascending: false });
      if (towtransError) {
        console.error("Error fetching towtrans:", towtransError);
      }
      const mergedData = towmastData.map((towmast) => ({
        ...towmast,
        towtrans: towtransData?.filter(
          (trans) => trans.foxtow_id === towmast.foxtow_id
        ),
      }));
      const sortedData = mergedData.sort((a, b) => {
        return (b?.dispnum || 0) - (a?.dispnum || 0);
      });
      setRecords(sortedData);
    } catch (error) {
      console.error("Unexpected error:", error);
    }

    setIsSearching(false);
  };

  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setCurrentPage(1);
          fetchImpounds(1, value, selectedCallType);
        }, 300);
      };
    })(),
    [selectedCallType]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchVin(value);
    debouncedSearch(value);
  };

  const handleCallTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const callType = e.target.value;
    setSelectedCallType(callType);
    setCurrentPage(1);
    fetchImpounds(1, searchVin, callType);
  };

  useEffect(() => {
    fetchImpounds(currentPage, searchVin, selectedCallType);
  }, [currentPage]);

  const clearSearch = () => {
    setSearchVin("");
    setCurrentPage(1);
    fetchImpounds(1, "", selectedCallType);
  };

  const handleRowClick = (id: string) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  const handleCheckboxClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(records.map((record: any) => record.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleDetailView = (dispatchNum: any, foxtow_id: any) => {
    navigate("/impound/detail", {
      state: { dispatchNum: dispatchNum, foxtow_id: foxtow_id },
    });
  };

  const handleModifyImpound = (dispatchNum: any) => {
    navigate("/invoice", { state: { dispatchNum: dispatchNum } });
  };

  function formatDate(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${month}/${day}/${year} ${formattedHours}:${minutes} ${period}`;
  }

  const totalPages = Math.ceil(totalCount / recordsPerPage);
  const isAllSelected = selectedRows.size === records.length;
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
    { id: "tab1", label: "Current", cur: true },
    { id: "tab2", label: "Released" },
    { id: "tab3", label: "Auction" },
    { id: "tab4", label: "All" },
  ];
  const calculateTableWidth = () => {
    let totalWidth = 40;
    orderedFields.forEach((field) => {
      totalWidth += columnWidths[field] || 200;
    });
    return totalWidth;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 flex flex-col ">
        {/* Header Actions */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => newPageHandler()}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <FileText size={20} />
            {t("impounds.actions.newImpound")}
          </button>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <FileText size={20} />
            {t("impounds.actions.createReport")}
          </button>
        </div>

        <div className="mb-4 flex flex-col items-end gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              {t("impounds.filters.filterBy")}:
            </span>
            <select
              className="border rounded px-3 py-1.5"
              value={selectedCallType}
              onChange={handleCallTypeChange}
            >
              {callType.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center w-full">
            {/* Tabs */}
            <div className="flex-shrink-0">
              <ul
                className="relative flex px-1.5 py-1.5 list-none gap-2 rounded-md bg-slate-100"
                role="list"
              >
                {tabs.map((tab) => (
                  <li key={tab.id} className="z-30 w-32 text-center">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`z-30 flex items-center justify-center w-full px-4 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer 
          ${
            activeTab === tab.id
              ? "text-slate-900 font-semibold bg-white"
              : "text-slate-600 bg-inherit"
          }`}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                    >
                      <span>{tab?.cur ? `${tab.label} (00)` : tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Menu size={20} className="text-gray-600" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-[600px] bg-white rounded-md shadow-lg py-2 z-10 grid grid-cols-3 gap-4 p-4">
                    {fieldCategories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="font-semibold text-gray-700 text-sm">
                          {category.title}
                        </h3>
                        <div className="space-y-1">
                          {category.fields.map((field, fieldIndex) => (
                            <label
                              key={fieldIndex}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={selectedFields.has(field)}
                                onChange={() => toggleField(field)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-600">
                                {field}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={t("impounds.search.placeholder")}
                  value={searchVin}
                  onChange={handleSearchChange}
                  className="pl-8 pr-4 py-1.5 border rounded w-64"
                />
                <Search
                  className="absolute left-2 top-2 text-gray-400"
                  size={20}
                />
                {isSearching && (
                  <div className="absolute right-2 top-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              {searchVin && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-4 py-1.5 border rounded hover:bg-gray-50"
                >
                  {t("impounds.actions.clear")}
                </button>
              )}
              <button type="button" className="px-4 py-1.5 border rounded">
                {t("impounds.actions.export")}
              </button>
              <button type="button" className="px-4 py-1.5 border rounded">
                {t("impounds.actions.print")}
              </button>
            </div>
          </div>
        </div>

        {/* Table Container with Fixed Height and Proper Scrolling */}
        <div className="flex flex-col flex-grow bg-white rounded-lg shadow overflow-hidden">
          {/* Table with fixed header */}
          <div className="flex-grow flex flex-col">
            <div
              className="overflow-auto"
              style={{ height: "calc(100vh - 280px)" }}
            >
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table
                    className="min-w-full divide-y divide-gray-300"
                    style={{ width: `${calculateTableWidth()}px` }}
                  >
                    <thead className="bg-gray-50 sticky top-0 z-20">
                      <tr>
                        <th className="group text-sm w-40 px-4 py-3 sticky left-0 z-30 text-center bg-gray-50 border-t border-b border-gray-300 border-x-0">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="cursor-pointer"
                          />
                        </th>
                        {orderedFields.map((field) => (
                          <th
                            key={field}
                            className="py-3 whitespace-nowrap text-left group relative text-xs border-t border-b border-gray-300 border-x-0"
                            style={{ width: columnWidths[field] || 200 }}
                          >
                            <div
                              draggable={!isResizing}
                              onDragStart={(e) => handleDragStart(e, field)}
                              onDragEnd={handleDragEnd}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, field)}
                              className="flex items-left gap-2 cursor-move px-2"
                            >
                              <GripVertical
                                size={16}
                                className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                              {field}
                            </div>
                            <div
                              className={`absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500 ${
                                isResizing ? "bg-blue-500" : ""
                              }`}
                              onMouseDown={(e) => handleResizeStart(e, field)}
                            />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {records.map((record: any) => (
                        <React.Fragment key={record.id}>
                          <tr
                            onClick={() => handleRowClick(record.id)}
                            className={`hover:bg-gray-50 text-sm text-center cursor-pointer ${
                              selectedRow === record.id ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="px-4 py-2 sticky left-0 z-10 text-center bg-white border-t border-b border-gray-300 border-x-0">
                              <input
                                type="checkbox"
                                checked={selectedRows.has(record.id)}
                                onChange={() => {}}
                                onClick={(e) =>
                                  handleCheckboxClick(e, record.id)
                                }
                                className="cursor-pointer"
                              />
                            </td>
                            {orderedFields.map((field) => (
                              <td
                                key={field}
                                className="px-4 py-2 whitespace-nowrap overflow-hidden text-xs text-ellipsis border-t border-b border-gray-300 border-x-0"
                                style={{ width: columnWidths[field] || 200 }}
                              >
                                {getFieldValue(record, field)}
                              </td>
                            ))}
                          </tr>
                          {selectedRow === record.id && (
                            <tr>
                              <td
                                colSpan={orderedFields.length + 1}
                                className="bg-gray-50 px-4 text-xs py-3 border-t border-b border-gray-300 border-x-0"
                              >
                                <div className="flex flex-wrap gap-4">
                                  <button
                                    onClick={() =>
                                      handleDetailView(
                                        record.dispnum,
                                        record?.foxtow_id
                                      )
                                    }
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                  >
                                    <Eye size={18} />{" "}
                                    {t("impounds.actions.viewImpound")}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleModifyImpound(record.dispnum)
                                    }
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                  >
                                    <Edit size={18} />{" "}
                                    {t("impounds.actions.modify")}
                                  </button>
                                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                    <FileText size={18} />{" "}
                                    {t("impounds.actions.impoundNotes")}
                                  </button>
                                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                    <Mail size={18} />{" "}
                                    {t("impounds.actions.email")}
                                  </button>
                                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                    <Printer size={18} />{" "}
                                    {t("impounds.actions.print")}
                                  </button>
                                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                    <DollarSign size={18} />{" "}
                                    {t("impounds.actions.recordPayment")}
                                  </button>
                                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                    <ImageIcon size={18} />{" "}
                                    {t("impounds.actions.photosVideos")}
                                  </button>
                                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                    <File size={18} />{" "}
                                    {t("impounds.actions.files")}
                                  </button>
                                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                    <History size={18} />{" "}
                                    {t("impounds.actions.impoundHistory")}
                                  </button>
                                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                    <Gavel size={18} />{" "}
                                    {t("impounds.actions.auction")}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination - Fixed at bottom */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
            <div className="text-sm text-gray-700">
              {t("impounds.table.showing")}{" "}
              {(currentPage - 1) * recordsPerPage + 1} {t("impounds.table.to")}{" "}
              {Math.min(currentPage * recordsPerPage, totalCount)}{" "}
              {t("impounds.table.of")} {totalCount}{" "}
              {t("impounds.table.records")}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <ChevronLeft size={16} /> {t("impounds.table.previous")}
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                {t("impounds.table.next")} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {isResizing && (
          <div className="fixed inset-0 bg-transparent cursor-col-resize" />
        )}
      </div>
    </div>
  );
}

export default Impounds;
