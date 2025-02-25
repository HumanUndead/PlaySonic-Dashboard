import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomImageCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { IClubData } from "@domain/entities/Clubs/Clubs";
import { ClubActionCell } from "./CustomClubActionCell";
import { FeaturesCell } from "@presentation/helpers/cells/FeaturesCell";
import CityNameCell from "@presentation/helpers/cells/CityNameCell";
import CountryNameCell from "@presentation/helpers/cells/CountryNameCell";
import AreaNameCell from "@presentation/helpers/cells/AreaNameCell";
import DefaultImageCell from "@presentation/components/tables/cells/DefaultImageCell";

const ClubListColumns: ReadonlyArray<Column<IClubData>> = [
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
        title="SIDEBAR-CLUB-NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => (
      <CustomCell
        data={props.data[props.row.index]?.clubInfoResponses[0]?.name || "NA"}
      />
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
        title="SIDEBAR-CLUB-COUNTRY"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "country",
    Cell: ({ ...props }) => (
      <CountryNameCell countryId={props.data[props.row.index]?.countryId} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-CLUB-CITY"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "city",
    Cell: ({ ...props }) => (
      <CityNameCell cityId={props.data[props.row.index]?.cityId} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-CLUB-AREA"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "area",
    Cell: ({ ...props }) => (
      <AreaNameCell areaId={props.data[props.row.index]?.areaId} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-CLUB-FEATURE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "feature",
    Cell: ({ ...props }) => (
      <FeaturesCell features={props.data[props.row.index]?.features} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-CLUB-PHONENUMBER"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "phoneNumber",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.phone} />
    ),
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
      props.data[props.row.index]?.image ? (
        <CustomImageCell image={props.data[props.row.index]?.image} />
      ) : (
        <DefaultImageCell alt="Club image" />
      ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="Club Banner Images"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "images",
    Cell: ({ ...props }) =>
      props.data[props.row.index]?.images ? (
        <CustomImageCell
          image={props.data[props.row.index]?.images.split(",")[0]}
        />
      ) : (
        <DefaultImageCell alt="Club Banner Images" />
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
      <ClubActionCell
        id={props.data[props.row.index].id}
        name={props.data[props.row.index]?.payload}
      />
    ),
  },
];

export { ClubListColumns };
