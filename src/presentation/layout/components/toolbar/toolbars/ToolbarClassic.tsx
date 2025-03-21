import clsx from "clsx";
import { useState } from "react";
import { CreateAppModal, Dropdown1 } from "../../../../../partials";
import { useLayout } from "../../../core";
import { useIntl } from "react-intl";
import { CustomKTIcon } from "../../../../components";

const ToolbarClassic = () => {
  const intl = useIntl();
  const { config } = useLayout();
  const [showCreateAppModal, setShowCreateAppModal] = useState<boolean>(false);
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";

  return (
    <div className="d-flex align-items-center gap-2 gap-lg-3">
      {config.app?.toolbar?.filterButton && (
        <div className="m-0">
          <a
            href="#"
            className={clsx(
              "btn btn-sm btn-flex fw-bold",
              daterangepickerButtonClass
            )}
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
          >
            <CustomKTIcon iconName="filter" className="fs-6 text-muted me-1" />
            {intl.formatMessage({ id: "FILTER" })}
          </a>
          <Dropdown1 />
        </div>
      )}

      {config.app?.toolbar?.daterangepickerButton && (
        <div
          data-kt-daterangepicker="true"
          data-kt-daterangepicker-opens="left"
          className={clsx(
            "btn btn-sm fw-bold  d-flex align-items-center px-4",
            daterangepickerButtonClass
          )}
        >
          <div className="text-gray-600 fw-bold">
            {intl.formatMessage({ id: "LOADING_DATE_RANGE" })}
          </div>
          <CustomKTIcon iconName="calendar-8" className="fs-1 ms-2 me-0" />
        </div>
      )}

      {config.app?.toolbar?.secondaryButton && (
        <a href="#" className="btn btn-sm btn-flex btn-light fw-bold">
          {intl.formatMessage({ id: "FILTER" })}
        </a>
      )}

      {config.app?.toolbar?.primaryButton && (
        <a
          href="#"
          onClick={() => setShowCreateAppModal(true)}
          className="btn btn-sm fw-bold btn-primary"
        >
          {intl.formatMessage({ id: "CREATE" })}
        </a>
      )}
      <CreateAppModal
        show={showCreateAppModal}
        handleClose={() => setShowCreateAppModal(false)}
      />
    </div>
  );
};

export { ToolbarClassic };
