
import type React from "react"
import { useState, useEffect, type KeyboardEvent, useRef, useCallback } from "react"
import { Truck, FileDown, Printer, ChevronLeft, ChevronRight, CarFront, RefreshCcw, Newspaper } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import DriverModal from "../components/dispatch/DriverModal"
import toast, { Toaster } from "react-hot-toast"
import { DispatchHeader } from "../components/DispatchHeader/DispatchHeader"
import ClearModal from "../components/dispatch/ClearModal"

interface Driver {
  id: string
  driver_fir: string
  driver_las: string
  def_truckn: string
  color?: string
  driver_num: string
  creationda: string
  driver_ond: boolean
}

interface TowRecord {
  id: string
  driver?: string
  trucknum?: string
  timerec?: string
  timeinrt?: string
  timearrive?: string
  timeintow?: string
  timeclear?: string
  towmast: {
    priority: number
    callname?: string
    dispnum: string
    account?: string
    licensenum: string
    yearcar: string
    makecar: string
    colorcar: string
    callphone: string
    reason: string
    location?: string
    destination?: string
    dispatched: boolean
    updated_at: string
    equipment: string

    zone: string
    colors: {
      min1: number
      min2: number
      min3: number
      backcolor1: string
      backcolor2: string
      backcolor3: string
      backcolor4: string
      forecolor1: string
      forecolor2: string
      forecolor3: string
      forecolor4: string
    }
  }
}

