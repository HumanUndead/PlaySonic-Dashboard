import { FC } from "react";
import { toAbsoluteUrlForLocalImage } from "../../../presentation/helpers";
import { CustomKTIcon } from "../../../presentation/components";
// import { toAbsoluteUrlForLocalImage } from "../../../helpers";
// import { KTSVG } from "../../../helpers";

type Props = {
  className: string;
  bgColor?: string;
  bgImage?: string;
  innerPadding?: string;
  bgHex?: string;
  lg?: string;
};

const EngageWidget1: FC<Props> = ({
  className,
  bgHex = "",
  bgColor = "",
  lg = "",
  bgImage = "",
}) => {
  let bgImagePath = bgImage
    ? toAbsoluteUrlForLocalImage(`media/${bgImage}`)
    : "";
  if (bgImagePath) {
    bgImagePath = `url("${bgImagePath}")`;
  }

  return (
    <div className={`card ${className}`}>
      <div
        className={`card-body card-rounded p-0 d-flex bg-${bgColor}`}
        style={{ backgroundColor: bgHex }}
      >
        <div
          className={`d-flex flex-column flex-lg-row-auto ${
            lg ? "py-10 py-md-14 px-10 px-md-20 pe-lg-0" : "p-10 p-md-20"
          }`}
        >
          <h1 className={`fw-bold text-gray-900 ${lg ? "mb-0" : ""}`}>
            Search Goods
          </h1>
          <div className="fs-3 mb-8">Get Amazing Gadgets</div>
          <form className="d-flex flex-center py-2 px-6 bg-body rounded">
            <CustomKTIcon iconName="magnifier" className="fs-1 text-primary" />
            <input
              type="text"
              className={`form-control border-0 fw-semibold ps-2 ${
                lg ? "w-xxl-600px" : "w-xxl-350px"
              }`}
              placeholder="Search Goods"
            />
          </form>
        </div>
        <div
          className={`d-none d-md-flex flex-row-fluid mw-400px ml-auto ${
            bgImage
              ? "bgi-no-repeat bgi-position-y-center bgi-position-x-left bgi-size-cover"
              : ""
          }`}
          style={{ backgroundImage: bgImagePath }}
        ></div>
      </div>
    </div>
  );
};

export { EngageWidget1 };
