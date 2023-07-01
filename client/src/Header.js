import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AiOutlinePoweroff, AiOutlinePlusCircle } from 'react-icons/ai';
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header className="flex z-50 justify-between w-[100%] px-20 py-4 bg-white align-middle border-b shadow-lg fixed top-0 right-0">
      <Link to="/" className="text-4xl font-bold text-blue-600">BlogChain</Link>
      <nav className="flex">
        {username && (
          <>
            <Link to="/create" className="flex items-center text-green-600 mx-6"><span className="">< AiOutlinePlusCircle/></span> <span className="mx-2 -mt-1 text-xl font-medium">Create</span> </Link>
            <a onClick={logout} className="flex items-center text-red-600 cursor-pointer"><span className=""><AiOutlinePoweroff /></span> <span className="mx-2 -mt-1 text-xl font-medium">Logout {username}</span> </a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="flex items-center text-red-600 mx-2 -mt-1 text-xl font-medium">Login</Link>
            <Link to="/register" className="flex items-center text-red-600 mx-2 -mt-1 text-xl font-medium">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
