import React, { useState, useEffect, forwardRef, KeyboardEvent } from "react";
import { supabase } from "../../lib/supabase";

interface Kit {
  id: string;
  kit_number: string;
  description: string;
  items: KitItem[];
}

interface KitItem {
  description: string;
  quantity: number;
  unit_price: number;
  gl_account?: string;
  gl_subaccount?: string;
  item_number?: string;
  item_group?: string;
}

interface KitComboboxProps {
  label: string;
  title: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  value?: string;
  onChange?: (value: string) => void;
  onKitSelect?: (kit: Kit) => void;
  onEnterPress?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  
}

const KitCombobox = forwardRef<HTMLInputElement, KitComboboxProps>(
  (
    {
      label,
      title,
      size = "md",
      value = "",
      onChange,
      onKitSelect,
      onEnterPress,
      onKeyDown,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [kits, setKits] = useState<Kit[]>([]);
    const [searchTerm, setSearchTerm] = useState(value);
    const [loading, setLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const sizeClasses = {
      xs: "w-20",
      sm: "w-32",
      md: "w-48",
      lg: "w-64",
      xl: "w-96",
      full: "w-full",
    };

    useEffect(() => {
      const fetchKits = async () => {
        if (searchTerm.length < 1) {
          setKits([]);
          return;
        }

        setLoading(true);
        const { data, error } = await supabase
          .from("kits")
          .select(
            `
          id,
          kit_number,
          description,
          items:kit_items (
            description,
            quantity,
            unit_price,
            gl_account,
            gl_subaccount,
            item_number,
            item_group
          )
        `
          )
          .or(
            `kit_number.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
          )
          .limit(10);

        if (!error && data) {
          setKits(data);
          if (data.length > 0 && isOpen) {
            setHighlightedIndex(0);
          }
        }
        setLoading(false);
      };

      const debounce = setTimeout(fetchKits, 300);
      return () => clearTimeout(debounce);
    }, [searchTerm, isOpen]);

    const handleSelect = (kit: Kit) => {
      setSearchTerm(kit.kit_number);
      onChange?.(kit.kit_number);
      onKitSelect?.(kit);
      setIsOpen(false);
      setHighlightedIndex(-1);
      if (onEnterPress) {
        setTimeout(onEnterPress, 0);
      }
    };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e)
    }
  }
    // const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    //   if (
    //     !isOpen &&
    //     (e.key === "ArrowDown" || e.key === "ArrowUp") &&
    //     kits.length > 0
    //   ) {
    //     e.preventDefault();
    //     setIsOpen(true);
    //     setHighlightedIndex(e.key === "ArrowDown" ? 0 : kits.length - 1);
    //     return;
    //   }

    //   if (isOpen && kits.length > 0) {
    //     switch (e.key) {
    //       case "ArrowDown":
    //         e.preventDefault();
    //         setHighlightedIndex((prev) =>
    //           prev < kits.length - 1 ? prev + 1 : 0
    //         );
    //         break;
    //       case "ArrowUp":
    //         e.preventDefault();
    //         setHighlightedIndex((prev) =>
    //           prev > 0 ? prev - 1 : kits.length - 1
    //         );
    //         break;
    //       case "Enter":
    //         e.preventDefault();
    //         if (highlightedIndex >= 0) {
    //           handleSelect(kits[highlightedIndex]);
    //         } else if (onEnterPress) {
    //           onEnterPress();
    //         }
    //         break;
    //       case "Escape":
    //         setIsOpen(false);
    //         setHighlightedIndex(-1);
    //         break;
    //       case "Tab":
    //         setIsOpen(false);
    //         setHighlightedIndex(-1);
    //         break;
    //     }
    //   } else if (e.key === "Enter" && onEnterPress) {
    //     e.preventDefault();
    //     onEnterPress();
    //   }
    // };

    const handleBlur = (e: React.FocusEvent) => {
      // Check if the related target is within the component
      if (
        !(e.currentTarget as HTMLElement).contains(
          e.relatedTarget as HTMLElement
        )
      ) {
        setTimeout(() => {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }, 200);
      }
    };

    return (
      <div className="relative" onBlur={handleBlur}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className={`relative ${sizeClasses[size]}`}>
          <input
            ref={ref}
            type="text"
            className="mt-1 h-10 text-[14px] block w-full rounded-md border border-gray-300 p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm || value}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onChange?.(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Enter kit number"
            title={title}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
            </div>
          )}
        </div>
        {isOpen && kits.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
            {kits.map((kit, index) => (
              <div
                key={kit.id}
                className={`px-4 py-2 cursor-pointer ${
                  index === highlightedIndex
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleSelect(kit)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="font-medium">{kit.kit_number}</div>
                {kit.description && (
                  <div className="text-sm text-gray-500">{kit.description}</div>
                )}
                <div className="text-xs text-gray-400">
                  {kit.items.length} items
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

KitCombobox.displayName = "KitCombobox";

export default KitCombobox;
