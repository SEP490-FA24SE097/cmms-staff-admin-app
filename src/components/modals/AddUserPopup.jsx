import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import RegionSelect from "../common/RegionSelect";
import useRegionData from "../../hooks/useRegionData";

const PasswordInputField = ({ id, label, required }) => {
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
        required={required}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
      >
        {passwordVisible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
      </button>
    </div>
  );
};

const AddUserPopup = ({ isOpen, onClose }) => {
  const { provinces, districts, wards, fetchDistricts, fetchWards } =
    useRegionData();

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    console.log("provinceCode", provinceCode);
    setSelectedProvince(provinceCode);
    fetchDistricts(provinceCode);
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    fetchWards(districtCode);
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white relative rounded-lg shadow-lg w-full max-w-4xl mx-4 mb-36">
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
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <InputField id="name" label="Tên người dùng" required />
              <InputField
                id="email"
                label="Email đăng nhập"
                type="email"
                required
              />
              <PasswordInputField id="password" label="Mật khẩu" required />
              <PasswordInputField
                id="confirm-password"
                label="Nhập lại mật khẩu"
                required
              />
              <InputField id="store" label="Cửa hàng" />
              <InputField id="role" label="Vai trò" value="Admin" readOnly />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <InputField id="birthday" label="Ngày sinh" type="date" />
              <RegionSelect
                label="Tỉnh/TP"
                options={provinces}
                value={selectedProvince}
                onChange={handleProvinceChange}
              />
              <RegionSelect
                label="Quận/Huyện"
                options={districts}
                value={selectedDistrict}
                onChange={handleDistrictChange}
              />
              <RegionSelect
                label="Phường/Xã"
                options={wards}
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
              />
              <InputField id="address" label="Địa chỉ" />
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="note"
                  className="w-1/3 font-semibold text-gray-700"
                >
                  Ghi chú
                </label>
                <textarea
                  id="note"
                  name="note"
                  className="w-2/3 border-b border-gray-300 px-3 py-2 focus:outline-none focus:border-green-500"
                  rows="1"
                ></textarea>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex justify-end space-x-4 col-span-2">
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
