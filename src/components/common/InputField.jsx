import React, { forwardRef } from "react";
import TooltipIcon from "./TooltipIcon";
import { Tooltip } from "react-tooltip";

const InputField = forwardRef(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      tooltipId,
      tooltipContent,
      value,
      readonly,
      autoComplete,
      onChange,
      onBlur,
    },
    ref
  ) => (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center">
        <div className="flex items-center space-x-2 w-1/3">
          <div className="flex items-center">
            <label
              htmlFor={id}
              className="block text-gray-700 text-sm font-medium"
            >
              {label}
            </label>
            {tooltipId && tooltipContent && (
              <>
                <TooltipIcon
                  tooltipId={tooltipId}
                  tooltipContent={tooltipContent}
                />
                <Tooltip id={tooltipId} variant="info" className="max-w-64" />
              </>
            )}
          </div>
        </div>
        <input
          type={type}
          id={id}
          ref={ref}
          className="border-b w-2/3 border-gray-300 hover:border-green-500 outline-none py-2"
          placeholder={placeholder}
          value={value || ""}
          readOnly={readonly}
          autoComplete={autoComplete}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
    </div>
  )
);

export default InputField;
