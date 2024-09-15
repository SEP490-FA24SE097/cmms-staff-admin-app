import TooltipIcon from "./TooltipIcon";
import { Tooltip } from "react-tooltip";

const SelectField = ({
  id,
  label,
  options,
  tooltipId,
  tooltipContent,
  onChange,
  value,
}) => (
  <div className="flex items-center">
    <div className="flex items-center w-1/3">
      <label htmlFor={id} className="block text-gray-700 text-sm font-medium ">
        {label}
      </label>
      {tooltipId && tooltipContent && (
        <>
          <TooltipIcon tooltipId={tooltipId} tooltipContent={tooltipContent} />
          <Tooltip id={tooltipId} variant="info" />
        </>
      )}
    </div>
    <select
      id={id}
      onChange={onChange}
      value={value}
      className="mt-1 block w-2/3 border-b border-gray-300 hover:border-green-500 outline-none  py-2"
    >
      {label === "Cửa hàng" ? (
        <option value="" className="font-semibold text-gray-500"></option>
      ) : (
        <option value="" className="font-semibold text-gray-500">
          --Chọn {label.toLowerCase()}--
        </option>
      )}
      {options.map((option, index) => (
        <option key={index}>{option.name}</option>
      ))}
    </select>
  </div>
);

export default SelectField;
