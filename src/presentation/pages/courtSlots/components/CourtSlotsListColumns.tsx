import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { CourtSlotsActionCell } from "./CourtSlotsActionCell";
import { ICourtSlotsData } from "@domain/entities/CourtSlot/CourtSlot";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

const CourtSlotsListColumns: ReadonlyArray<Column<ICourtSlotsData>> = [
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
    id: "courtId",
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
        title="SLOT-TYPE-ID"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "slottype",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.slotType} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="FULL-PRICE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "fullprice",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.fullPrice} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SINGLE-PRICE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "singleprice",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.singlePrice} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="ACTION"
        className="min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => {
      const checkSuperEditPermission = useCheckPermission("Access Super Edit");
      const checkSuperDeletePermission = useCheckPermission(
        "Access Super Delete"
      );

      return checkSuperEditPermission || checkSuperDeletePermission ? (
        <CourtSlotsActionCell id={props.data[props.row.index].id} />
      ) : (
        <p>------------</p>
      );
    },
  },
];

export { CourtSlotsListColumns };
