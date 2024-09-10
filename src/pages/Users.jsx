import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import AddUserPopup from "../components/modals/AddUserPopup";
import SearchBar from "../components/SearchBar";

const Sidebar = () => {
  return (
    <aside className="w-1/6 space-y-4 mr-4">
      <h1>
        <span className="font-bold text-xl">Vai trò</span>
      </h1>
      <div>
        <div className="bg-white rounded p-4 border-b pb-4">
          <h3 className="font-bold">Loại hàng</h3>
          <ul className="space-y-2 mt-2">
            <li>
              <input type="checkbox" id="hang-hoa" className="mr-2" />
              <label htmlFor="hang-hoa">Hàng hóa</label>
            </li>
            <li>
              <input type="checkbox" id="combo" className="mr-2" />
              <label htmlFor="combo">Combo - Đóng gói</label>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div className="bg-white rounded p-4 border-b pb-4">
          <h3 className="font-bold">Trạng thái</h3>
          <input
            type="text"
            placeholder="Tìm kiếm nhóm hàng"
            className="w-full mt-2"
          />
          <ul className="space-y-2">
            <li>Tất cả</li>
            <li>Xi măng</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

const Users = () => {
  const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);

  const openAddUserPopup = () => {
    setIsAddUserPopupOpen(true);
  };

  const closeAddUserPopup = () => {
    setIsAddUserPopupOpen(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1  space-y-6">
        <div className="flex justify-between items-center">
          <SearchBar planceholder={"Tìm kiếm người dùng"} />
          <div>
            <button
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
              onClick={openAddUserPopup}
            >
              <AiOutlinePlus />
              <span>Thêm người dùng</span>
            </button>
            {isAddUserPopupOpen && (
              <AddUserPopup
                isOpen={isAddUserPopupOpen}
                onClose={closeAddUserPopup}
              />
            )}
          </div>
        </div>
        {/* User Table */}
        <div className="overflow-x-auto bg-white border rounded">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 border">Email đăng nhập</th>
                <th className="p-2 border">Tên người dùng</th>
                <th className="p-2 border">Điện thoại</th>
                <th className="p-2 border">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">SP001</td>
                <td className="p-2 border">Xi măng PC30 - Màu xám (Bao)</td>
                <td className="p-2 border">Xi măng con</td>
                <td className="p-2 border">Hàng hóa</td>
              </tr>
              {/* More rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
