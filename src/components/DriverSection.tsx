import type React from "react"
import { forwardRef } from "react"
import FormSection from "./common/FormSection"
import DriverCombobox from "./common/DriverCombobox"
import StatusSection from "./StatusSection"

interface Driver {
  driver?: string
  driver2?: string
  timerec?: string
  timeinrt?: string
  timearrive?: string
  timeintow?: string
  timeclear?: string
}

interface DriverSectionProps {
  driver: Driver
  onUpdateDriver: (data: Partial<Driver>) => void
  handleKeyDown?: (e: React.KeyboardEvent<HTMLElement>, index: number) => void
  inputRefs?: {
    driver1: React.RefObject<HTMLInputElement>
    driver2: React.RefObject<HTMLInputElement>
    receivedRef: React.RefObject<HTMLInputElement>
    enRouteRef: React.RefObject<HTMLInputElement>
    arrivedRef: React.RefObject<HTMLInputElement>
    loadedRef: React.RefObject<HTMLInputElement>
    clearedRef: React.RefObject<HTMLInputElement>
  }
}

const DriverSection = forwardRef<HTMLDivElement, DriverSectionProps>(
  ({ driver, onUpdateDriver, handleKeyDown, inputRefs }, ref) => {
    return (
      <FormSection title="Driver Information">
        <div ref={ref} className="flex flex-wrap items-center gap-x-1">
          <DriverCombobox
            label="Driver 1"
            title="master.driver"
            size="md"
            value={driver.driver || ""}
            onChange={(value) => onUpdateDriver({ driver: value })}
            // onKeyDown={(e:any) => handleKeyDown(e, 0)}
            // ref={inputRefs.driver1}
          />
          <DriverCombobox
            label="Driver 2"
            title="master.driver2"
            size="md"
            value={driver.driver2 || ""}
            onChange={(value) => onUpdateDriver({ driver2: value })}
            // onKeyDown={(e:any) => handleKeyDown(e, 1)}
            // ref={inputRefs.driver2}
          />
          <div className="flex-grow">
            

            <StatusSection
              handleKeyDown={handleKeyDown}
              inputRefs={inputRefs}
              times={driver}
              onTimeChange={(field, value) => onUpdateDriver({ [field]: value })}
            />
          </div>
        </div>
      </FormSection>
    )
  },
)

DriverSection.displayName = "DriverSection"

export default DriverSection

