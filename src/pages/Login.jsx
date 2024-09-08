import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white  rounded-lg shadow w-96 ">
        <div className="flex flex-col items-center justify-center mt-6">
          <h2 className="text-2xl font-bold">Logo</h2>
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
        </div>
        <form>
          <div className="flex flex-col gap-2 mx-6 my-4">
            <input
              type="email"
              id="email"
              className="w-full py-2 border-b border-gray-300 outline-none  focus:border-green-500"
              placeholder="Email đăng nhập"
            />
            <input
              type="password"
              id="password"
              className="w-full py-2 border-b border-gray-300 outline-none  focus:border-green-500"
              placeholder="Mật khẩu"
            />
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>
          <div className="flex ">
            <button
              type="submit"
              className="rounded-bl-lg w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium  text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Quản lý
            </button>
            <button
              type="submit"
              className="rounded-br-lg w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium  text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Bán hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
