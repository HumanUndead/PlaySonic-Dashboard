import { type FC } from "react";

type Props = {
  alt?: string;
};

const DefaultImageCell: FC<Props> = ({ alt }) => {
  return (
    <div className="d-flex align-items-center">
      <div className="symbol symbol-square symbol-50px overflow-hidden me-3">
        <div className="symbol-label">
          <img
            src={"/public/media/logos/TabLogo.jpeg"}
            alt={alt}
            className="w-100"
          />
        </div>
      </div>
    </div>
  );
};

export default DefaultImageCell;
