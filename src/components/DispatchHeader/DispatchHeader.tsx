"use client"

import { useRef } from "react"
import {DispatchedHeaderConstant} from "./constants.tsx";

function getBackgroundColor(type: string) {
    const firstChar = type.charAt(0)

    if (firstChar === "L") return "bg-gray-200"
    if (firstChar === "M") return "bg-green-200"
    if (firstChar === "H") return "bg-yellow-200"

    return "bg-gray-100"
}


export const DispatchHeader = () => {
    const scrollRef = useRef<HTMLDivElement>(null)

    return (
        <div className="relative w-full">
            <div
                ref={scrollRef}
                className="flex scrollbar-hide pb-2"
                style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
            >
                {DispatchedHeaderConstant.map((driver, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 w-[120px] h-[100px] border border-gray-300 flex flex-col items-center justify-between ${getBackgroundColor(driver.type)}`}
                    >
                        <div className="font-medium text-sm pt-1">{driver.name}</div>
                        <div className="flex-1 flex items-center justify-center w-full">
                            <img
                                src={driver.image || "/placeholder.svg"}
                                alt={`${driver.name}'s vehicle`}
                                width={80}
                                height={40}
                                className="object-contain w-auto h-12"
                            />
                        </div>
                        <div className="font-bold text-sm pb-1">{driver.type}</div>
                    </div>
                ))}
            </div>
        </div>
    );

}

DispatchHeader.displayName = "DispatchHeader"
