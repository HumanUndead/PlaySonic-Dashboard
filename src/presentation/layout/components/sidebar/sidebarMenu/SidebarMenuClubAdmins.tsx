import useCheckPermission from "@presentation/helpers/useCheckPermission";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarMenuClubAdmins = () => {
  const checkMyCourtPermission = useCheckPermission("Access Club Courts");
  const checkMyReservaionPermission = useCheckPermission(
    "Access Club Reservation"
  );
  const checkMyUsersPermission = useCheckPermission("Access Club Users");

  return (
    <>
      {checkMyCourtPermission && (
        <SidebarMenuItem
          to="/apps/mycourts"
          title={"SIDEBAR-My-Courts"}
          hasBullet={true}
        />
      )}
      {checkMyReservaionPermission && (
        <SidebarMenuItem
          to="/apps/myreservations/resource-view"
          title="SIDEBAR-My-Reservations"
          hasBullet={true}
        />
      )}

      {/* ----- Until api done ---- */}

      {checkMyUsersPermission && (
        <SidebarMenuItem
          to="/apps/myusers"
          title="SIDEBAR-My-Users"
          hasBullet={true}
        />
      )}
    </>
  );
};

export { SidebarMenuClubAdmins };
