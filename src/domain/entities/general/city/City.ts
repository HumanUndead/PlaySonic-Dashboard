/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICityCommand {
  createCity(url: string, body: any): Promise<ICityBody[]>;
  updateCity(url: string, body: ICityBody): Promise<ICityBody[]>;
  deleteCity(url: string, id: number): Promise<ICityBody[]>;
  multipleDeleteCity(url: string, ids: number[]): Promise<ICityBody>;
  deleteImage(
    url: string,
    id: number,
    isDeleteFlag: boolean,
    isDeleteImage: boolean
  ): Promise<ICityBody>;
}
export interface ICityQuery {
  getCityList(url: string): Promise<ICityBody>;
}
export interface ICityQueryById {
  getCityById(url: string, id: number | string): Promise<ICityData>;
}
export interface ICityBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ICityData[];
}
export interface ICityData {
  id: number;
  rank: number;
  payload: string;
  countryId: number;
  countryName: string;
  translations: ICityTranslation[];
}

export interface ICityTranslation {
  id: number;
  CityId: number;
  name: string;
  langId: number;
  description: string;
}
