import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomImageCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { ImageBannerActionCell } from "./ImageBannerActionCell";
import { IImageBannerData } from "@domain/entities/general/ImageBanner/ImageBanner";
import DefaultImageCell from "@presentation/components/tables/cells/DefaultImageCell";

const ImageBannerListColumns: ReadonlyArray<Column<IImageBannerData>> = [
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
        title="SIDEBAR-ROLE-ID"
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
        title="Banner-Titel"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "titel",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.title} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="Banner-Description"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "description",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.description} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="Banner-Image"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "image",
    Cell: ({ ...props }) =>
      props.data[props.row.index]?.image ? (
        <CustomImageCell image={props.data[props.row.index]?.image} />
      ) : (
        <DefaultImageCell alt="Banner Image" />
      ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="Banner-Path"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "path",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.path} />;
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
      <ImageBannerActionCell id={props.data[props.row.index].id} />
    ),
  },
];

export { ImageBannerListColumns };
