import TooltipIcon from "./TooltipIcon";
import { Tooltip } from "react-tooltip";

const SelectField = ({ id, label, options, tooltipId, tooltipContent }) => (
  <div className="flex items-center">
    <label
      htmlFor={id}
      className="block text-gray-700 text-sm font-medium w-28"
    >
      {label}
    </label>
    <TooltipIcon tooltipId={tooltipId} tooltipContent={tooltipContent} />
    <Tooltip id={tooltipId} variant="info" />
    <select
      id={id}
      className="mt-1 block w-full border-b border-gray-300 hover:border-green-500 outline-none px-3 py-2"
    >
      {options.map((option, index) => (
        <option key={index}>{option}</option>
      ))}
    </select>
  </div>
);

export default SelectField;
