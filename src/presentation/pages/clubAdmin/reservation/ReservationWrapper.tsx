import { Content, ToolbarWrapper } from "@presentation/layout";
import { Outlet } from "react-router-dom";

const ReservationWrapper = () => {
  return (
    <>
      <ToolbarWrapper />
      <Content>
        <Outlet />
      </Content>
    </>
  );
};

export { ReservationWrapper };
