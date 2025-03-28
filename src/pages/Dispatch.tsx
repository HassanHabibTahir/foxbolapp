import type React from "react";
import { useState, useEffect, type KeyboardEvent, useRef } from "react";
import {
  Truck,
  FileDown,
  Printer,
  ChevronLeft,
  ChevronRight,
  CarFront,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import DriverModal from "../components/dispatch/DriverModal";
import toast, { Toaster } from "react-hot-toast";
import { DispatchHeader } from "../components/DispatchHeader/DispatchHeader";
// import {DispatchHeader} from "../components/DispatchHeader";

interface Driver {
  id: string;
  driver_fir: string;
  driver_las: string;
  def_truckn: string;
  color?: string;
  driver_num: string;
  creationda: string;
  driver_ond: boolean;
}

interface TowRecord {
  id: string;
  driver?: string;
  trucknum?: string;
  timerec?: string;
  timeinrt?: string;
  timearrive?: string;
  timeintow?: string;
  timeclear?: string;
  towmast: {
    priority: number;
    callname?: string;
    dispnum: string;
    account?: string;
    licensenum: string;
    yearcar: string;
    makecar: string;
    colorcar: string;
    callphone: string;
    reason: string;
    location?: string;
    destination?: string;
    dispatched: boolean;
    updated_at: string;
    equipment: string;
    zone: string;
    colors: {
      min1: number;
      min2: number;
      min3: number;
      backcolor1: string;
      backcolor2: string;
      backcolor3: string;
      backcolor4: string;
      forecolor1: string;
      forecolor2: string;
      forecolor3: string;
      forecolor4: string;
    };
  };
}

function Dispatch() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [towRecords, setTowRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set([
      "P",
      "Disp #",
      "Trk #",
      "Driver",
      "Rec",
      "Inrt",
      "Arvd",
      "ITow",
      "Company",
      "Lic #",
      "Year",
      "Make",
      "Color",
      "Phone",
      "Reason",
      "Location",
      "Destination",
      "E",
      "Z",
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

  const recordsPerPage = 25;
  const foxtow_id = localStorage.getItem("foxtow_id");

  const handleTimeFieldRightClick = async (
    e: React.MouseEvent<HTMLInputElement>,
    recordId: string,
    field: string
  ) => {
    e.preventDefault();

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}${minutes}`;

    // Update local state
    setTowRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === recordId ? { ...record, [field]: timeString } : record
      )
    );

    // Save to database
    const { error } = await supabase
      .from("towdrive")
      .update({ [field]: timeString })
      .eq("id", recordId);

    if (error) {
      console.error("Error updating time:", error);
      toast.error("Failed to update time");
    }
  };

  // const handleDriverAssignment = async (_driverId: string, driverNum: string, truckNum: string) => {
  //   if (!selectedRow) {
  //     toast.error('Please select a dispatch row first');
  //     return;
  //   }

  //   const loadingToast = toast.loading('Assigning driver...');

  //   try {
  //     const now = new Date().toISOString();
  //     const nowDate = new Date(now);
  //     const timeInRoute = `${nowDate.getHours().toString().padStart(2, '0')}:${nowDate.getMinutes().toString().padStart(2, '0')}`;

  //     // Update the towdrive record
  //     const { error: updateError } = await supabase
  //       .from('towdrive')
  //       .update({
  //         driver: driverNum,
  //         trucknum: truckNum,
  //         timeinrt: timeInRoute
  //       })
  //       .eq('id', selectedRow);

  //     if (updateError) throw updateError;

  //     // Update the towmast record to mark it as dispatched
  //     const { error: towmastError } = await supabase
  //       .from('towmast')
  //       .update({ dispatched: true })
  //       .eq('dispnum', towRecords.find(r => r.id === selectedRow)?.towmast.dispnum);

  //     if (towmastError) throw towmastError;

  //     // Refresh the records
  //     await fetchTowRecords(currentPage);
  //     setSelectedRow(null);

  //     toast.dismiss(loadingToast);
  //     toast.success(`Driver ${driverNum} assigned successfully`);
  //   } catch (error) {
  //     console.error('Error assigning driver:', error);
  //     toast.dismiss(loadingToast);
  //     toast.error('Failed to assign driver. Please try again.');
  //   }
  // };

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .eq("foxtow_id", foxtow_id)
      .eq("driver_ond", true);

    if (error) {
      console.error("Error fetching drivers:", error);
    } else {
      setDrivers(data || []);
    }
  };

  useEffect(() => {
    void fetchDrivers();
  }, []);

  const fetchTowRecords = async (page: number) => {
    setIsLoading(true);
    try {
      if (page === 0) {
        const { count } = await supabase
          .from("towdrive")
          
          .select("*", { count: "exact", head: true }).eq("foxtow_id", foxtow_id);

        if (count !== null) {
          setTotalRecords(count);
        }
      }
      const { data, error } = await supabase
        .from("towdrive")
        .select(
          `
          id,
          trucknum,
          timerec,
          timeinrt,
          timearrive,
          timeintow,
          driver,
          towmast!inner (
            priority,
            callname,
            dispnum,
            licensenum,
            yearcar,
            modelcar,
            makecar,
            colorcar,
            callphone,
            reason,
            dispatched,
            equipment,
            zone,
            destination,
            updated_at,
            colors(
              min1,
              min2,
              min3,
              backcolor1,
              backcolor2,
              backcolor3,
              backcolor4,
              forecolor1,
              forecolor2,
              forecolor3,
              forecolor4
            )
          )
        `
        ).eq("foxtow_id", foxtow_id)
        .order("updated_at", { ascending: false })
        .range(page * recordsPerPage, (page + 1) * recordsPerPage - 1);

      if (error) {
        console.error("Error fetching tow records:", error);
      } else {
        setTowRecords(data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    await fetchTowRecords(newPage);
  };

  useEffect(() => {
    fetchTowRecords(0);
  }, []);

  const getRowStyle = (record: TowRecord) => {
    if (!record.towmast.colors) {
      return {};
    }

    if (record.towmast.dispatched) {
      return {};
    }

    const now = new Date();
    const updatedAt = new Date(record.towmast.updated_at);
    const elapsedMinutes = Math.floor(
      (now.getTime() - updatedAt.getTime()) / (1000 * 60)
    );
    const colors = record.towmast.colors;

    let backgroundColor = colors.backcolor1;
    let color = colors.forecolor1;

    if (elapsedMinutes < colors.min1) {
      backgroundColor = colors.backcolor1;
      color = colors.forecolor1;
    } else if (elapsedMinutes < colors.min1 + colors.min2) {
      backgroundColor = colors.backcolor2;
      color = colors.forecolor2;
    } else if (elapsedMinutes < colors.min1 + colors.min2 + colors.min3) {
      backgroundColor = colors.backcolor3;
      color = colors.forecolor3;
    } else {
      backgroundColor = colors.backcolor4;
      color = colors.forecolor4;
    }

    return {
      backgroundColor: backgroundColor,
      color: color,
    };
  };

  const handleRowDoubleClick = (record: TowRecord) => {
    navigate("/quickcall", { state: { record, drivers } });
  };

  const handleDriverButtonClick = () => {
    setIsDriverModalOpen(true);
  };

  const handleDriverUpdate = () => {
    fetchDrivers();
  };

  const handleInputChange = (
    recordId: string,
    field: string,
    value: string
  ) => {
    setTowRecords((prevRecords) =>
      prevRecords.map((record) => {
        if (record.id !== recordId) return record;

        // Handle nested towmast fields
        if (field.startsWith("towmast.")) {
          const nestedField = field.split(".")[1];
          return {
            ...record,
            towmast: {
              ...record.towmast,
              [nestedField]: value,
            },
          };
        }

        // Handle top-level fields
        return {
          ...record,
          [field]: value,
        };
      })
    );
  };

  const handleInputKeyDown = async (
    e: KeyboardEvent<HTMLInputElement>,
    recordId: string,
    field: string,
    value: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Handle nested towmast fields
      if (field.startsWith("towmast.")) {
        const nestedField = field.split(".")[1];
        // console.log(nestedField,value,"value" "nextedFiedl")
        const { error } = await supabase
          .from("towmast")
          .update({ [nestedField]: value })
          // .eq("id",recordId)
          .eq(
            "dispnum",
            towRecords.find((r) => r.id === recordId)?.towmast.dispnum
          );

        if (error) {
          console.error("Error updating record:", error);
        }
      } else {
        // Handle top-level fields
        const { error } = await supabase
          .from("towdrive")
          .update({ [field]: value })
          .eq("id", recordId);

        if (error) {
          console.error("Error updating record:", error);
        }
      }
      await fetchTowRecords(currentPage);
    }
  };

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  //  show drivers
  const [activeDrivers, setActiveDrivers] = useState<any[]>([]);

  useEffect(() => {
    fetchActiveDrivers();
  }, []);

  const fetchActiveDrivers = async () => {
    setIsLoading(true);
    try {
      // Fetch all active drivers
      const { data: drivers, error } = await supabase
        .from("drivers")
        .select(
          "id, driver_fir, driver_las, def_truckn, driver_num, driver_ond, svg_urls "
        )
        .eq("foxtow_id", foxtow_id)
        .eq("driver_ond", true)
        .order("driver_fir", { ascending: true });

      if (error) {
        throw error;
      }
      const driversWithImages: any[] = [];
      for (const driver of drivers || []) {
        driversWithImages.push({
          driverId: driver.id,
          driverName: `${driver.driver_fir} ${driver.driver_las}`,
          truckNumber: driver.def_truckn || "No Truck",
          driverNumber: driver.driver_num || "No Number",
          images: driver?.svg_urls || [],
        });
      }

      setActiveDrivers(driversWithImages);
    } catch (error) {
      console.error("Error fetching active drivers:", error);
      toast.error("Failed to load active drivers");
    } finally {
      setIsLoading(false);
    }
  };
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
  return (
    <div className=" mx-auto p-0">
      <Toaster position="top-right" />
      <DispatchHeader activeDrivers={activeDrivers} />
      <div>
        <div className="flex justify-between flex-wrap items-center mb-4 mt-4">
          <div>
            <button className="bg-[#002B7F] text-white px-4 py-2 rounded-md hover:bg-[#002B7F] transition">
              <Link to="/quickcall">
              New Call
              </Link>
            </button>
          </div>
          <div className="flex flex-wrap items-center space-x-2">
            <Link to="/trucks">
              <button className="flex items-center space-x-1 px-4 py-1 border rounded hover:bg-gray-50">
                <Truck size={16} className="text-gray-700" /> Trucks
              </button>
            </Link>
            <button
              onClick={handleDriverButtonClick}
              className="flex items-center space-x-1 px-4 py-1 border rounded hover:bg-gray-50"
            >
              <CarFront size={16} className="text-gray-700" />

              <span>Drivers</span>
            </button>
            <button className="flex items-center space-x-1 px-5 py-1 border rounded hover:bg-gray-50">
              <FileDown size={16} />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-1 px-5 py-1 border rounded hover:bg-gray-50">
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full  border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {orderedFields.map((field) => (
                <th
                  key={field}
                  className="px-1 py-2  text-center text-[13px] border border-gray-300 whitespace-nowrap"
                  style={{ width: columnWidths[field] || 200 }}
                >
                  <div
                    draggable={!isResizing}
                    onDragStart={(e) => handleDragStart(e, field)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, field)}
                    className="flex items-center justify-center gap-2  cursor-move px-2"
                  >
                    {/* <GripVertical size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
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
          <tbody className="text-[12px]">
            {isLoading ? (
              <tr>
                <td
                  colSpan={17}
                  className="text-center py-4 border border-gray-300"
                >
                  Loading...
                </td>
              </tr>
            ) : (
              towRecords
                .filter((record) => !record.timeclear)
                .map((record) => (
                  <tr
                    key={record.towmast.dispnum}
                    className={`hover:bg-gray-50 text-center align-middle cursor-pointer ${
                      selectedRow === record.id ? "bg-blue-50" : ""
                    }`}
                    style={getRowStyle(record)}
                    onClick={() => setSelectedRow(record.id)}
                    onDoubleClick={() => handleRowDoubleClick(record)}
                  >
                    {orderedFields.map((field) => {
                      // Render different cell content based on field name
                      switch (field) {
                        case "P":
                          return (
                            <td
                              key={field}
                              className="px-1 text-center align-middle py-2 border border-gray-300 w-4"
                            >
                              <input
                                value={record.towmast.priority || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.priority",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.priority",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent w-4 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                              />
                            </td>
                          );
                        case "Disp #":
                          return (
                            <td
                              key={field}
                              className="px-0 py-2 border border-gray-300"
                            >
                              {record.towmast.dispnum}
                            </td>
                          );
                        case "Trk #":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border border-gray-300"
                            >
                              {record.trucknum}
                            </td>
                          );
                        case "Driver":
                          return (
                            <td
                              key={field}
                              className="px-2 py-2 border border-gray-300"
                            >
                              {record.driver
                                ? record.driver.substring(0, 10)
                                : ""}
                            </td>
                          );
                        case "Rec":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 w-10 border border-gray-300"
                            >
                              <input
                                value={record.timerec || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "timerec",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "timerec",
                                    e.currentTarget.value
                                  )
                                }
                                onContextMenu={(e) =>
                                  handleTimeFieldRightClick(
                                    e,
                                    record.id,
                                    "timerec"
                                  )
                                }
                                className="bg-transparent w-full text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "Inrt":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border w-10 border-gray-300"
                            >
                              <input
                                value={record.timeinrt || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "timeinrt",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "timeinrt",
                                    e.currentTarget.value
                                  )
                                }
                                onContextMenu={(e) =>
                                  handleTimeFieldRightClick(
                                    e,
                                    record.id,
                                    "timeinrt"
                                  )
                                }
                                className="bg-transparent w-full text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "Arvd":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 w-8 border border-gray-300"
                            >
                              <input
                                value={record.timearrive || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "timearrive",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "timearrive",
                                    e.currentTarget.value
                                  )
                                }
                                onContextMenu={(e) =>
                                  handleTimeFieldRightClick(
                                    e,
                                    record.id,
                                    "timearrive"
                                  )
                                }
                                className="bg-transparent w-full text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "ITow":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 w-8 border border-gray-300"
                            >
                              <input
                                value={record.timeintow || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "timeintow",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "timeintow",
                                    e.currentTarget.value
                                  )
                                }
                                onContextMenu={(e) =>
                                  handleTimeFieldRightClick(
                                    e,
                                    record.id,
                                    "timeintow"
                                  )
                                }
                                className="bg-transparent w-full text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "Company":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border border-gray-300"
                            >
                              <input
                                value={(
                                  record.towmast.callname || ""
                                ).substring(0, 15)}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.callname",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.callname",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent w-28 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "Lic #":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 w-16 border border-gray-300"
                            >
                              <input
                                value={
                                  record.towmast.licensenum
                                    ? record.towmast.licensenum.slice(-7)
                                    : ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.licensenum",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.licensenum",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent w-full text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "Year":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 w-10 border border-gray-300"
                            >
                              <input
                                value={record.towmast.yearcar || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.yearcar",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.yearcar",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent w-full text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "Make":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border border-gray-300"
                            >
                              <input
                                value={record.towmast.makecar || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.makecar",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.makecar",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent w-full text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "Color":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border border-gray-300"
                            >
                              <input
                                value={record.towmast.colorcar || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.colorcar",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.colorcar",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent w-full text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "Phone":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border border-gray-300"
                            >
                              <input
                                value={record.towmast.callphone || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.callphone",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.callphone",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent text-center w-24 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "Reason":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border border-gray-300"
                            >
                              <input
                                value={record.towmast.reason || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.reason",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.reason",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent w-24 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0"
                              />
                            </td>
                          );
                        case "Location":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border border-gray-300 min-w-[200px]"
                            >
                              {record.towmast.location}
                            </td>
                          );
                        case "Destination":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border border-gray-300 min-w-[200px]"
                            >
                              <input
                                // value={"asdfasdf"}
                                value={record.towmast.destination || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.destination",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.destination",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent w-full text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                              />
                            </td>
                          );
                        case "E":
                          return (
                            <td
                              key={field}
                              className="px-0 py-2 border border-gray-300 w-5 text-center"
                            >
                              <input
                                value={record.towmast.equipment ? "E" : ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.equipment",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.equipment",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0 text-center"
                              />
                            </td>
                          );
                        case "Z":
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border border-gray-300"
                            >
                              <input
                                value={record.towmast.zone || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    record.id,
                                    "towmast.zone",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleInputKeyDown(
                                    e,
                                    record.id,
                                    "towmast.zone",
                                    e.currentTarget.value
                                  )
                                }
                                className="bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                              />
                            </td>
                          );
                        default:
                          return (
                            <td
                              key={field}
                              className="px-1 py-2 border border-gray-300"
                            >
                              -
                            </td>
                          );
                      }
                    })}
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {currentPage * recordsPerPage + 1} to{" "}
          {Math.min((currentPage + 1) * recordsPerPage, totalRecords)} of{" "}
          {totalRecords} records
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0 || isLoading}
            className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage - 2 + i;
              if (pageNum < 0 || pageNum >= totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage >= totalPages - 1 || isLoading}
            className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <DriverModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onDriverUpdate={handleDriverUpdate}
        fetchActiveDrivers={fetchActiveDrivers}
      />
    </div>
  );
}

export default Dispatch;
