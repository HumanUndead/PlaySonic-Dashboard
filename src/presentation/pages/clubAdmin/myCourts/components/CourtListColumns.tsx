import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
  CustomStatusCell,
} from "@presentation/components/tables";
import { CourtActionCell } from "./CourtActionCell";
import { ICourtData } from "@domain/entities/Court/Court";
import ClubNameCell from "@presentation/helpers/cells/ClubNameCell";

const CourtListColumns: ReadonlyArray<Column<ICourtData>> = [
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
        title="SIDEBAR-COURT-ID"
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
        title="SIDEBAR-COURT-NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.name} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-COURT-CLUB"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "club",
    Cell: ({ ...props }) => (
      <ClubNameCell clubId={props.data[props.row.index]?.clubId} />
      // <CustomCell data={props.data[props.row.index]?.clubName} />
    ),
  },
  // {
  //   Header: (props) => (
  //     <CustomHeaderCell
  //       tableProps={props}
  //       title="SIDEBAR-COURT-PAYLOAD"
  //       enableSorting={false}
  //       className="min-w-125px"
  //     />
  //   ),
  //   id: "payload",
  //   Cell: ({ ...props }) => (
  //     <CustomCell data={props.data[props.row.index]?.payload} />
  //   ),
  // },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-COURT-RANK"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "rank",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.rank} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-COURT-INDOOR"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "indoor",
    Cell: ({ ...props }) => (
      <CustomStatusCell
        status={props.data[props.row.index]?.indoor ? "primary" : "danger"}
        title={props.data[props.row.index]?.indoor ? "Yes" : "No"}
      />
    ),
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
    Cell: ({ ...props }) => (
      <CourtActionCell
        id={props.data[props.row.index].id}
        name={props.data[props.row.index]?.name}
      />
    ),
  },
];

export { CourtListColumns };
