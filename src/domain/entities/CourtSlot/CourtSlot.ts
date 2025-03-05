/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICourtSlotsCommand {
  createCourtSlots(url: string, body: any): Promise<ICourtSlotsData>;
  updateCourtSlots(
    url: string,
    body: ICourtSlotsBody
  ): Promise<ICourtSlotsData>;
  deleteCourtSlots(url: any, id: number): Promise<ICourtSlotsData>;
  multipleDeleteCourtSlots(
    url: string,
    ids: number[]
  ): Promise<ICourtSlotsData>;
}

export interface ICourtSlotsQuery {
  getCourtSlotsList(url: string): Promise<ICourtSlotsBody>;
}

export interface ICourtSlotsQueryById {
  getCourtSlotsById(url: string, id: number | string): Promise<ICourtSlotsData>;
}

export interface ICourtSlotsBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ICourtSlotsData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ICourtSlotsData {
  id: number;
  courtId: number;
  clubId: number;
  slotTypeId: number;
  courtName: string;
  clubName: string;
  slotType: number;
  fullPrice: number;
  singlePrice: number;
}
