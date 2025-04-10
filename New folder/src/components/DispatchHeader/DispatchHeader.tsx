import React from "react";
import { useRef, useState, useEffect } from "react";
import { DispatchedHeaderConstant } from "./constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Truck, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

interface Driver {
  id: string;
  driver_fir: string;
  driver_las: string;
  def_truckn: string;
  driver_num: string;
  driver_ond: boolean;
}

interface DriverImages {
  driverId: string;
  driverName: string;
  truckNumber: string;
  driverNumber: string;
  images: string[];
}

function getBackgroundColor(type: string) {
  // const firstChar = type.charAt(0)

  // if (firstChar === "L") return "bg-gray-200"
  // if (firstChar === "M") return "bg-green-200"
  // if (firstChar === "H") return "bg-yellow-200"

  return "bg-gray-100";
}

export const DispatchHeader = ({
  activeDrivers,
  handleDriverAssignment,
}: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      checkScroll();
      scrollContainer.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex  flex-wrap scrollbar-hide pb-2 gap-1 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {activeDrivers &&
          activeDrivers.length > 0 &&
          activeDrivers.map((driver: any, index: any) => (
            <div
              key={index}
              onClick={() =>
                handleDriverAssignment(
                  driver.driverId,
                  driver.driverNumber,
                  driver.truckNumber
                )
              }
              className={`cursor-pointer  flex-shrink-0 w-[90px] h-[70px] border border-gray-300 flex flex-col items-center justify-between ${getBackgroundColor(
                driver.truckNumber
              )}`}
            >
              <div className="font-semibold text-[10px] w-full text-center px-1 h-[15px] overflow-hidden text-ellipsis whitespace-nowrap">
                {driver.driverName &&
                driver.driverName.trim().split(" ").length > 1
                  ? `${driver.driverName.split(" ")[0]} ${
                      driver.driverName.split(" ")[1]?.[0]
                    }`
                  : driver.driverName.split(" ")[0]}
              </div>

              <div className="w-10 h-10 flex items-center justify-center">
                {driver?.images?.length > 0 ? (
                  <img
                    src={driver.images[0] || "/placeholder.png"}
                    alt={`${driver.driverName}'s vehicle`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src="/placeholder.png"
                      alt="No image"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="font-bold text-xs w-full text-center h-[20px] flex items-center justify-center">
                {driver.truckNumber}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

DispatchHeader.displayName = "DispatchHeader";
