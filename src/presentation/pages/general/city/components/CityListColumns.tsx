import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { ICityData } from "@domain/entities/general/city/City";
import { CityActionCell } from "./CityActionCell";

const CityListColumns: ReadonlyArray<Column<ICityData>> = [
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
        title="SIDEBAR-CITY-NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.translations[0]?.name} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-COUNTRYNAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "countryname",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.countryName} />
    ),
  },
  // {
  //   Header: (props) => (
  //     <CustomHeaderCell
  //       tableProps={props}
  //       title="SIDEBAR-CLUB-PAYLOAD"
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
        title="SIDEBAR-COUNTRY-RANK"
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
        title="ACTION"
        className=" min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => (
      <CityActionCell id={props.data[props.row.index].id} />
    ),
  },
];

export { CityListColumns };
