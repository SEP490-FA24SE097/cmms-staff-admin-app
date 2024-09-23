import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";
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
import axios from "../../utils/axios";

const schema = yup.object().shape({
  maHang: yup.string().required("Ma hang la bat buot"),
});

const AddProductPopup = ({ isOpen, onClose }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      units: [
        {
          unitName: "",
          conversionRate: "",
          salePrice: "",
          productCode: "",
          barcode: "",
          directSale: false,
        },
      ],
      attributes: [{ attributeName: "", attributeValue: "" }],
    },
  });

  const {
    fields: unitFields,
    append: appendUnit,
    remove: removeUnit,
  } = useFieldArray({
    control,
    name: "units",
  });

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: "attributes",
  });

  const [isProperty, setIsProperty] = useState(false);
  const [isUnit, setIsUnit] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [images, setImages] = useState([...Array(5)].map(() => null));
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      setCategories(response.data.data);
    } catch {
      console.log("Error fetching categories", errors);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get("/brands");
      setBrands(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const toggleProperty = () => {
    setIsProperty(!isProperty);
  };

  const toggleUnit = () => {
    setIsUnit(!isUnit);
  };

  const handleTagChange = (tab) => {
    setActiveTab(tab);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/products", data);
    } catch (error) {
      console.error("Error calling API");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 top-0 -mt-20 z-50 flex justify-center items-center">
      <div className="bg-gray-800 bg-opacity-75 fixed inset-0"></div>
      <div className=" bg-white rounded-lg shadow-lg mt-32 relative max-w-4xl">
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
            </ul>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {activeTab === "info" && (
            <>
              <div className="grid md:grid-cols-[6fr_4fr] sm:grid-cols-2 gap-4 p-6 ">
                <div>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        id="code"
                        label="Mã hàng"
                        placeholder="Mã hàng tự động"
                        tooltipId="code"
                        tooltipContent="Mã hàng là thông tin duy nhất"
                      />
                    )}
                  />
                  <Controller
                    name="barCode"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        id="barCode"
                        label="Mã vạch"
                        placeholder=""
                        tooltipId="barCode"
                        tooltipContent="Mã vạch của hàng hóa thường được tạo ra bởi nhà sản xuất"
                      />
                    )}
                  />

                  <Controller
                    name="categories"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        {...field}
                        id="categories"
                        label="Nhóm hàng"
                        options={categories}
                        tooltipId="nhom-hang"
                        tooltipContent="Nhóm hàng là nhóm của sản phẩm"
                      />
                    )}
                  />
                  <Controller
                    name="brands"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        {...field}
                        id="brands"
                        label="Thương hiệu"
                        options={brands}
                        tooltipId="brands"
                        tooltipContent="Thương hiệu là thương hiệu sản phẩm"
                      />
                    )}
                  />
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        id="location"
                        label="Vị trí"
                        tooltipId="vi-tri"
                        tooltipContent="Vị trí là vị trí của sản phẩm"
                      />
                    )}
                  />
                  {/* Images Section */}
                  <div className="flex justify-between mt-6">
                    {images.map((image, i) => (
                      <div
                        key={i}
                        className="relative border-[1px] rounded-sm border-dashed w-24 h-20 border-gray-300 flex items-center justify-center overflow-hidden"
                      >
                        <img
                          src={image || defaultProductImg}
                          alt={`Product placeholder ${i + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0"
                          onChange={(e) => handleFileUpload(e, i)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Controller
                    name="costPrice"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        id="costPrice"
                        type="number"
                        label="Giá vốn"
                        placeholder="0"
                        tooltipId="gia-von"
                        tooltipContent="Giá vốn dùng để tính lợi nhận cho sản phẩm 
                  (sẽ tự động thay đổi khi thay đổi phương pháp tính giá vốn)"
                      />
                    )}
                  />
                  <Controller
                    name="sellingPrice"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        id="sellingPrice"
                        label="Giá bán"
                        type="number"
                        placeholder="0"
                        tooltipId="gia-ban"
                        tooltipContent="Giá bán là giá mà bạn bán cho khách hàng"
                      />
                    )}
                  />
                  <Controller
                    name="stockQuantity"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        id="stockQuantity"
                        label="Tồn kho"
                        type="number"
                        placeholder="0"
                        tooltipId="ton-kho"
                        tooltipContent="Tồn kho là số lượng hàng hóa có trong kho"
                      />
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <div className="w-1/3">
                      <div className="flex items-center">
                        <label
                          htmlFor="trong-luong-input"
                          className="block text-gray-700 text-sm font-medium"
                        >
                          Trọng lượng
                        </label>
                        <TooltipIcon
                          tooltipId="trong-luong"
                          tooltipContent="Trọng lượng là trọng lượng của sản phẩm"
                        />
                        <Tooltip id="trong-luong" variant="info" />
                      </div>
                    </div>
                    <div className="w-2/3">
                      <div className="flex items-center mt-1">
                        <input
                          type="number"
                          className="block w-full border-b border-gray-300 hover:border-green-500 outline-none px-3 py-2"
                          {...register("weight.value")}
                        />
                        <select
                          className="ml-2 border-b border-gray-300 hover:border-green-500 outline-none px-3 py-2"
                          {...register("weight.unit")}
                        >
                          <option>gram</option>
                          <option>kg</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-1/3 ">
                      <div className="flex items-center">
                        <label
                          htmlFor="kich-thuoc-input"
                          className="block text-gray-700 text-sm font-medium "
                        >
                          Kích thước
                        </label>
                        <TooltipIcon
                          tooltipId="kich-thuoc"
                          tooltipContent="Kích thước là kích thước của sản phẩm"
                        />
                        <Tooltip id="kich-thuoc" variant="info" />
                      </div>
                    </div>
                    <div className="w-2/3 ">
                      <div className="flex items-center space-x-2">
                        <input
                          className="block w-full border-b border-gray-300 hover:border-green-500 outline-none px-3 py-2 "
                          placeholder="Rộng"
                          {...register("width")}
                        />
                        <input
                          className="block w-full  border-b border-gray-300 hover:border-green-500 outline-none px-3 py-2 "
                          placeholder="Dài"
                          {...register("length")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id="lo-hang"
                      className="form-checkbox  rounded text-green-500 "
                      {...register("isBatch")}
                    />
                    <div>
                      <div className="flex items-center">
                        <label
                          htmlFor="lo-hang"
                          className="block text-gray-800 text-sm  "
                        >
                          Lô, hạn sử dụng
                        </label>
                        <TooltipIcon
                          tooltipId="lo-hang"
                          tooltipContent="Quản lí sản phẩm theo lô hàng"
                        />
                        <Tooltip id="lo-hang" variant="info" />
                      </div>
                    </div>
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
                      {attributeFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between space-x-4 mb-2"
                        >
                          <select className="px-2 py-1 w-1/3 bg-white border-b border-gray-300 hover:border-green-500 outline-none">
                            <option>Chọn thuộc tính...</option>
                            <option value="attribute1">Attribute 1</option>
                            <option value="attribute2">Attribute 2</option>
                          </select>
                          <input
                            type="text"
                            className={`outline-none border-b border-gray-300 focus:border-green-500 px-2 py-1  w-1/3 ${
                              errors.attributes?.[index]?.attributeValue
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder="Nhập giá trị và enter"
                            {...register(`attributes.${index}.attributeName`)}
                          />
                          {errors.attributes?.[index]?.value && (
                            <span className="text-red-500 text-sm">
                              {errors.attributes[index].value.message}
                            </span>
                          )}
                          <AiOutlineDelete
                            className="w-5 h-5 cursor-pointer text-red-500"
                            onClick={() => removeAttribute(index)}
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => appendAttribute({ value: "" })}
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
                        {unitFields.map((unit, index) => (
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
                                  onClick={() => removeUnit(index)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        className="flex items-center px-4 py-2 ml-4  rounded-lg bg-gray-100"
                        onClick={() =>
                          appendUnit({
                            unitName: "",
                            conversionRate: "",
                            salePrice: "",
                            productCode: "",
                            barcode: "",
                            directSale: false,
                          })
                        }
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
              <div>
                <h3 className="text-lg font-semibold">Mô tả chi tiết</h3>
                <InputField
                  id="mo-ta-chi-tiet-input"
                  label="Mô tả chi tiết"
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>
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
        </form>
        <DevTool control={control} />
      </div>
    </div>
  );
};

export default AddProductPopup;
