import React, { useState, useEffect } from "react";
import "react-phone-input-2/lib/style.css";
import { useForm, Controller } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../utils/axios";
import PhoneInput from "react-phone-input-2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import InputField from "../common/InputField";
import Button from "../common/Button";
import RegionSelect from "../common/RegionSelect";
import useRegionData from "../../hooks/useRegionData";
import SelectField from "../common/SelectField";
import { formatRoleName } from "../../utils/formatRoleName";

const schema = yup.object().shape({
  name: yup.string().required("Tên người dùng là bắt buộc"),

  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),

  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Nhập lại mật khẩu là bắt buộc"),
});

const PasswordInputField = ({ id, label, required, value, onChange }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative">
      <InputField
        id={id}
        label={label}
        type={passwordVisible ? "text" : "password"}
        autoComplete="new-password"
        required={required}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-1 flex items-center text-gray-500 hover:text-gray-700"
        aria-label="Toggle password visibility"
      >
        {passwordVisible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
      </button>
    </div>
  );
};

const AddUserPopup = ({ isOpen, onClose }) => {
  const { provinces, districts, wards, fetchDistricts, fetchWards } =
    useRegionData();
  const [roles, setRoles] = useState([]);
  const [stores, setStores] = useState([]);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fectchRoles = async () => {
      try {
        const response = await axios.get("/roles");
        setRoles(response.data.data);
      } catch {
        console.log("Error fetching roles", errors);
      }
    };
    const fectchStore = async () => {
      try {
        const response = await axios.get("/stores");
        setStores(response.data.data);
        console.log(response.data.data);
      } catch {
        console.log("Error fetching stores", errors);
      }
    };
    fectchRoles();
    fectchStore();
  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.post("/users", data);
      alert("Thêm người dùng thành công");
      onClose();
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white relative rounded-lg shadow-lg w-full max-w-4xl mx-4">
        <div className="m-6">
          <p className="text-lg font-semibold mb-4">Người dùng</p>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 absolute right-0 top-0 px-4 py-2 hover:text-gray-900 rounded hover:bg-gray-300"
            aria-label="Close Popup"
          >
            &times;
          </button>
        </div>
        <div className="container mx-auto p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Left Column */}
            <div className="space-y-4">
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputField {...field} id="name" label="Tên người dùng" />
                )}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputField
                    {...field}
                    id="email"
                    label="Email đăng nhập"
                    autoComplete="Email đăng nhập "
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInputField
                    onChange={field.onChange}
                    value={field.value}
                    id="password"
                    label="Mật khẩu"
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInputField
                    onChange={field.onChange}
                    value={field.value}
                    id="confirmPassword"
                    label="Nhập lại mật khẩu"
                  />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
              <Controller
                name="store"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <SelectField
                    id="store"
                    label="Cửa hàng"
                    value={field.value}
                    onChange={field.onChange}
                    options={stores}
                  />
                )}
              />
              {errors.store && (
                <p className="text-red-500">{errors.store.message}</p>
              )}

              <Controller
                name="role"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <SelectField
                    id="role"
                    label="Vai trò"
                    value={field.value}
                    onChange={field.onChange}
                    options={roles}
                  />
                )}
              />
              {errors.role && (
                <p className="text-red-500">{errors.role.message}</p>
              )}

              <div className="flex items-center">
                <label className="w-1/3 text-gray-700 text-sm font-medium">
                  Điện thoại
                </label>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <PhoneInput
                      country={"vn"} // Quốc kỳ mặc định là Việt Nam
                      value={field.value} // Kết nối value với field của React Hook Form
                      onChange={field.onChange} // Kết nối onChange với field
                      inputClass="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                      inputStyle={{
                        width: "100%",
                        border: "none",
                        borderBottom: "1px solid #d1d5db",
                        borderRadius: "0",
                      }}
                      buttonStyle={{
                        border: "none",
                        borderBottom: "1px solid #d1d5db",
                        borderRadius: "0",
                      }}
                      inputProps={{
                        onFocus: (e) =>
                          (e.target.style.borderBottom = "1px solid #22c55e"), // Màu xanh khi focus
                        onBlur: (e) =>
                          (e.target.style.borderBottom = "1px solid #d1d5db"), // Quay lại màu xám khi mất focus
                      }}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}

            <div className="space-y-4">
              <Controller
                name="birthday"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    id="birthday"
                    label="Ngày sinh"
                    type="date"
                  />
                )}
              />
              {errors.birthday && (
                <p className="text-red-500">{errors.birthday.message}</p>
              )}
              <Controller
                name="province"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RegionSelect
                    label="Tỉnh/TP"
                    value={field.value}
                    options={provinces}
                    onChange={(e) => {
                      field.onChange(e);
                      fetchDistricts(e.target.value);
                    }}
                  />
                )}
              />
              {errors.province && (
                <p className="text-red-500">{errors.province.message}</p>
              )}
              <Controller
                name="district"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RegionSelect
                    label="Quận/Huyện"
                    value={field.value}
                    options={districts}
                    onChange={(e) => {
                      field.onChange(e);
                      fetchWards(e.target.value);
                    }}
                  />
                )}
              />
              {errors.district && (
                <p className="text-red-500">{errors.district.message}</p>
              )}
              <Controller
                name="ward"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RegionSelect
                    label="Phường/Xã"
                    value={field.value}
                    options={wards}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              {errors.ward && (
                <p className="text-red-500">{errors.ward.message}</p>
              )}
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <InputField {...field} id="address" label="Địa chỉ" />
                )}
              />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
              <div className="flex items-center">
                <label
                  htmlFor="note"
                  className="w-1/3 text-gray-700 text-sm font-medium"
                >
                  Ghi chú
                </label>
                <textarea
                  id="note"
                  {...register("note")}
                  className="w-2/3 border-b border-gray-300 px-3 py-2 focus:outline-none focus:border-green-500"
                  rows="1"
                ></textarea>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-16 flex justify-end space-x-4 col-span-2">
              <Button
                type="submit"
                icon={<AiOutlineSave />}
                label="Lưu"
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
        </div>
      </div>
    </div>
  );
};

export default AddUserPopup;
