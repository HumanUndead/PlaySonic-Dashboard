import { Link } from "react-router-dom";
import clsx from "clsx";
import { toAbsoluteUrlForLocalImage } from "../../../helpers";
import { useLayout } from "../../core";
import { MutableRefObject, useEffect, useRef } from "react";
import { ToggleComponent } from "../../../../assets/ts/components";
import { CustomKTIcon } from "../../../components";


type PropsType = {
  sidebarRef: MutableRefObject<HTMLDivElement | null>;
};

const SidebarLogo = (props: PropsType) => {
  const { config } = useLayout();
  const toggleRef = useRef<HTMLDivElement>(null);

  const appSidebarDefaultMinimizeDesktopEnabled =
    config?.app?.sidebar?.default?.minimize?.desktop?.enabled;
  const appSidebarDefaultCollapseDesktopEnabled =
    config?.app?.sidebar?.default?.collapse?.desktop?.enabled;
  const toggleType = appSidebarDefaultCollapseDesktopEnabled
    ? "collapse"
    : appSidebarDefaultMinimizeDesktopEnabled
    ? "minimize"
    : "";
  const toggleState = appSidebarDefaultMinimizeDesktopEnabled ? "active" : "";
  const appSidebarDefaultMinimizeDefault =
    config.app?.sidebar?.default?.minimize?.desktop?.default;

  useEffect(() => {
    setTimeout(() => {
      const toggleObj = ToggleComponent.getInstance(
        toggleRef.current!
      ) as ToggleComponent | null;

      if (toggleObj === null) {
        return;
      }

      // Add a class to prevent sidebar hover effect after toggle click
      toggleObj.on("kt.toggle.change", function () {
        // Set animation state
        props.sidebarRef.current!.classList.add("animating");

        // Wait till animation finishes
        setTimeout(function () {
          // Remove animation state
          props.sidebarRef.current!.classList.remove("animating");
        }, 300);
      });
    }, 600);
  }, [toggleRef, props.sidebarRef]);

  return (
    <div className="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
      <Link to="/dashboard">
        {config.layoutType === "dark-sidebar" ? (
          <img
            alt="PlaySonic-Logo"
            src={toAbsoluteUrlForLocalImage("media/playsonic/palysonic-1.png")}
            className="h-40px w-200px app-sidebar-logo-default"
          />
        ) : (
          <>
            <img
              alt="PlaySonic-Logo"
              src={toAbsoluteUrlForLocalImage("")}
              className="h-75px w-200px app-sidebar-logo-default theme-light-show"
            />
            <img
              alt="PlaySonic-Logo"
              src={toAbsoluteUrlForLocalImage("")}
              className="h-65px w-200px app-sidebar-logo-default theme-dark-show"
            />
          </>
        )}
        <img
          alt="PlaySonic-Logo"
          src={toAbsoluteUrlForLocalImage("media/playsonic/playsonic-2.png")}
          className="h-30px app-sidebar-logo-minimize"
        />
      </Link>

      {(appSidebarDefaultMinimizeDesktopEnabled ||
        appSidebarDefaultCollapseDesktopEnabled) && (
        <div
          ref={toggleRef}
          id="kt_app_sidebar_toggle"
          className={clsx(
            "app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary h-30px w-30px position-absolute top-50 start-100 translate-middle rotate",
            { active: appSidebarDefaultMinimizeDefault }
          )}
          data-kt-toggle="true"
          data-kt-toggle-state={toggleState}
          data-kt-toggle-target="body"
          data-kt-toggle-name={`app-sidebar-${toggleType}`}
        >
          <CustomKTIcon
            iconName="black-left-line"
            className="fs-3 rotate-180 ms-1"
          />
        </div>
      )}
    </div>
  );
};

export { SidebarLogo };
