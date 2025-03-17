import React from 'react';
import { useRef, useState, useEffect } from "react"
import { DispatchedHeaderConstant } from "./constants"
import { ChevronLeft, ChevronRight } from "lucide-react"

function getBackgroundColor(type: string) {
    const firstChar = type.charAt(0)

    if (firstChar === "L") return "bg-gray-200"
    if (firstChar === "M") return "bg-green-200"
    if (firstChar === "H") return "bg-yellow-200"

    return "bg-gray-100"
}

export const DispatchHeader = () => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const checkScroll = () => {
        if (!scrollRef.current) return

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (scrollContainer) {
            checkScroll()
            scrollContainer.addEventListener("scroll", checkScroll)
            window.addEventListener("resize", checkScroll)
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", checkScroll)
                window.removeEventListener("resize", checkScroll)
            }
        }
    }, [])

    const scrollLeft = () => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({ left: -240, behavior: "smooth" })
    }

    const scrollRight = () => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({ left: 240, behavior: "smooth" })
    }

    return (
        <div className="relative w-full">
            {canScrollLeft && (
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
            )}

            <div
                ref={scrollRef}
                className="flex scrollbar-hide pb-2 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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

            {canScrollRight && (
                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            )}
        </div>
    )
}

DispatchHeader.displayName = "DispatchHeader"

