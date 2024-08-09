import { useState, useEffect, useRef } from "react";
import React from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout, reset, login, getUserInfo } from "../features/auth/authSlice";

function Navbar() {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef();

  const { user, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        dispatch(login(storedUser));
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getUserInfo());
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
    setNav(false); // Close side menu after logout
  };

  const handleNav = () => {
    setNav(!nav);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setNav(false);
      }
    };

    if (nav) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [nav]);

  const renderLinks = () => (
    <>
      <LinkContainer to={`/`}>
        <li className="p-4" onClick={() => setNav(false)}>
          Home
        </li>
      </LinkContainer>
      <LinkContainer to={`/about`}>
        <li className="p-4" onClick={() => setNav(false)}>
          About
        </li>
      </LinkContainer>
      {!userInfo?.worker && (
        <LinkContainer to={`/providersignup`}>
          <li className="p-4 font-bold text-[#00df9a]" onClick={() => setNav(false)}>
            Be A Provider
          </li>
        </LinkContainer>
      )}
      <LinkContainer to={`/profile`}>
        <li className="p-4 font-bold text-[#00df9a]" onClick={() => setNav(false)}>
          Profile
        </li>
      </LinkContainer>
    </>
  );

  return (
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <LinkContainer to={`/`}>
        <h1 className="w-full text-3xl font-bold text-[#00df9a]">linkJob.</h1>
      </LinkContainer>
      <ul className="hidden md:flex">
        {user ? (
          <>
            {renderLinks()}
            <li className="p-4">
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <LinkContainer to={`/login`}>
              <li className="p-4 font-bold text-[#00df9a]">Login</li>
            </LinkContainer>
            <LinkContainer to={`/signup`}>
              <li className="p-4 font-bold text-[#00df9a]">Sign Up</li>
            </LinkContainer>
          </>
        )}
      </ul>
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
        ref={menuRef}
        className={`${
          nav ? "left-0" : "-left-full"
        } fixed top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 md:hidden`}
      >
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">linkJob.</h1>
        {user ? (
          <>
            {renderLinks()}
            <li className="p-4 border-b border-gray-600">
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <LinkContainer to={`/login`}>
              <li className="p-4 border-b border-gray-600 font-bold text-[#00df9a]" onClick={() => setNav(false)}>
                Login
              </li>
            </LinkContainer>
            <LinkContainer to={`/signup`}>
              <li className="p-4 border-b border-gray-600 font-bold text-[#00df9a]" onClick={() => setNav(false)}>
                Sign Up
              </li>
            </LinkContainer>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
