import React from "react";
import Button from "../common/Button";
import {
  AiOutlineSave,
  AiOutlineCloseCircle,
  AiOutlineEdit,
  AiOutlineLock,
} from "react-icons/ai";

const AccountPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white relative rounded-lg shadow-lg w-[960px]">
          <div className="m-6 ">
            <p className="text-lg font-semibold mb-4">Người dùng</p>
            <button
              onClick={onClose}
              className="text-2xl text-gray-500 absolute right-0 top-0 px-4 py-2 hover:text-gray-900 rounded hover:bg-gray-300"
            >
              &times;
            </button>
          </div>
          <div className="container mx-auto p-6">
            <form className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="name"
                    className="w-1/3 font-semibold text-gray-700"
                  >
                    Tên người dùng
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-2/3 border-b border-gray-300  px-3 py-2 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="username"
                    className="w-1/3 font-semibold text-gray-700"
                  >
                    Tên đăng nhập
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="w-2/3 border-b border-gray-300  px-3 py-2 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="role"
                    className="w-1/3 font-semibold text-gray-700"
                  >
                    Vai trò
                  </label>
                  <input
                    id="role"
                    type="text"
                    className="w-2/3 border-b border-gray-300  px-3 py-2 focus:outline-none focus:border-green-500"
                    value="Admin"
                    readOnly
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="phone"
                    className="w-1/3 font-semibold text-gray-700"
                  >
                    Điện thoại
                  </label>
                  <div className="w-2/3 flex items-center space-x-2">
                    <div className="border border-gray-300 rounded-l px-3 py-2">
                      🇻🇳
                    </div>
                    <input
                      id="phone"
                      type="text"
                      className="w-full border-b border-gray-300  px-3 py-2 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="birthday"
                    className="w-1/3 font-semibold text-gray-700"
                  >
                    Ngày sinh
                  </label>
                  <input
                    id="birthday"
                    type="date"
                    className="w-2/3 border-b border-gray-300  px-3 py-2 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="email"
                    className="w-1/3 font-semibold text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-2/3 border-b border-gray-300  px-3 py-2 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="address"
                    className="w-1/3 font-semibold text-gray-700"
                  >
                    Địa chỉ
                  </label>
                  <input
                    id="address"
                    type="text"
                    className="w-2/3 border-b border-gray-300  px-3 py-2 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="region"
                    className="w-1/3 font-semibold text-gray-700"
                  >
                    Khu vực
                  </label>
                  <input
                    id="region"
                    type="text"
                    placeholder="Chọn Tỉnh/TP - Quận/Huyện"
                    className="w-2/3 border-b border-gray-300  px-3 py-2 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="ward"
                    className="w-1/3 font-semibold text-gray-700"
                  >
                    Phường xã
                  </label>
                  <input
                    id="ward"
                    type="text"
                    placeholder="Chọn Phường/Xã"
                    className="w-2/3 border-b border-gray-300  px-3 py-2 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="note"
                    className="w-1/3 font-semibold text-gray-700"
                  >
                    Ghi chú
                  </label>
                  <textarea
                    id="note"
                    className="w-2/3 border-b border-gray-300  px-3 py-2 focus:outline-none focus:border-green-500"
                    rows="1"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4 col-span-2">
                <Button
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
            <div className="relative border-[1px] mt-8 border-dashed border-gray-300 rounded-lg p-4">
              <h3 className="absolute -top-4 left-3 bg-white px-2 font-semibold text-lg">
                Đăng nhập và bảo mật
              </h3>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-4">
                  <AiOutlineLock className="text-xl text-gray-700" />
                  <div>
                    <p className="font-semibold text-gray-900">Đổi mật khẩu</p>
                    <p className="text-sm text-gray-600">
                      Bạn nên sử dụng mật khẩu mạnh mà mình chưa sử dụng ở đâu
                      khác
                    </p>
                  </div>
                </div>
                <div>
                  <button className="flex items-center text-gray-700 hover:text-gray-900 border px-3 py-2 rounded-lg focus:outline-none">
                    <AiOutlineEdit className="mr-1" />
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPopup;
