import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import {
  AiOutlineDown,
  AiOutlineDelete,
  AiOutlineSave,
  AiOutlineCopy,
  AiOutlineCloseCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import defaultProductImg from "../../assets/default-product-img.jpg";
import { FaPlus } from "react-icons/fa6";
import Button from "../common/Button";
import SelectField from "../common/SelectField";
import TooltipIcon from "../common/TooltipIcon";
import InputField from "../common/InputField";

const AddProductPopup = ({ isOpen, onClose }) => {
  const [isProperty, setIsProperty] = useState(false);
  const [isUnit, setIsUnit] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [units, setUnits] = useState([]);
  const [activeTab, setActiveTab] = useState("info");

  const toggleProperty = () => {
    setIsProperty(!isProperty);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { id: Date.now(), value: "" }]);
  };

  const toggleUnit = () => {
    setIsUnit(!isUnit);
  };

  const addUnit = () => {
    setUnits([...units, { id: Date.now(), value: "" }]);
  };

  const handleUnitChange = (id, event) => {
    setUnits(
      units.map((unit) => {
        return unit.id === id ? { ...unit, value: event.target.value } : unit; // Thêm return ở đây
      })
    );
  };

  const removeUnit = (id) => {
    setUnits(units.filter((unit) => unit.id !== id));
  };

  const handleAttributeChange = (id, event) => {
    setAttributes(
      attributes.map((attr) =>
        attr.id === id ? { ...attr, value: event.target.value } : attr
      )
    );
  };

  const removeAttribute = (id) => {
    setAttributes(attributes.filter((attr) => attr.id !== id));
  };

  const handleTagChange = (tab) => {
    setActiveTab(tab);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute -top-56 right-1/2  flex items-center justify-center z-50 min-w-[960px]">
      <div className="bg-gray-800 bg-opacity-75 fixed inset-0"></div>
      <div className=" bg-white rounded-lg shadow-lg mt-32 relative ">
        <div className="bg-gray-200 rounded-t-lg ">
          <div className="flex">
            <h2 className="text-lg font-semibold m-6">Thêm hàng</h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-500 absolute right-0 top-0 px-4 py-2 hover:text-gray-900 rounded hover:bg-gray-300"
            >
              &times;
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b-2 border-gray-300 mb-4">
            <ul className="flex space-x-2 text-gray-600">
              <li
                className={`px-6 border-b-2 cursor-pointer hover:text-gray-800 ${
                  activeTab === "info" ? "border-green-500 pb-2" : ""
                } `}
                onClick={() => handleTagChange("info")}
              >
                Thông tin
              </li>
              <li
                className={`px-6 border-b-2 cursor-pointer hover:text-gray-800 ${
                  activeTab === "description" ? "border-green-500 pb-2" : ""
                } `}
                onClick={() => handleTagChange("description")}
              >
                Mô tả chi tiết
              </li>
              <li className="px-6 hover:text-gray-800 cursor-pointer">
                Thành phần
              </li>
            </ul>
          </div>
        </div>

        {/* Form Section */}
        {activeTab === "info" && (
          <>
            <div className="grid grid-cols-2 gap-4 p-6 ">
              <div>
                <InputField
                  id="ma-hang-input"
                  label="Mã hàng"
                  placeholder="Mã hàng tự động"
                  tooltipId="ma-hang"
                  tooltipContent="Mã hàng là thông tin duy nhất"
                />
                <InputField
                  id="ma-vach-input"
                  label="Mã vạch"
                  placeholder=""
                  tooltipId="ma-vach"
                  tooltipContent="Mã vạch của hàng hóa thường được tạo ra bởi nhà sản xuất"
                />
                <InputField
                  id="ten-hang-input"
                  label="Tên hàng"
                  placeholder=""
                  tooltipId="ten-hang"
                  tooltipContent="Tên hàng là tên của sản phẩm"
                />

                <SelectField
                  id="nhom-hang-input"
                  label="Nhóm hàng"
                  options={["---Lựa chọn---"]}
                  tooltipId="nhom-hang"
                  tooltipContent="Nhóm hàng là nhóm của sản phẩm"
                />
                <SelectField
                  id="thuong-hieu-input"
                  label="Thương hiệu"
                  options={["---Chọn thương hiệu---"]}
                  tooltipId="thuong-hieu"
                  tooltipContent="Thương hiệu là thương hiệu của sản phẩm"
                />
                <InputField
                  id="vi-tri-input"
                  label="Vị trí"
                  placeholder=""
                  tooltipId="vi-tri"
                  tooltipContent="Vị trí là vị trí của sản phẩm"
                />
                {/* Images Section */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="border-[1px] border-dashed w-20 h-20 border-gray-300 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={defaultProductImg}
                        alt={`Product placeholder ${i + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <InputField
                  id="gia-von-input"
                  label="Giá vốn"
                  type="number"
                  placeholder="0"
                  tooltipId="gia-von"
                  tooltipContent="Giá vốn dùng để tính lợi nhận cho sản phẩm (sẽ tự động thay đổi khi thay đổi phương pháp tính giá vốn)"
                />
                <InputField
                  id="gia-ban-input"
                  label="Giá bán"
                  type="number"
                  placeholder="0"
                  tooltipId="gia-ban"
                  tooltipContent="Giá bán là giá mà bạn bán cho khách hàng"
                />
                <InputField
                  id="ton-kho-input"
                  label="Tồn kho"
                  type="number"
                  placeholder="0"
                  tooltipId="ton-kho"
                  tooltipContent="Tồn kho là số lượng hàng hóa có trong kho"
                />
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="trong-luong-input"
                    className="block text-gray-700 text-sm font-medium w-20"
                  >
                    Trọng lượng
                  </label>
                  <TooltipIcon
                    tooltipId="trong-luong"
                    tooltipContent="Trọng lượng là trọng lượng của sản phẩm"
                  />
                  <Tooltip id="trong-luong" variant="info" />
                  <div className="flex items-center mt-1">
                    <input
                      type="number"
                      className="block w-full border-b border-gray-300 hover:border-green-500 outline-none px-3 py-2"
                    />
                    <select className="ml-2 border-b border-gray-300 hover:border-green-500 outline-none px-3 py-2">
                      <option>gram</option>
                      <option>kg</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center">
                  <label
                    htmlFor="kich-thuoc-input"
                    className="block text-gray-700 text-sm font-medium w-20"
                  >
                    Kích thước
                  </label>
                  <TooltipIcon
                    tooltipId="kich-thuoc"
                    tooltipContent="Kích thước là kích thước của sản phẩm"
                  />
                  <Tooltip id="kich-thuoc" variant="info" />
                  <div className="flex space-x-2 mt-1">
                    <input
                      type="text"
                      className="block w-full border-b border-gray-300 hover:border-green-500 outline-none px-3 py-2"
                      placeholder="Rộng"
                    />
                    <input
                      type="text"
                      className="block w-full border-b border-gray-300 hover:border-green-500 outline-none px-3 py-2"
                      placeholder="Dài"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-gray-700">Bán trực tiếp</span>
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-gray-700">Tích điểm</span>
                </div>
              </div>
            </div>

            {/* Property & Unit Buttons */}
            <div className="p-6 ">
              <div className="border rounded-lg">
                <div
                  className="bg-gray-100 px-4 py-2 flex justify-between items-center cursor-pointer"
                  onClick={toggleProperty}
                >
                  <span>Thuộc tính</span>
                  {isProperty ? (
                    <AiOutlineDown className="w-4 h-4" />
                  ) : (
                    <AiOutlineDown className="w-4 h-4 rotate-180" />
                  )}
                </div>
                {isProperty && (
                  <div className="p-4">
                    {attributes.map((attribute) => (
                      <div
                        key={attribute.id}
                        className="flex items-center justify-between space-x-4 mb-2"
                      >
                        <select className="px-2 py-1 w-1/3 bg-white border-b border-gray-300 hover:border-green-500 outline-none">
                          <option>Chọn thuộc tính...</option>
                          {/* Add your options here */}
                          <option value="attribute1">Attribute 1</option>
                          <option value="attribute2">Attribute 2</option>
                        </select>
                        <input
                          type="text"
                          className="outline-none border-b border-gray-300 focus:border-green-500 px-2 py-1  w-1/3"
                          placeholder="Nhập giá trị và enter"
                          value={attribute.value}
                          onChange={(e) =>
                            handleAttributeChange(attribute.id, e)
                          }
                        />
                        <AiOutlineDelete
                          className="w-5 h-5 cursor-pointer text-red-500"
                          onClick={() => removeAttribute(attribute.id)}
                        />
                      </div>
                    ))}
                    <button
                      onClick={addAttribute}
                      className="px-4 py-2 border rounded-lg flex items-center"
                    >
                      <FaPlus className="w-4 h-4 mr-2" />
                      Thêm thuộc tính
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="border rounded-lg">
                <div>
                  <div
                    className="flex items-center justify-between bg-gray-100 px-4 py-2"
                    onClick={toggleUnit}
                  >
                    <span>Đơn vị tính</span>
                    {isUnit ? (
                      <AiOutlineDown className="w-4 h-4" />
                    ) : (
                      <AiOutlineDown className="w-4 h-4 rotate-180" />
                    )}
                  </div>
                </div>

                {isUnit && (
                  <div className=" pb-4">
                    <div className="p-4 ">
                      <div className="flex items-center ">
                        <h4 className="text-gray-700 text-sm font-medium ">
                          Đơn vị cơ bản
                        </h4>
                        <TooltipIcon
                          tooltipId="don-vi-co-ban"
                          tooltipContent="Đơn vị của hàng hóa như: hộp lốc thùng..."
                          className="text-xl ml-1 text-gray-400 cursor-pointer"
                        />
                        <Tooltip id="don-vi-co-ban" variant="info" />
                      </div>
                      <input
                        type="text"
                        className="outline-none border-b border-gray-300 focus:border-green-500 px-2 py-1 "
                      />
                    </div>
                    <div>
                      {units.map((unit) => (
                        <div key={unit.id}>
                          <div className="flex items-center space-x-10 justify-between p-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex flex-col">
                                <label
                                  htmlFor="ten-don-vi"
                                  className="text-sm font-medium"
                                >
                                  Tên đơn vị
                                </label>
                                <input
                                  id="ten-don-vi"
                                  type="text"
                                  className="w-24 outline-none border-b border-gray-300 focus:border-green-500 px-2 py-1 text-sm"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label
                                  htmlFor="gia-tri-quy-doi"
                                  className="text-sm font-medium"
                                >
                                  Giá trị quy đổi
                                </label>
                                <input
                                  id="gia-tri-quy-doi"
                                  type="number"
                                  className="w-24 outline-none border-b border-gray-300 focus:border-green-500 px-2 py-1 text-sm"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label
                                  htmlFor="gia-ban"
                                  className="text-sm font-medium"
                                >
                                  Giá bán
                                </label>
                                <input
                                  id="gia-ban"
                                  type="number"
                                  className="w-16 outline-none border-b border-gray-300 focus:border-green-500 px-2 py-1 text-sm"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label
                                  htmlFor="ma-hang"
                                  className="text-sm font-medium"
                                >
                                  Mã hàng
                                </label>
                                <input
                                  id="ma-hang"
                                  type="text"
                                  placeholder="Mã hàng tự động"
                                  className="w-32 outline-none border-b border-gray-300 focus:border-green-500 px-2 py-1 text-sm text-gray-400"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label
                                  htmlFor="ma-vach"
                                  className="text-sm font-medium"
                                >
                                  Mã vạch
                                </label>
                                <input
                                  id="ma-vach"
                                  type="text"
                                  className="w-32 outline-none border-b border-gray-300 focus:border-green-500 px-2 py-1 text-sm"
                                />
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="ban-truc-tiep"
                                  className="w-4 h-4 text-green-500 focus:ring-0"
                                />
                                <label
                                  htmlFor="ban-truc-tiep"
                                  className="ml-2 text-sm"
                                >
                                  Bán trực tiếp
                                </label>
                              </div>
                              <AiOutlineDelete
                                className="w-5 h-5 cursor-pointer text-red-500"
                                onClick={() => removeUnit(unit.id)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="flex items-center px-4 py-2 ml-4  rounded-lg bg-gray-100"
                      onClick={addUnit}
                    >
                      <FaPlus className="w-4 h-4 mr-2" />
                      Thêm đơn vị
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "description" && (
          <div className="p-6 min-w-[960px]">
            <h3 className="text-lg font-semibold">Mô tả chi tiết</h3>
            <InputField
              id="mo-ta-chi-tiet-input"
              label="Mô tả chi tiết"
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4 p-6">
          <Button icon={<AiOutlineSave />} label="Lưu" variant="primary" />
          <Button
            icon={<AiOutlinePlus />}
            label="Lưu & Thêm mới"
            variant="primary"
          />
          <Button
            icon={<AiOutlineCopy />}
            label="Lưu & Sao chép"
            variant="primary"
          />
          <Button
            icon={<AiOutlineCloseCircle />}
            label="Bỏ qua"
            variant="secondary"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProductPopup;
