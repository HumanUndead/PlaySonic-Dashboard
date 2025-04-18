import { FC } from "react";
import { toAbsoluteUrlForLocalImage } from "../../../presentation/helpers";

type Props = {
  className: string;
  title: string;
  description: string;
  avatar: string;
};

const StatisticsWidget2: FC<Props> = ({
  className,
  title,
  description,
  avatar,
}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className="card-body d-flex align-items-center pt-3 pb-0">
        <div className="d-flex flex-column flex-grow-1 py-2 py-lg-13 me-2">
          <a
            href="#"
            className="fw-bold text-gray-900 fs-4 mb-2 text-hover-primary"
          >
            {title}
          </a>

          <span
            className="fw-semibold text-muted fs-5"
            dangerouslySetInnerHTML={{ __html: description }}
          ></span>
        </div>

        <img
          src={toAbsoluteUrlForLocalImage(avatar)}
          alt=""
          className="align-self-end h-100px"
        />
      </div>
      {/* end::Body */}
    </div>
  );
};

export { StatisticsWidget2 };
