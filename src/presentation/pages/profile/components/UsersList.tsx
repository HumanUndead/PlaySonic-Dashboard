import { FC } from "react";
import { IconUserModel } from "../ProfileModels";
import { toAbsoluteUrlForLocalImage } from "../../../helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Content } from "../../../layout/components/content";

type Props = {
  users?: Array<IconUserModel>;
};

const UsersList: FC<Props> = ({ users = undefined }) => {
  return (
    <Content>
      {users &&
        users.map((user, i) => {
          return (
            <OverlayTrigger
              key={`${i}-${user.name}`}
              placement="top"
              overlay={<Tooltip id="tooltip-user-name">{user.name}</Tooltip>}
            >
              <div className="symbol symbol-35px symbol-circle">
                {user.avatar && (
                  <img
                    src={toAbsoluteUrlForLocalImage(user.avatar)}
                    alt="Pic"
                  />
                )}
                {user.initials && (
                  <span className="symbol-label bg-primary text-inverse-primary fw-bolder">
                    {user.initials}
                  </span>
                )}
              </div>
            </OverlayTrigger>
          );
        })}
    </Content>
  );
};

export { UsersList };
