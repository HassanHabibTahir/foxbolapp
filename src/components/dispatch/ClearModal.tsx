import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

interface ClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRow?: any;
  fetchTowRecords?: any;
}

const ClearModal: React.FC<ClearModalProps> = ({
  isOpen,
  onClose,
  selectedRow,
  fetchTowRecords,
}) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    try {
      if (!selectedRow) {
        toast.error("Please select a dispatch row first");
        return;
      }
      const militaryTimeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!militaryTimeRegex.test(currentTime)) {
        alert("Please enter a valid military time (HH:MM)");
        return;
      }
      const [enteredHours, enteredMinutes] = currentTime.split(":").map(Number);
      const foxtow_id = localStorage.getItem("foxtow_id");
      const now = new Date();
      const enteredDate = new Date(now);
      enteredDate.setHours(enteredHours, enteredMinutes, 0, 0);
      const timeDiff = enteredDate.getTime() - now.getTime();
      let dispatchedClear = false;
      if (timeDiff <= 0) {
        dispatchedClear = true;
      } else if (timeDiff > 3600000) {
        const enteredDatePrevDay = new Date(enteredDate);
        enteredDatePrevDay.setDate(enteredDatePrevDay.getDate() - 1);
        dispatchedClear = enteredDatePrevDay <= now;
      } else {
        dispatchedClear = false;
      }

      const { data, error } = await supabase
        .from("towmast")
        .select("*")
        .eq("dispatched", true)
        .eq("foxtow_id", foxtow_id)
        .eq("dispnum", selectedRow?.towmast?.dispnum)
        .single();
      if (!data) {
        toast.error(
          "Dispatch not completed yet. Please dispatch before proceeding."
        );
        return;
      }

      const { error: errortowdrive } = await supabase
        .from("towdrive")
        .update({
          timeclear: currentTime,
          dispcleared: dispatchedClear,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedRow.id)
        .eq("foxtow_id", foxtow_id);
      const { error: updateError } = await supabase
        .from("towmast")
        .update({
          dispcleared: dispatchedClear,
          updated_at: new Date().toISOString(),
        })
        .eq("dispnum", selectedRow?.towmast?.dispnum)
        .eq("foxtow_id", foxtow_id);

      if (error || errortowdrive || updateError) {
        toast.error("Failed to clear dispatch");
        console.error(
          "Error clearing dispatch:",
          error || errortowdrive || updateError
        );
        return;
      }

      await fetchTowRecords(0);

      onClose();
    } catch (err) {
      console.log(err, "error ====>");
    }
  };

  if (!isOpen) return null;
  console.log(selectedRow, "selectedRow");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <h2 className="text-lg text-center font-bold text-[#F21700]">
            {selectedRow?.towmast?.dispnum ?? ""}
          </h2>
        <h2 className="text-xl font-semibold text-[#002B7F] text-center mb-4">
          I am clearing this call at:
        </h2>
        <div>
      
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 border border-red-600 rounded-full p-1 hover:bg-red-100 hover:text-red-800"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-center space-x-4 py-2">
      

          <input
            type="text"
            id="clearTime"
            value={currentTime}
            disabled={true}
            // onChange={(e) => {
            //   const value = e.target.value;
            //   // Remove non-digit characters
            //   const digits = value.replace(/\D/g, "");

            //   // Format with colon insertion
            //   let formatted = digits;
            //   if (digits.length > 2) {
            //     formatted = `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
            //   } else if (digits.length === 2 && value.length === 3) {
            //     // Handle backspace case after colon
            //     formatted = digits;
            //   }

            //   // Limit to 4 digits (HHMM)
            //   formatted = formatted.slice(0, 5);
            //   setCurrentTime(formatted);
            // }}
            placeholder="HH:MM"
            className="w-32 p-3 border border-gray-300 rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      <div className="text-center">
      <div className="">
          <button
            onClick={handleConfirm}
            className="px-8 py-2  w-[50%] text-lg bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            OK
          </button>
       
        </div>
        <div className="pt-2">
        <button
            onClick={onClose}
            className="px-4 py-2 h-12 border border-gray-300 rounded hover:bg-gray-50 w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ClearModal;
