import { AiOutlineInfoCircle } from "react-icons/ai";

const TooltipIcon = ({ tooltipId, tooltipContent }) => (
  <AiOutlineInfoCircle
    className="text-lg font-bold ml-4 text-gray-700 cursor-pointer"
    data-tooltip-id={tooltipId}
    data-tooltip-content={tooltipContent}
    data-tooltip-place="right"
  />
);

export default TooltipIcon;
