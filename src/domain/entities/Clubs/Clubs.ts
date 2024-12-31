/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IClubCommand {
  createClub(url: string, body: any): Promise<IClubData>;
  updateClub(
    url: string,
    body: IClubBody
  ): Promise<IClubData>;
  deleteClub(url: any, id: number): Promise<IClubData>;
  multipleDeleteClub(
    url: string,
    ids: number[]
  ): Promise<IClubData>;
}

export interface IClubQuery {
  getClubList(url: string): Promise<IClubBody>;
}

export interface IClubQueryById {
  getClubById(
    url: string,
    id: number | string
  ): Promise<IClubData>;
}

export interface IClubBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IClubData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IClubData {
  id: number;
  cityId: number;
  countryId: number;
  areaId: number;
  phone: string;
  website: string;
  features: number;
  payload: string;
  location: string;
  distance: number;
  clubInfoResponses: any[];
  areaTranslations: any | null;
  courts: any | null;
  lat: number,
  lng:number
}
