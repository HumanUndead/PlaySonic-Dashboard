/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICourtCommand {
  createCourt(url: string, body: any): Promise<ICourtData>;
  updateCourt(url: string, body: ICourtBody): Promise<ICourtData>;
  deleteCourt(url: any, id: number): Promise<ICourtData>;
  multipleDeleteCourt(url: string, ids: number[]): Promise<ICourtData>;

  deleteCourtImage(
    url: string,
    id: number,
    isDeleteImage: boolean
  ): Promise<ICourtData>;
}

export interface ICourtQuery {
  getCourtList(url: string): Promise<ICourtBody>;
}

export interface ICourtQueryById {
  getCourtById(url: string, id: number | string): Promise<ICourtData>;
}

export interface ICourtBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ICourtData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ICourtData {
  id: number;
  clubId: number;
  rank: number;
  payload: string;
  indoor: boolean;
  courtTypeId: number;
  name: string;
  systemTypeId: number;
  allowedSlotTypes: number;
  sportId: number;
  fullPathImage: string;
  clubName: string;
}

export interface IMyCourt {
  id: number;
  fullPathImage: string;
  name: string;
  indoor: boolean;
}
