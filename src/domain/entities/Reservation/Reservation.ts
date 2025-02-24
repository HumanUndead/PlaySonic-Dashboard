/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IReservationCommand {
  createReservation(url: string, body: any): Promise<IReservationData>;
  updateReservation(
    url: string,
    body: IReservationBody
  ): Promise<IReservationData>;
  deleteReservation(url: any, id: number): Promise<IReservationData>;
  multipleDeleteReservation(
    url: string,
    ids: number[]
  ): Promise<IReservationData>;
}

export interface IReservationQuery {
  getReservationList(url: string): Promise<IReservationBody>;
}

export interface IReservationQueryById {
  getReservationById(
    url: string,
    id: number | string
  ): Promise<IReservationData>;
}

export interface IReservationBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IReservationData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IReservationData {
  id: number;
  courtId: number;
  slotTypeId: number;
  startTime: string;
  endTime: string;
  ownerID: string;
  name: string;
  status: number;
  reservationTypeId: number;
  levelMin: number;
  levelMax: number;
  isPublic: boolean;
  reservationDate: string;
  addedDate: string;
  slotsRemaining: number;
  sportId: number;
  clubId: number;
  source: "Web" | "App" | null;
}
