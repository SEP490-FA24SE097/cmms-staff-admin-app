import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { Select } from "antd";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from "@hookform/devtools";
import {
  AiOutlineDown,
  AiOutlineSave,
  AiOutlineCopy,
  AiOutlineCloseCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import { FaRegTrashCan } from "react-icons/fa6";
import defaultProductImg from "../../assets/default-product-img.jpg";
import { FaPlus } from "react-icons/fa6";
import Button from "../common/Button";
import SelectField from "../common/SelectField";
import TooltipIcon from "../common/TooltipIcon";
import InputField from "../common/InputField";
import axios from "../../utils/axios";

const schema = yup.object().shape({
  maHang: yup.string().required("Ma hang la bat buot"),
  attributes: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Attribute name is required"),
      values: yup.array().of(
        yup
          .string()
          .required("Value is required")
          .test("is-unique", "Value must be unique", function (value, context) {
            const { path, parent } = context;
            const allValues = parent || [];
            const uniqueValues = new Set(allValues);
            return uniqueValues.size === allValues.length;
          })
      ),
    })
  ),
});

const AddProductPopup = ({ isOpen, onClose }) => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
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

  // upload file
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imagesFile, setImagesFile] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleBeforeUpload = (file) => {
    setImagesFile((prevFiles) => [...imagesFile, file]);
    setFileList((prevList) => [...fileList, file]);
    return false;
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: `url(${defaultProductImg}) no-repeat center center`,
        backgroundSize: "cover",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const [isFocused, setIsFocused] = useState(false);
  const [items, setItems] = useState(["jack", "lucy"]);
  const [isProperty, setIsProperty] = useState(false);
  const [isUnit, setIsUnit] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [images, setImages] = useState([...Array(5)].map(() => null));
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variantCombinations, setVariantCombinations] = useState([]);
  const basicUnit = watch("basicUnit");
  const units = watch("units") ?? [];
  const hasAttributeValues = () => {
    const attributes = getValues("attributes") ?? [];
    return attributes.some((attr) => attr.values && attr.values.length > 0);
  };

  const generateCombinations = (attributes, basicUnit, units) => {
    const combinations = [];

    const generate = (current, index) => {
      if (index === attributes.length) {
        combinations.push({
          ...current,
          unitName: basicUnit,
          conversionValue: 1,
          salePrice: 0,
        });

        units.forEach((unit) => {
          combinations.push({
            ...current,
            unitName: unit.name,
            conversionValue: unit.conversionValue,
            salePrice: unit.salePrice,
          });
        });

        return;
      }

      const attribute = attributes[index];
      const values = Array.isArray(attribute.values) ? attribute.values : [];

      if (values.length === 0) {
        generate(current, index + 1);
        return;
      }

      values.forEach((value) => {
        generate(
          {
            ...current,
            [attribute.name]: value,
          },
          index + 1
        );
      });
    };

    generate({}, 0);
    return combinations;
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (
        name &&
        (name.startsWith("attributes") ||
          name === "basicUnit" ||
          name === "units")
      ) {
        const attributes = getValues("attributes");
        const basicUnit = getValues("basicUnit");
        const units = getValues("units");
        const combinations = generateCombinations(attributes, basicUnit, units);
        console.log("combinations", combinations);
        setVariantCombinations(combinations);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, getValues]);

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

  const handleAddUnit = () => {
    if (!basicUnit.trim()) {
      toast.error("Chưa nhập đơn vị cơ bản");
    } else {
      appendUnit({
        unitName: "",
        conversionRate: "",
        salePrice: "",
        materialCode: "",
        barcode: "",
      });
    }
  };

  const handleSelectAddNewAttr = (value) => {
    if (value === "add-new-attr") {
      document.getElementById("my_modal_3").showModal();
    }
  };

  const handleDeleteVariant = (index) => {
    setVariantCombinations((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleProperty = () => {
    setIsProperty(!isProperty);
  };

  const toggleUnit = () => {
    setIsUnit(!isUnit);
  };

  const handleTagChange = (tab) => {
    setActiveTab(tab);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newImages = [...images];
      newImages[index] = imageUrl;
      setImages(newImages);
      setValue(`images.${index}`, file);
    }
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
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    multiple
                    beforeUpload={handleBeforeUpload}
                    style={{
                      backgroundColor: "#fafafa", // Màu nền
                      border: "2px dashed #d9d9d9", // Đường viền
                      padding: "20px", // Padding cho component
                      textAlign: "center", // Căn giữa nội dung
                      borderRadius: "5px", // Bo góc
                      cursor: "pointer", // Con trỏ khi hover
                    }}
                  >
                    {fileList.length >= 5 ? null : uploadButton}
                  </Upload>
                  {previewImage && (
                    <Image
                      wrapperStyle={{
                        display: "none",
                      }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                          !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
                    />
                  )}
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
                          onChange={(e) => {
                            handleImageChange(e, i);
                          }}
                          {...register(`images.${i}`)}
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
                      {attributeFields.map((field, attrIndex) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between space-x-4 mb-2"
                        >
                          <Controller
                            name={`attributes.${attrIndex}.name`}
                            control={control}
                            render={({ field }) => {
                              const selectedValues = getValues("attributes")
                                .filter((_, index) => index !== attrIndex)
                                .map((attr) => attr.name);

                              const availableOptions = items
                                .filter(
                                  (item) => !selectedValues.includes(item)
                                )
                                .map((item) => ({
                                  label: item,
                                  value: item,
                                }));
                              return (
                                <Select
                                  {...field}
                                  value={field.value || undefined}
                                  className="w-1/3 border-b"
                                  style={{
                                    borderColor: isFocused
                                      ? "#48bb78"
                                      : "#d1d5db", // green-500 or gray-300
                                    outline: "none",
                                  }}
                                  placeholder="Chọn thuộc tính..."
                                  variant="borderless"
                                  onFocus={() => setIsFocused(true)}
                                  onBlur={() => setIsFocused(false)}
                                  options={[
                                    ...availableOptions,
                                    {
                                      label: "+ Tạo thuộc tính mới",
                                      value: "add-new-attr",
                                    },
                                  ]}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    handleSelectAddNewAttr(value);
                                  }}
                                />
                              );
                            }}
                          />

                          <dialog id="my_modal_3" className="modal">
                            <div className="modal-box  rounded-md">
                              <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <h3 className="font-bold text-lg">
                                Thêm thuộc tính
                              </h3>
                              <div className="py-4 font-semibold flex items-center space-x-2">
                                <label className="whitespace-nowrap">
                                  Tên thuộc tính
                                </label>
                                <input
                                  type="text"
                                  className="outline-none border-b border-gray-300 hover:border-green-500 flex-grow"
                                />
                              </div>
                            </div>
                          </dialog>
                          <ValuesInputField
                            register={register}
                            getValues={getValues}
                            setValue={setValue}
                            attrIndex={attrIndex}
                            errors={errors}
                          />
                          <FaRegTrashCan
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => removeAttribute(attrIndex)}
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          appendAttribute({ name: "", values: [] })
                        }
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
                          {...register("basicUnit")}
                        />
                      </div>
                      <div>
                        {unitFields.map((unit, index) => {
                          return (
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
                                      {...register(`units.${index}.name`)}
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
                                      {...register(
                                        `units.${index}.conversionValue`
                                      )}
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
                                      {...register(`units.${index}.salePrice`)}
                                      id="gia-ban"
                                      type="number"
                                      className="w-16 outline-none border-b border-gray-300 focus:border-green-500 px-2 py-1 text-sm"
                                    />
                                  </div>
                                  {!hasAttributeValues() && (
                                    <>
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
                                          {...register(
                                            `units.${index}.materialCode`
                                          )}
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
                                          {...register(
                                            `units.${index}.barCode`
                                          )}
                                        />
                                      </div>
                                    </>
                                  )}
                                  <FaRegTrashCan
                                    className="w-5 h-5 cursor-pointer"
                                    onClick={() => removeUnit(index)}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        className="flex items-center px-4 py-2 ml-4  rounded-lg bg-gray-100"
                        onClick={handleAddUnit}
                      >
                        <FaPlus className="w-4 h-4 mr-2" />
                        Thêm đơn vị
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {hasAttributeValues() && (
                <div className="p-6  ">
                  <div className="border rounded-lg">
                    <div className=" ">
                      <h3 className="bg-gray-100 px-4 py-2 flex text-lg font-semibold ">
                        Danh sách hàng hóa cùng loại
                      </h3>

                      <table className="min-w-full table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left">Tên</th>
                            {units.length > 0 && (
                              <th className="py-2">Đơn vị</th>
                            )}
                            <th className="px-4 py-2 text-left">Mã hàng</th>
                            <th className="px-4 py-2 text-left">Mã vạch</th>
                            <th className="px-4 py-2 text-left">Giá vốn</th>
                            <th className="px-4 py-2 text-left">Giá bán</th>
                            <th className="px-4 py-2 text-left">Tồn kho</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variantCombinations.map((combination, index) => (
                            <tr key={index}>
                              <td className="py-2">
                                {generateVariantName(combination)}
                              </td>
                              {units.length > 0 && (
                                <td className="py-2">{units[0].unitName}</td>
                              )}
                              <td className="py-2">
                                <input className="border-b border-gray-300 focus:border-green-500 outline-none w-full" />
                              </td>
                              <td className="py-2">
                                <input className="border-b border-gray-300 focus:border-green-500 outline-none w-full" />
                              </td>
                              <td className="py-2">
                                <input
                                  type="number"
                                  className="border-b border-gray-300 focus:border-green-500 outline-none w-full"
                                />
                              </td>
                              <td className="py-2">
                                <input
                                  type="number"
                                  className="border-b border-gray-300 focus:border-green-500 outline-none w-full"
                                />
                              </td>
                              <td className="py-2">
                                <input
                                  type="number"
                                  className="border-b border-gray-300 focus:border-green-500 outline-none"
                                />
                              </td>
                              <td className="py-2">
                                <button
                                  type="button"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteVariant(index)}
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="text-right text-sm text-gray-600 mt-2">
                        Danh sách bao gồm 1 hàng hóa cùng loại
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "description" && (
            <div>
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

const ValuesInputField = ({
  register,
  attrIndex,
  getValues,
  setValue,
  errors,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);
  const [errorMessage, setErrormessage] = useState("");

  const attributeName = getValues(`attributes.${attrIndex}.name`);
  const handleKeyDown = (e) => {
    if (!attributeName) {
      setErrormessage("Bạn cần chọn tên thuộc tính trước khi thêm giá trị.");
      return;
    }
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const currentValues = getValues(`attributes.${attrIndex}.values`) || [];
      const newValue = inputValue.trim();

      // Kiểm tra trùng lặp trước khi thêm
      if (currentValues.includes(newValue)) {
        setErrormessage("This value is exists");
      } else {
        const newValues = [...currentValues, newValue];
        setTags(newValues);
        setValue(`attributes.${attrIndex}.values`, newValues);
        setErrormessage("");
      }
      setInputValue(""); // Reset input sau khi thêm giá trị
    }
  };

  // Hàm xóa tag (value)
  const removeTag = (index) => {
    const currentValues = getValues(`attributes.${attrIndex}.values`);
    const newValues = currentValues.filter((_, i) => i !== index);
    setTags(newValues);
    setValue(`attributes.${attrIndex}.values`, newValues); // Cập nhật lại giá trị vào React Hook Form sau khi xóa
  };

  useEffect(() => {
    if (attributeName && errorMessage) setErrormessage("");
  }, [attributeName, errorMessage]);

  return (
    <div>
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            &times;
          </button>
        </span>
      ))}

      <input
        type="text"
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter value and press Enter"
        className="border-b border-gray-300 focus:border-green-500 outline-none w-full"
      />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Input ẩn để lưu giá trị của tags trong React Hook Form */}
      <input type="hidden" {...register(`attributes.${attrIndex}.values`)} />
    </div>
  );
};

const generateVariantName = (variant) => {
  // Lọc các thuộc tính không phải là đơn vị, giá, giá trị quy đổi
  const attributeNames = Object.keys(variant).filter(
    (key) =>
      key !== "unitName" && key !== "conversionValue" && key !== "salePrice"
  );

  // Tạo chuỗi chỉ bao gồm các giá trị của thuộc tính
  const attributeValues = attributeNames.map((name) => variant[name]).join("-");

  return attributeValues;
};

// Hàm chuyển file sang Base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
