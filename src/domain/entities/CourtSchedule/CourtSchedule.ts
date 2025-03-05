/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICourtScheduleCommand {
  createCourtSchedule(url: string, body: any): Promise<ICourtScheduleData>;
  updateCourtSchedule(
    url: string,
    body: ICourtScheduleBody
  ): Promise<ICourtScheduleData>;
  deleteCourtSchedule(url: any, id: number): Promise<ICourtScheduleData>;
  multipleDeleteCourtSchedule(
    url: string,
    ids: number[]
  ): Promise<ICourtScheduleData>;
}

export interface ICourtScheduleQuery {
  getCourtScheduleList(url: string): Promise<ICourtScheduleBody>;
}

export interface ICourtScheduleQueryById {
  getCourtScheduleById(
    url: string,
    id: number | string
  ): Promise<ICourtScheduleData>;
}

export interface ICourtScheduleBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: ICourtScheduleData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ICourtScheduleData {
  id: number;
  courtId: number;
  clubId: number;
  days: number;
  startTime: string;
  endTime: string;
  sportId: number;
  courtName: string;
  clubName: string;
}
