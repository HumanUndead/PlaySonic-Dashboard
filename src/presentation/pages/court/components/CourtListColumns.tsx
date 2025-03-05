import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomImageCell,
  CustomSelectAll,
  CustomSelectionCell,
  CustomStatusCell,
} from "@presentation/components/tables";
import { CourtActionCell } from "./CourtActionCell";
import { ICourtData } from "@domain/entities/Court/Court";
import { AllowedSlotsTypeCell } from "@presentation/helpers/cells/AllowedSlotsTypeCell";
import DefaultImageCell from "@presentation/components/tables/cells/DefaultImageCell";

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
      <CustomCell data={props.data[props.row.index]?.name || "NA"} />
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
      <CustomCell data={props.data[props.row.index]?.clubName} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-Allowed-Slots"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "slotType",
    Cell: ({ ...props }) => {
      return (
        <AllowedSlotsTypeCell
          slot={props.data[props.row.index]?.allowedSlotTypes}
        />
      );
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="COURT-IMAGE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "image",
    Cell: ({ ...props }) =>
      props.data[props.row.index]?.fullPathImage ? (
        <CustomImageCell image={props.data[props.row.index]?.fullPathImage} />
      ) : (
        <DefaultImageCell alt="Court image" />
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
