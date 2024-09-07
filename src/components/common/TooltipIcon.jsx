import { AiOutlineInfoCircle } from "react-icons/ai";

const TooltipIcon = ({ tooltipId, tooltipContent }) => (
  <AiOutlineInfoCircle
    className="text-xl ml-1 text-gray-400 cursor-pointer"
    data-tooltip-id={tooltipId}
    data-tooltip-content={tooltipContent}
    data-tooltip-place="right"
  />
);

export default TooltipIcon;
