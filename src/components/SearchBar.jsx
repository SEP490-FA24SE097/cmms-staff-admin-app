import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDown } from "react-icons/io";

const SearchBar = ({ planceholder, onChange }) => {
  return (
    <div className="flex-1">
      <div className="flex items-center border  border-gray-300 rounded-md shadow-md max-w-lg bg-white">
        <div className="px-2 py-2">
          <AiOutlineSearch />
        </div>
        <input
          type="text"
          placeholder={planceholder}
          onChange={onChange}
          className="outline-none text-gray-700 w-full"
        />
        <IoMdArrowDown className="text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;
