import React from 'react';

interface DrawerTimeInputsProps {
  drawer: string;
  startTime: string;
  endTime: string;
  onDrawerChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export default function DrawerTimeInputs({
  drawer,
  startTime,
  endTime,
  onDrawerChange,
  onStartTimeChange,
  onEndTimeChange
}: DrawerTimeInputsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
        <label className="text-white">Drawer</label>
        <select 
          value={drawer}
          onChange={(e) => onDrawerChange(e.target.value)}
          className="px-3 py-1 rounded"
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
        <label className="text-white">Start Time</label>
        <select 
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          className="px-3 py-1 rounded"
        >
          <option value="04:31 PM">04:31 PM</option>
          {/* Add more time options as needed */}
        </select>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
        <label className="text-white">End Time</label>
        <select 
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          className="px-3 py-1 rounded"
        >
          <option value="04:31 PM">04:31 PM</option>
          {/* Add more time options as needed */}
        </select>
      </div>
    </div>
  );
}