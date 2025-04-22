import type React from "react"
import { forwardRef, useState, useEffect, useRef, useCallback } from "react"
import { CalendarIcon } from "lucide-react"

interface DateInputProps {
  label: string
  title: string
  className?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full"
  value?: string
  onChange?: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  fieldName?: any
  FIELD_INDEXES?: any
  inputRefs?: any
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      title,
      className = "",
      size = "sm",
      value = "",
      onChange = () => {},
      onKeyDown,
      fieldName,
      FIELD_INDEXES,
      inputRefs,
    },
    ref,
  ) => {
      // Parse string date to Date object
      const parseStringToDate = useCallback((dateStr: string): Date | undefined => {
        if (!dateStr) return undefined
  
        const parts = dateStr.split("/")
        if (parts.length === 3) {
          const month = Number.parseInt(parts[0], 10) - 1 // JS months are 0-indexed
          const day = Number.parseInt(parts[1], 10)
          const year = Number.parseInt(parts[2], 10)
  
          const date = new Date(year, month, day)
          // Validate the date is valid
          if (!isNaN(date.getTime())) {
            return date
          }
        }
  
        return undefined
      }, [])
  
    const [internalValue, setInternalValue] = useState(value)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value ? parseStringToDate(value) : undefined)
    const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date())
    const calendarRef = useRef<HTMLDivElement>(null)
    const calendarButtonRef = useRef<HTMLButtonElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

  
    // Format Date object to string
    function formatDateToString(date: Date | undefined): string {
      if (!date || isNaN(date.getTime())) return ""

      const month = date.getMonth() + 1 
      const day = date.getDate()
      const year = date.getFullYear()

      return `${month}/${day}/${year}`
    }
    function formatDate(dateString:any) {
      // Agar input empty hai to wahi return kar do
      if (!dateString) return "";
  
      // Agar input incomplete hai (e.g., user typing) to format apply na karein
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  
      const date = new Date(dateString);

      // Agar invalid date hai to wahi return kar do
      if (isNaN(date.getTime())) return dateString;
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear();
  
      return `${month}/${day}/${year}`;
  }
  
    useEffect(() => {
      if(value){
        setInternalValue(formatDate(value))

      }
   
      const parsedDate = parseStringToDate(value)
      setSelectedDate(parsedDate)
      if (parsedDate) {
        setCurrentMonth(parsedDate)
      }
    }, [value, parseStringToDate])

    // Close calendar when clicking outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          calendarRef.current &&
          !calendarRef.current.contains(event.target as Node) &&
          !inputRef.current?.contains(event.target as Node)
        ) {
          setIsCalendarOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value

      // Remove any non-digit or non-slash characters
      const cleanedInput = input.replace(/[^\d/]/g, "")

      // Format as user types - don't allow more than 10 characters (MM/DD/YYYY)
      if (cleanedInput.length <= 10) {
        let formattedValue = cleanedInput

        if (cleanedInput.length > 2 && !cleanedInput.includes("/")) {
          // Add first slash after month
          formattedValue = `${cleanedInput.substring(0, 2)}/${cleanedInput.substring(2)}`
        }
        if (cleanedInput.length > 5 && formattedValue.indexOf("/", 3) === -1) {
          // Add second slash after day
          formattedValue = `${formattedValue.substring(0, 5)}/${formattedValue.substring(5)}`
        }

        setInternalValue(formattedValue)
        onChange(formattedValue)

        const parsedDate = parseStringToDate(formattedValue)
        setSelectedDate(parsedDate)
        if (parsedDate) {
          setCurrentMonth(parsedDate)
        }
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) {
        const currentIndex = FIELD_INDEXES?.[fieldName]

        const input = e.target as HTMLInputElement
        const currentValue = input.value
        if (e.key === "Backspace") {
          return
        }
        if (currentValue.length === 10 && FIELD_INDEXES && inputRefs) {
          const nextField = Object.keys(FIELD_INDEXES).find((key) => FIELD_INDEXES[key] === currentIndex + 1)
          if (nextField) inputRefs[nextField].current?.focus()
        }

        onKeyDown(e)
      }
    }

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault()

      if (internalValue) {
        setInternalValue("")
        onChange("")
        setSelectedDate(undefined)
        return
      }

      const now = new Date()
      const formattedDate = formatDateToString(now)

      setInternalValue(formattedDate)
      onChange(formattedDate)
      setSelectedDate(now)
      setCurrentMonth(now)
    }

    const handleDateSelect = (date: Date) => {
      const formattedDate = formatDateToString(date)
      setInternalValue(formattedDate)
      onChange(formattedDate)
      setSelectedDate(date)
      setIsCalendarOpen(false)

      // Move to next field if available
      if (FIELD_INDEXES && inputRefs && fieldName) {
        const currentIndex = FIELD_INDEXES[fieldName]
        const nextField = Object.keys(FIELD_INDEXES).find((key) => FIELD_INDEXES[key] === currentIndex + 1)
        if (nextField) inputRefs[nextField].current?.focus()
      }
    }

    // const handleDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    //   const currentValue = e.target.value

    //   if (currentValue) {
    //     const parts = currentValue.split("/")
    //     if (parts.length === 3) {
    //       const month = Number.parseInt(parts[0], 10)
    //       const day = Number.parseInt(parts[1], 10)
    //       const year = Number.parseInt(parts[2], 10)

    //       // Validate month and day
    //       if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year > 0) {
    //         const formattedDate = `${month}/${day}/${year}`
    //         setInternalValue(formattedDate)
    //         onChange(formattedDate)

    //         const parsedDate = parseStringToDate(formattedDate)
    //         setSelectedDate(parsedDate)
    //         if (parsedDate) {
    //           setCurrentMonth(parsedDate)
    //         }
    //       }
    //     } else if (parts.length === 1 && parts[0].length <= 2) {
    //       // Handle short years (convert 23 to 2023)
    //       const currentYear = new Date().getFullYear()
    //       const century = Math.floor(currentYear / 100) * 100
    //       const fullYear = century + Number.parseInt(parts[0].padStart(2, "0"), 10)

    //       setInternalValue(`1/1/${fullYear}`)
    //       onChange(`1/1/${fullYear}`)
    //     }
    //   }

    //   // Use setTimeout to allow clicking on calendar before it closes
    //   setTimeout(() => {
    //     if (!calendarRef.current?.contains(document.activeElement)) {
    //       setIsCalendarOpen(false)
    //     }
    //   }, 0)
    // }

    const sizeClasses = {
      xs: "w-20",
      sm: "w-32",
      md: "w-48",
      lg: "w-64",
      xl: "w-96",
      full: "w-full",
    }

    // Calendar navigation functions
    const goToPreviousMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const goToNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    // Generate calendar days
    const generateCalendarDays = () => {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()

      // First day of the month
      const firstDay = new Date(year, month, 1)
      // Last day of the month
      const lastDay = new Date(year, month + 1, 0)

      // Day of the week for the first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDay.getDay()

      // Total days in the month
      const daysInMonth = lastDay.getDate()

      // Array to hold all calendar days
      const days = []

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null)
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day))
      }

      return days
    }

    const days = generateCalendarDays()
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const isToday = (date: Date) => {
      const today = new Date()
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      )
    }

    const isSameDay = (date1: Date | undefined, date2: Date | undefined) => {
      if (!date1 || !date2) return false
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      )
    }

    return (
      <div className={size === "full" ? "w-full" : "inline-block"}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex relative">
          <input
            ref={(el) => {
              if (typeof ref === "function") {
                ref(el)
              } else if (ref) {
                ref.current = el
              }
              // inputRef.current = el
            }}
           
            autoComplete="off"
            type="text"
            className={`mt-0 block ${sizeClasses[size]} rounded-l-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
            title={`${title} (Format: M/D/YYYY, Right-click to insert/clear date)`}
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsCalendarOpen(true)}
            onBlur={(e) => {
              // Delay closing to allow clicking on calendar
              setTimeout(() => {
                if (!calendarRef.current?.contains(document.activeElement)) {
                  setIsCalendarOpen(false)
                }
              }, 0)
            }}
            maxLength={10}
            onContextMenu={handleContextMenu}
           
            placeholder="M/D/YYYY"
          />
          <button
            ref={calendarButtonRef}
            type="button"
            className="mt-0 rounded-l-none rounded-r-md border border-l-0 border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            aria-label="Toggle calendar"
          >
            <CalendarIcon className="h-4 w-4" />
          </button>

          {isCalendarOpen && (
            <div
              ref={calendarRef}
              className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2"
              style={{ width: "220px" }}
            >
              <div className="space-y-4">
                {/* Calendar header */}
                <div className="flex justify-between items-center mb-2">
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600"
                    onClick={goToPreviousMonth}
                    aria-label="Previous month"
                  >
                    &lt;
                  </button>
                  <div className="font-semibold text-sm">
                    {monthNames[currentMonth.getMonth()].slice(0, 3)} {currentMonth.getFullYear()}
                  </div>
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600"
                    onClick={goToNextMonth}
                    aria-label="Next month"
                  >
                    &gt;
                  </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400 ">
                  {weekdays.map((day, index) => (
                    <div key={index}>{day}</div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => (
                    <div key={index} className="text-center">
                      {day ? (
                        <button
                          type="button"
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors
               ${isSameDay(day, selectedDate) ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-gray-100"}
               ${isToday(day) && !isSameDay(day, selectedDate) ? "border border-blue-500" : ""}
             `}
                          onClick={() => handleDateSelect(day)}
                        >
                          {day.getDate()}
                        </button>
                      ) : (
                        <span className="w-6 h-6 block"></span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Today button */}
                <div className="text-center mt-2">
                  <button
                    type="button"
                    className="px-2 py-1 text-xs text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                    onClick={() => {
                      const today = new Date()
                      handleDateSelect(today)
                    }}
                  >
                    Today
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  },
)

DateInput.displayName = "DateInput"

export default DateInput

