import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
  CustomStatusCell,
} from "@presentation/components/tables";
import { ReservationActionCell } from "./ReservationActionCell";
import { IReservationData } from "@domain/entities/Reservation/Reservation";
import CourtNameCell from "@presentation/helpers/cells/CourtNameCell";
import SlotTypeNameCell from "@presentation/helpers/cells/SlotTypeNameCell";
import { ReservationTypeEnum } from "@domain/enums/reservationType/ReservationTypeEnum";
import { ReservationStatusEnum } from "@domain/enums/reservationStatus/ReservationStatusEnum";
import ClubNameCell from "@presentation/helpers/cells/ClubNameCell";

const ReservationListColumns: ReadonlyArray<Column<IReservationData>> = [
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
        title="SIDEBAR-RESERVATION-COURT-ID"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "courtId",
    Cell: ({ ...props }) => (
      <CourtNameCell courtId={props.data[props.row.index]?.courtId} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-CLUB-ID"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "clubId",
    Cell: ({ ...props }) => (
      <ClubNameCell clubId={props.data[props.row.index]?.clubId} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="STATUS-APPROVAL"
        className=" min-w-150px tw-text-center"
      />
    ),
    id: "approval",
    Cell: ({ ...props }) => (
      <CustomStatusCell
        status={
          ReservationStatusEnum[props.data[props.row.index]?.status] === "New"
            ? "primary"
            : ReservationStatusEnum[props.data[props.row.index]?.status] ===
              "Approved"
            ? "success"
            : ReservationStatusEnum[props.data[props.row.index]?.status] ===
              "Confirmed"
            ? "secondary"
            : ReservationStatusEnum[props.data[props.row.index]?.status] ===
              "InProgress"
            ? "warning"
            : ReservationStatusEnum[props.data[props.row.index]?.status] ===
              "Finished"
            ? "dark"
            : "danger"
        }
        title={ReservationStatusEnum[props.data[props.row.index]?.status]}
      />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-OWNER-NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "ownerName",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.name} />
    ),
  },

  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-START-TIME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "startTime",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.startTime} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-END-TIME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "endTime",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.endTime} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-RESERVATOIN-DATE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "reservationDate",
    Cell: ({ ...props }) => {
      const reservationDate = props.data[props.row.index]?.reservationDate
        .split("T")
        .shift();

      return <CustomCell data={reservationDate || "NA"} />;
    },
  },
  // {
  //   Header: (props) => (
  //     <CustomHeaderCell
  //       tableProps={props}
  //       title="SIDEBAR-RESERVATION-ADD-DATE"
  //       enableSorting={false}
  //       className="min-w-125px"
  //     />
  //   ),
  //   id: "addedDate",
  //   Cell: ({ ...props }) => {
  //     const addedDate = props.data[props.row.index]?.addedDate
  //       .split("T")
  //       .shift();
  //     return <CustomCell data={addedDate || "NA"} />;
  //   },
  // },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-SLOT-TYPE-ID"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "slotTypeId",
    Cell: ({ ...props }) => {
      return (
        <SlotTypeNameCell
          slotTypeId={props.data[props.row.index]?.slotTypeId}
        />
      );
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-RESERVATION-TYPE-ID"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "reservationTypeId",
    Cell: ({ ...props }) => (
      <CustomCell
        data={
          ReservationTypeEnum[props.data[props.row.index]?.reservationTypeId]
        }
      />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-LEVEL-MIN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "levelMin",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.levelMin} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-LEVEL-MAX"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "levelMax",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.levelMax} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-IsPublic"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "isPublic",
    Cell: ({ ...props }) => (
      <CustomStatusCell
        status={props.data[props.row.index]?.isPublic ? "primary" : "danger"}
        title={props.data[props.row.index]?.isPublic ? "Yes" : "No"}
      />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-RESERVATION-STATUS"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "status",
    Cell: ({ ...props }) => (
      <CustomStatusCell
        status={
          ReservationStatusEnum[props.data[props.row.index]?.status] === "New"
            ? "primary"
            : ReservationStatusEnum[props.data[props.row.index]?.status] ===
              "Approved"
            ? "success"
            : ReservationStatusEnum[props.data[props.row.index]?.status] ===
              "Confirmed"
            ? "secondary"
            : ReservationStatusEnum[props.data[props.row.index]?.status] ===
              "InProgress"
            ? "warning"
            : ReservationStatusEnum[props.data[props.row.index]?.status] ===
              "Finished"
            ? "dark"
            : "danger"
        }
        title={ReservationStatusEnum[props.data[props.row.index]?.status]}
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
      <ReservationActionCell
        id={props.data[props.row.index].id}
        status={props.data[props.row.index].status}
      />
    ),
  },
];

export { ReservationListColumns };
