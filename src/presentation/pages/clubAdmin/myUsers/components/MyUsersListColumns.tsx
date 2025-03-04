import { Column } from "react-table";
import {
  ActionItem,
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";

import { IMyUsersData } from "@domain/entities/MyUsers/MyUsers";
import { useNavigate } from "react-router-dom";

const MyUsersListColumns: ReadonlyArray<Column<IMyUsersData>> = [
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
        title="ROLE-NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.userName} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="PhoneNumber"
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
        title="Playsonic Id"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "playsonicId",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.playsonicId} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="Transaction"
        className="min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => {
      const navigate = useNavigate();
      return (
        <ActionItem
          icon="pencil"
          title="Transaction"
          onClick={() =>
            navigate(`/apps/clubtransection/${props.data[props.row.index]?.id}`)
          }
        />
      );
    },
  },
];

export { MyUsersListColumns };