function Dispatch() {
  const navigate = useNavigate()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [towRecords, setTowRecords] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any | null>(null)

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
    ]),
  )
  const [orderedFields, setOrderedFields] = useState<string[]>(Array.from(selectedFields))
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({})
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const resizingRef = useRef<{
    column: string
    startX: number
    startWidth: number
  } | null>(null)

  const recordsPerPage = 20
  const foxtow_id = localStorage.getItem("foxtow_id")

  // First, add this CSS class at the top of the component (right after all the useState declarations)
  const tableStyles = {
    table: "w-full border-collapse table-fixed",
    th: "relative py-2 text-center text-[13px] border border-gray-300 whitespace-nowrap overflow-hidden",
    td: "border border-gray-300 p-0 overflow-hidden",
    resizeHandle: "absolute top-0 right-0 w-4 h-full cursor-col-resize hover:bg-blue-500 z-10",
    input:
      "bg-transparent px-1 w-full text-left focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-0 m-0 box-border",
  }

  const handleTimeFieldRightClick = async (e: React.MouseEvent<HTMLInputElement>, recordId: string, field: string) => {
    e.preventDefault()

    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const timeString = `${hours}${minutes}`

    // Update local state
    setTowRecords((prevRecords) =>
      prevRecords.map((record) => (record.id === recordId ? { ...record, [field]: timeString } : record)),
    )

    // Save to database
    const { error } = await supabase
      .from("towdrive")
      .update({ [field]: timeString })
      .eq("id", recordId)

    if (error) {
      console.error("Error updating time:", error)
      toast.error("Failed to update time")
    }
  }

  const handleDriverAssignment = async (_driverId: string, driverNum: string, truckNum: string) => {
    if (!selectedRow) {
      toast.error("Please select a dispatch row first")
      return
    }
    const loadingToast = toast.loading("Assigning driver...")
    try {
      const now = new Date().toISOString()
      const nowDate = new Date(now)
      const timeInRoute = `${nowDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${nowDate.getMinutes().toString().padStart(2, "0")}`

      // Update the towdrive record
      const { error: updateError } = await supabase
        .from("towdrive")
        .update({
          driver: driverNum,
          trucknum: truckNum,
          timeinrt: timeInRoute,
        })
        .eq("id", selectedRow?.id)

      if (updateError) throw updateError

      // Update the towmast record to mark it as dispatched
      const { error: towmastError } = await supabase
        .from("towmast")
        .update({ dispatched: true })
        .eq("dispnum", towRecords.find((r) => r.id === selectedRow?.id)?.towmast.dispnum)

      if (towmastError) throw towmastError

      // Refresh the records
      await fetchTowRecords(currentPage)
      setSelectedRow(null)

      toast.dismiss(loadingToast)
      toast.success(`Driver ${driverNum} assigned successfully`)
    } catch (error) {
      console.error("Error assigning driver:", error)
      toast.dismiss(loadingToast)
      toast.error("Failed to assign driver. Please try again.")
    }
  }

  const fetchDrivers = async () => {
    const { data, error } = await supabase.from("drivers").select("*").eq("foxtow_id", foxtow_id).eq("driver_ond", true)

    if (error) {
      console.error("Error fetching drivers:", error)
    } else {
      setDrivers(data || [])
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])
  // .eq("dispcleared",false)
  const fetchTowRecords = useCallback(
    async (page: number) => {
      setIsLoading(true)
      try {
        if (page === 0) {
          const { count } = await supabase
            .from("towdrive")
            .select("*", { count: "exact", head: true })
            .eq("foxtow_id", foxtow_id)
            // .eq("shown",true)

          if (count !== null) {
            setTotalRecords(count)
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
            regstate,
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
            callremark,
            towedto,
            towedfrom,
            vin,
            whocalled,
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
        `,
          )
          .eq("foxtow_id", foxtow_id)
          // .eq("shown",true)
          .filter("towmast.dispcleared", "neq", true)
          .order("updated_at", { ascending: false })
          .range(page * recordsPerPage, (page + 1) * recordsPerPage - 1)

        if (error) {
          console.error("Error fetching tow records:", error)
        } else {
          // const sortedData = (data || []).sort((a: any, b: any) => {
          //   const aIsPriority1 = a.towmast.priority  === 1;
          //   const bIsPriority1 = b.towmast.priority === 1;
          //   if (aIsPriority1 && !bIsPriority1) return 1;
          //   if (!aIsPriority1 && bIsPriority1) return -1;
          //               const aIsDispatched = a.towmast.dispatched === true;
          //   const bIsDispatched = b.towmast.dispatched === true;
          //          if (aIsDispatched && !bIsDispatched) return -1
          //          if (!aIsDispatched && bIsDispatched) return 1
          //   if (aIsDispatched && bIsDispatched) {
          //     const aDate = new Date(a.towmast.updated_at);
          //     const bDate = new Date(b.towmast.updated_at);
          //     return bDate.getTime() - aDate.getTime();
          //   }

          //   if (aIsDispatched && !bIsDispatched) return -1;
          //   if (!aIsDispatched && bIsDispatched) return 1;
          //               return 0;
          // })
          const sortedData = (data || []).sort((a: any, b: any) => {
            // Define grouping logic
            const getGroup = (item: any) => {
              if (item.towmast.priority === 1 && item.towmast.dispatched) return 1
              if (item.towmast.dispatched) return 2
              if (item.towmast.priority !== 1) return 3
              return 4 // Non-dispatched with priority 1
            }

            const aGroup = getGroup(a)
            const bGroup = getGroup(b)

            // First sort by group priority
            if (aGroup !== bGroup) {
              return aGroup - bGroup // Lower group numbers come first
            }

            // Within same group, sort by latest updated_at
            const aDate = new Date(a.towmast.updated_at).getTime()
            const bDate = new Date(b.towmast.updated_at).getTime()
            return bDate - aDate
          })
          setTowRecords(sortedData)
          // setTowRecords(data ||  []);
        }
      } finally {
        setIsLoading(false)
      }
    },
    [foxtow_id],
  )

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage)
    await fetchTowRecords(newPage)
  }

  useEffect(() => {
    fetchTowRecords(0)
  }, [fetchTowRecords])

  const getRowStyle = (record: TowRecord) => {
    if (!record.towmast.colors) {
      return {}
    }

    if (record.towmast.dispatched) {
      return {}
    }

    const now = new Date()
    const updatedAt = new Date(record.towmast.updated_at)
    const elapsedMinutes = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60))
    const colors = record.towmast.colors

    let backgroundColor = colors.backcolor1
    let color = colors.forecolor1

    if (elapsedMinutes < colors.min1) {
      backgroundColor = colors.backcolor1
      color = colors.forecolor1
    } else if (elapsedMinutes < colors.min1 + colors.min2) {
      backgroundColor = colors.backcolor2
      color = colors.forecolor2
    } else if (elapsedMinutes < colors.min1 + colors.min2 + colors.min3) {
      backgroundColor = colors.backcolor3
      color = colors.forecolor3
    } else {
      backgroundColor = colors.backcolor4
      color = colors.forecolor4
    }

    return {
      backgroundColor: backgroundColor,
      color: color,
    }
  }

  const handleRowDoubleClick = (record: TowRecord) => {
    navigate("/quickcall", { state: { record, drivers } })
  }

  const handleDriverButtonClick = () => {
    setIsDriverModalOpen(true)
  }

  const handleDriverUpdate = () => {
    fetchDrivers()
  }

  const handleInputChange = (recordId: string, field: string, value: string) => {
    setTowRecords((prevRecords) =>
      prevRecords.map((record) => {
        if (record.id !== recordId) return record

        // Handle nested towmast fields
        if (field.startsWith("towmast.")) {
          const nestedField = field.split(".")[1]
          return {
            ...record,
            towmast: {
              ...record.towmast,
              [nestedField]: value,
            },
          }
        }

        // Handle top-level fields
        return {
          ...record,
          [field]: value,
        }
      }),
    )
  }

  const handleInputKeyDown = async (
    e: KeyboardEvent<HTMLInputElement>,
    recordId: string,
    field: string,
    value: string,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (field.startsWith("towmast.")) {
        const nestedField = field.split(".")[1]
        const { error } = await supabase
          .from("towmast")
          .update({ [nestedField]: value })
          .eq("dispnum", towRecords.find((r) => r.id === recordId)?.towmast.dispnum)

        if (error) {
          console.error("Error updating record:", error)
        }
      } else {
        // Handle top-level fields
        const { error } = await supabase
          .from("towdrive")
          .update({ [field]: value })
          .eq("id", recordId)

        if (error) {
          console.error("Error updating record:", error)
        }
      }
      await fetchTowRecords(currentPage)
    }
  }

  const totalPages = Math.ceil(totalRecords / recordsPerPage)

  //  show drivers
  const [activeDrivers, setActiveDrivers] = useState<any[]>([])

  useEffect(() => {
    fetchActiveDrivers()
  }, [])

  const fetchActiveDrivers = async () => {
    setIsLoading(true)
    try {
      // Fetch all active drivers
      const { data: drivers, error } = await supabase
        .from("drivers")
        .select("id, driver_fir, driver_las, def_truckn, driver_num, driver_ond, svg_urls ")
        .eq("foxtow_id", foxtow_id)
        .eq("driver_ond", true)
        .order("driver_fir", { ascending: true })

      if (error) {
        throw error
      }
      const driversWithImages: any[] = []
      for (const driver of drivers || []) {
        driversWithImages.push({
          driverId: driver.id,
          driverName: `${driver.driver_fir} ${driver.driver_las}`,
          truckNumber: driver.def_truckn || "No Truck",
          driverNumber: driver.driver_num || "No Number",
          images: driver?.svg_urls || [],
        })
      }

      setActiveDrivers(driversWithImages)
    } catch (error) {
      console.error("Error fetching active drivers:", error)
      toast.error("Failed to load active drivers")
    } finally {
      setIsLoading(false)
    }
  }

  // Then replace the handleResizeStart function with this improved version
  const handleResizeStart = (e: React.MouseEvent, field: string) => {
    e.preventDefault()
    e.stopPropagation()

    const headerCell = e.currentTarget.closest("th")
    const startWidth = headerCell ? headerCell.getBoundingClientRect().width : 100

    setIsResizing(true)
    resizingRef.current = {
      column: field,
      startX: e.clientX,
      startWidth,
    }

    // Add these event listeners to the document to handle mouse movements outside the table
    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  // Replace the handleResizeMove function with this improved version
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizingRef.current) return

    const { column, startX, startWidth } = resizingRef.current
    const width = Math.max(10, startWidth + (e.clientX - startX))

    setColumnWidths((prev) => ({
      ...prev,
      [column]: width,
    }))
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
    resizingRef.current = null
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, field: string) => {
    setDraggedColumn(field)
    e.currentTarget.classList.add("opacity-50")
    e.dataTransfer.setData("text/plain", field)
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("opacity-50")
    setDraggedColumn(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-blue-400")
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("border-blue-400")
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetField: string) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-blue-400")

    if (!draggedColumn || draggedColumn === targetField) return

    setOrderedFields((prev) => {
      const newOrder = [...prev]
      const draggedIdx = newOrder.indexOf(draggedColumn)
      const targetIdx = newOrder.indexOf(targetField)

      newOrder.splice(draggedIdx, 1)
      newOrder.splice(targetIdx, 0, draggedColumn)

      return newOrder
    })
  }

  const handleClick = async () => {
    setIsRotating(true)
    await fetchTowRecords(0)
    setTimeout(() => setIsRotating(false), 500)
  }

  const handleClearButtonClick = () => {
    if (!selectedRow) {
      toast.error("Please select a dispatch row first")
      return
    }
    setIsClearModalOpen(true)
  }

  // Also add this useEffect to initialize column widths with better defaults
  useEffect(() => {
    // Initialize column widths based on content
    const initialWidths: { [key: string]: number } = {}

    orderedFields.forEach((field) => {
      // Set default widths based on field type
      switch (field) {
        case "P":
          initialWidths[field] = 10
          break
        case "Disp #":
          initialWidths[field] = 25
          break
        case "Trk #":
          initialWidths[field] = 20
          break
        case "Driver":
          initialWidths[field] = 23
          break
        case "Rec":
        case "Inrt":
        case "Arvd":
        case "ITow":
          initialWidths[field] = 20
          break
        case "Company":
          initialWidths[field] = 70
          break
        case "Lic #":
          initialWidths[field] = 32
          break
        case "Year":
          initialWidths[field] = 28
          break
        case "Make":
        case "Color":
          initialWidths[field] = 25
          break
        case "Phone":
          initialWidths[field] = 50
          break
        case "Reason":
          initialWidths[field] = 30
          break
        case "Location":
        case "Destination":
          initialWidths[field] = 200
          break
        case "E":
          initialWidths[field] = 20
          break
        case "Z":
          initialWidths[field] = 20
          break
        default:
          initialWidths[field] = 100
      }
    })

    setColumnWidths(initialWidths)
  }, [orderedFields])

  return (
    <div className=" mx-auto p-0">
      <Toaster position="top-right" />
      <div className="flex flex-wrap gap-0">
        <div className="w-[80%]  h-auto">
          <DispatchHeader activeDrivers={activeDrivers} handleDriverAssignment={handleDriverAssignment} />
        </div>
        <div className="w-[20%] flex   h-auto py-2">
          <div className="flex flex-col w-full gap-2">
            <div className="grid grid-cols-3 gap-2 w-full">
              <button className="text-black px-2 py-1 border rounded-md hover:bg-gray-50 transition flex items-center justify-center w-full">
                <Link to="/quickcall" className="text-xs flex items-center justify-center">
                  <span className="text-xs">New Call</span>
                  <Newspaper className="w-3 h-3 ml-1" />
                </Link>
              </button>
              <button
                onClick={handleClearButtonClick}
                className="text-black px-2 py-1 border rounded-md hover:bg-gray-50 transition flex items-center justify-center w-full"
              >
                <span className="text-xs">Clear</span>
              </button>
              <button
                onClick={handleClick}
                className="relative flex items-center justify-center space-x-1 px-2 py-1 border rounded hover:bg-gray-50 text-black transition w-full"
              >
                <span className="text-xs">Refresh</span>
                <RefreshCcw className={`w-4 h-4 ml-1 transition-transform ${isRotating ? "animate-spin-once" : ""}`} />
              </button>
              <button className="relative flex items-center justify-center space-x-1 px-2 py-1 border rounded hover:bg-gray-50 text-black transition w-full">
                <span className="text-xs">Appt</span>
              </button>
              <button className="relative flex items-center justify-center space-x-1 px-2 py-1 border rounded hover:bg-gray-50 text-black transition w-full">
                <span className="text-xs">Cancel</span>
              </button>
              <select className="relative bg-gray-50 text-xs flex items-center justify-center space-x-1 px-2 py-1 border rounded hover:bg-gray-50 text-black transition w-full">
                <option className="All dispatches">All dispatches </option>
                <option className="Without appointments">Without appointments</option>
              </select>
            </div>
            <div className="grid grid-cols-4 gap-2 w-full">
              <Link to="/trucks" className="w-full">
                <button className="flex items-center justify-center space-x-1 px-2 py-1 border rounded hover:bg-gray-50 w-full">
                  <span className="text-xs">Trucks</span>
                  <Truck className="text-gray-700 w-4 h-4 ml-1" />
                </button>
              </Link>
              <button
                onClick={handleDriverButtonClick}
                className="flex items-center justify-center space-x-1 px-2 py-1 border rounded hover:bg-gray-50 text-xs w-full"
              >
                <span>Drivers</span>
                <CarFront size={16} className="text-gray-700 ml-1" />
              </button>
              <button className="flex items-center justify-center space-x-1 px-2 py-1 border rounded hover:bg-gray-50 text-xs w-full">
                <span>Export</span>
                <FileDown size={16} className="ml-1" />
              </button>
              <button className="flex items-center justify-center space-x-1 px-2 py-1 border rounded hover:bg-gray-50 text-xs w-full">
                <span>Print</span>
                <Printer size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className={tableStyles.table} style={{ tableLayout: "fixed" }}>
          <colgroup>
            {orderedFields.map((field) => (
              <col key={field} style={{ width: `${columnWidths[field] || 100}px` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-gray-50">
              {orderedFields.map((field) => (
                <th key={field} className={tableStyles.th} style={{ width: `${columnWidths[field] || 100}px` }}>
                  <div
                    draggable={!isResizing}
                    onDragStart={(e) => handleDragStart(e, field)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, field)}
                    className="flex items-center text-[11px]  cursor-move h-full"
                  >
                    {field}
                  </div>
                  <div
                    className={`${tableStyles.resizeHandle} ${
                      isResizing && resizingRef.current?.column === field ? "bg-blue-500" : ""
                    }`}
                    onMouseDown={(e) => handleResizeStart(e, field)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {isLoading ? (
              <tr>
                <td colSpan={orderedFields.length} className="text-center py-4 border border-gray-300">
                  Loading...
                </td>
              </tr>
            ) : (
              towRecords
                .filter((record) => !record.timeclear)
                .map((record) => (
                  <tr
                    key={record.towmast.dispnum}
                    className={`hover:bg-gray-50 text-left align-middle cursor-pointer ${
                      selectedRow?.id === record.id ? "bg-blue-50" : ""
                    }`}
                    style={getRowStyle(record)}
                    onClick={() => setSelectedRow(record)}
                    onDoubleClick={() => handleRowDoubleClick(record)}
                  >
                    {orderedFields.map((field) => {
                      const cellStyle = {
                        width: `${columnWidths[field] || 20}px`,
                        maxWidth: `${columnWidths[field] || 20}px`,
                        overflow: "hidden",
                      }

                      switch (field) {
                        case "P":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.priority || ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.priority", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.priority", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "1px" }}
                              />
                            </td>
                          )
                        case "Disp #":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <div className="px-0 py-2 truncate">{record.towmast.dispnum}</div>
                            </td>
                          )
                        case "Trk #":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <div className="px-0 py-2 truncate">{record.trucknum}</div>
                            </td>
                          )
                        case "Driver":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <div className="px-0 py-2 truncate">
                                {record.driver ? record.driver.substring(0, 10) : ""}
                              </div>
                            </td>
                          )
                        case "Rec":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.timerec || ""}
                                onChange={(e) => handleInputChange(record.id, "timerec", e.target.value)}
                                onKeyDown={(e) => handleInputKeyDown(e, record.id, "timerec", e.currentTarget.value)}
                                onContextMenu={(e) => handleTimeFieldRightClick(e, record.id, "timerec")}
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "2px" }}
                              />
                            </td>
                          )
                        case "Inrt":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.timeinrt || ""}
                                onChange={(e) => handleInputChange(record.id, "timeinrt", e.target.value)}
                                onKeyDown={(e) => handleInputKeyDown(e, record.id, "timeinrt", e.currentTarget.value)}
                                onContextMenu={(e) => handleTimeFieldRightClick(e, record.id, "timeinrt")}
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "Arvd":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.timearrive || ""}
                                onChange={(e) => handleInputChange(record.id, "timearrive", e.target.value)}
                                onKeyDown={(e) => handleInputKeyDown(e, record.id, "timearrive", e.currentTarget.value)}
                                onContextMenu={(e) => handleTimeFieldRightClick(e, record.id, "timearrive")}
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "ITow":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.timeintow || ""}
                                onChange={(e) => handleInputChange(record.id, "timeintow", e.target.value)}
                                onKeyDown={(e) => handleInputKeyDown(e, record.id, "timeintow", e.currentTarget.value)}
                                onContextMenu={(e) => handleTimeFieldRightClick(e, record.id, "timeintow")}
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "Company":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={(record.towmast.callname || "").substring(0, 15)}
                                onChange={(e) => handleInputChange(record.id, "towmast.callname", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.callname", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "Lic #":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.licensenum ? record.towmast.licensenum.slice(-7) : ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.licensenum", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.licensenum", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "Year":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.yearcar || ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.yearcar", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.yearcar", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "Make":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.makecar || ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.makecar", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.makecar", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "Color":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.colorcar || ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.colorcar", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.colorcar", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "Phone":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.callphone || ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.callphone", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.callphone", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "Reason":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.reason || ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.reason", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.reason", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "Location":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.towedfrom || ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.towedfrom", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.towedfrom", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "Destination":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.towedto || ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.towedto", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.towedto", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        case "E":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.equipment ? "E" : ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.equipment", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.equipment", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px", textAlign: "center" }}
                              />
                            </td>
                          )
                        case "Z":
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <input
                                value={record.towmast.zone || ""}
                                onChange={(e) => handleInputChange(record.id, "towmast.zone", e.target.value)}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, record.id, "towmast.zone", e.currentTarget.value)
                                }
                                className={tableStyles.input}
                                style={{ width: "100%", padding: "0px" }}
                              />
                            </td>
                          )
                        default:
                          return (
                            <td key={field} className={tableStyles.td} style={cellStyle}>
                              <div className="px-0 py-2">-</div>
                            </td>
                          )
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
          Showing {currentPage * recordsPerPage + 1} to {Math.min((currentPage + 1) * recordsPerPage, totalRecords)} of{" "}
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
              const pageNum = currentPage - 2 + i
              if (pageNum < 0 || pageNum >= totalPages) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pageNum + 1}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
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
      <ClearModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        selectedRow={selectedRow}
        fetchTowRecords={fetchTowRecords}
      />
    </div>
  )
}

export default Dispatch
