import { ClubAdminWrapper } from "@presentation/pages/clubAdmin/ClubAdminWrapper";
import { Route } from "./Routes";
import { lazy } from "react";
import ReservationClubListWrapper from "@presentation/pages/clubAdmin/reservation";

const MyCourtsWrapper = lazy(
  () => import("@presentation/pages/clubAdmin/myCourts")
);

const MyReservations = lazy(
  () => import("@presentation/pages/clubAdmin/myReservations")
);

const ViewCourtWrapper = lazy(
  () => import("@presentation/pages/clubAdmin/myCourts/components/ViewCourt")
);

const CourtSlotsListWrapper = lazy(
  () => import("@presentation/pages/courtSlots")
);

const CourtScheduleListWrapper = lazy(
  () => import("@presentation/pages/courtSchedule")
);

const MyUsersListWrapper = lazy(
  () => import("@presentation/pages/clubAdmin/myUsers")
);

const ClubUserTransectionsListWrapper = lazy(
  () => import("@presentation/pages/clubAdmin/myUsers/components/Transections")
);

const ClubAdminRoutes: Route = {
  path: "/apps",
  title: "",
  component: ClubAdminWrapper,
  role: ["admin"],
  breadcrumbs: [],
  children: [
    {
      path: "mycourts",
      title: "SIDEBAR-My-Courts",
      component: MyCourtsWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "myreservations",
      title: "SIDEBAR-My-Reservations",
      component: MyReservations,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "myreservations/list",
      title: "SIDEBAR-My-Reservations",
      component: ReservationClubListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "viewcourt/:id",
      title: "SIDEBAR-Court",
      component: ViewCourtWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "courtslots/:courtId",
      title: "SIDEBAR-COURT-SLOTS",
      component: CourtSlotsListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "courtschedule/:courtId",
      title: "SIDEBAR-COURT-SCHEDULE",
      component: CourtScheduleListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "myusers",
      title: "SIDEBAR-My-Users",
      component: MyUsersListWrapper,
      role: [],
      breadcrumbs: [],
    },
    {
      path: "clubtransection/:userId",
      title: "SIDEBAR-USER-TRANSECTOINS",
      component: ClubUserTransectionsListWrapper,
      role: [],
      breadcrumbs: [],
    },
  ],
};

export { ClubAdminRoutes };
