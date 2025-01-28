import React from "react";
import { useState } from "react";
import { Input, Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function DatePicker({ date, onDateChange }) {
  const handleSelect = (selectedDate) => {
    onDateChange(selectedDate); // Call the handler passed from parent
  };

  return (
    <div className="p-0">
      <Popover placement="bottom">
        <PopoverHandler>
          <Input
            label="Select a Date"
            onChange={() => null}
            value={date ? format(date, "PPP") : ""}
          />
        </PopoverHandler>
        <PopoverContent>
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(selectedDate) => handleSelect(selectedDate)}
            showOutsideDays
            classNames={{
              caption: "flex justify-center py-1 mb-4 relative items-center",
              day: "h-9 w-9 p-0 font-normal",
              day_selected: "rounded-md bg-gray-900 text-white",
            }}
            components={{
              IconLeft: ({ ...props }) => (
                <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
              ),
              IconRight: ({ ...props }) => (
                <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
              ),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
