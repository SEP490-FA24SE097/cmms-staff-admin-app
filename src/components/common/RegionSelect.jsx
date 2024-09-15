const RegionSelect = ({ label, options, value, onChange }) => (
  <div className="flex items-center">
    <label className="text-gray-700 text-sm font-medium w-1/3">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="border-b border-gray-300 py-2 w-2/3 focus:outline-none focus:border-green-500"
    >
      <option value="" className="font-semibold text-gray-500">
        Chọn {label}
      </option>
      {options.map((option) => (
        <option key={option.code} value={option.code}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

export default RegionSelect;
