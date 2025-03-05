import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { CourtScheduleActionCell } from "./CourtScheduleActionCell";
import { ICourtScheduleData } from "@domain/entities/CourtSchedule/CourtSchedule";
import { DaysCell } from "@presentation/helpers/cells/DaysCell";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

const CourtScheduleListColumns: ReadonlyArray<Column<ICourtScheduleData>> = [
  {
    Header: (props) => <CustomSelectAll tableProps={props} />,
    id: "selection",
    Cell: ({ ...props }) => (
      <CustomSelectionCell id={props.data[props.row.index]?.id} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-CLUB-ID"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "id",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.id} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="COURT-NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "court",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.courtName} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="CLUB-NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "clubId",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.clubName} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="DAYS"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "days",
    Cell: ({ ...props }) => {
      return <DaysCell days={props.data[props.row.index]?.days} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="START-TIME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "starttime",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.startTime} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="END-TIME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "endtime",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.endTime} />;
    },
  },

  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="ACTION"
        className=" min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => {
      const checkSuperEditPermission = useCheckPermission("Access Super Edit");
      const checkSuperDeletePermission = useCheckPermission(
        "Access Super Delete"
      );
      return checkSuperDeletePermission || checkSuperEditPermission ? (
        <CourtScheduleActionCell id={props.data[props.row.index].id} />
      ) : (
        <p>------------</p>
      );
    },
  },
];

export { CourtScheduleListColumns };
