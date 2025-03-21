import { FC } from "react";
import { Link } from "react-router-dom";
import { Languages } from "./Languages";
import { toAbsoluteUrlForLocalImage } from "../../../presentation/helpers";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { CurrencyDisplay } from "./CurrencyDisplay";

const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuthStore();

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
      data-kt-menu="true"
    >
      <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <div className="symbol symbol-50px me-5">
            <img
              alt="Logo"
              src={toAbsoluteUrlForLocalImage("media/avatars/300-3.jpg")}
            />
          </div>

          <div className="d-flex flex-column">
            <div className="fw-bolder d-flex align-items-center fs-5">
              {currentUser?.user.userName} {currentUser?.user.companyName}
            </div>
            <a href="#" className="fw-bold text-muted text-hover-primary fs-7">
              {currentUser?.user.email}
            </a>
          </div>
        </div>
      </div>

      <div className="separator my-2"></div>

      {/* <Languages /> */}
      <div className="menu-item px-5">
        <a onClick={() => logout()} className="menu-link px-5">
          Sign Out
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
