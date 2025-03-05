import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { IAddUsersData } from "@domain/entities/general/AddUsers/AddUsers";
import { AdminUsersActionCell } from "./AdminUsersActionCell";

const AdminUsersListColumns: ReadonlyArray<Column<IAddUsersData>> = [
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
        title="NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.firstName} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="USER-NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "user name",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.userName} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="ROLE-Email"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "email",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.email} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="ROLE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "roleName",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.roleName} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="Club-Name"
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
        title="ROLE-Phone"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "phoneNumber",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.phoneNo} />;
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
    Cell: ({ ...props }) => (
      <AdminUsersActionCell id={props.data[props.row.index].id} />
    ),
  },
];

export { AdminUsersListColumns };
