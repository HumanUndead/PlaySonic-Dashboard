/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAreaCommand {
  createArea(url: string, body: any): Promise<IAreaBody[]>;
  updateArea(url: string, body: IAreaBody): Promise<IAreaBody[]>;
  deleteArea(url: string, id: number): Promise<IAreaBody[]>;
  multipleDeleteArea(url: string, ids: number[]): Promise<IAreaBody>;
}
export interface IAreaQuery {
  getAreaList(url: string): Promise<IAreaBody>;
}
export interface IAreaQueryById {
  getAreaById(url: string, id: number | string): Promise<IAreaData>;
}
export interface IAreaBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IAreaData[];
}
export interface IAreaData {
  id: number;
  rank: number;
  payload: string;
  cityId: number;
  cityName: string;
  translations: IAreaTranslation[];
}

export interface IAreaTranslation {
  id: number;
  AreaId: number;
  name: string;
  languageId: number;
  description: string;
}
