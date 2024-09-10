const RegionSelect = ({ label, options, value, onChange }) => (
  <div className="flex items-center space-x-2">
    <label className="font-semibold text-gray-700 w-1/3">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="border-b border-gray-300 px-3  py-2 w-2/3 focus:outline-none focus:border-green-500"
    >
      <option value=""></option>
      {options.map((option) => (
        <option key={option.code} value={option.code}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

export default RegionSelect;
