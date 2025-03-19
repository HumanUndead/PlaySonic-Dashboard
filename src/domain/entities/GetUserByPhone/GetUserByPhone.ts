/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IGetUserByPhone {
  getUserByPhone(url: string, phone: string): Promise<IUserPhoneData>;
}

export interface IPalaySonicBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IUserPhoneData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IUserPhoneData {
  id: number;
  userName: string;
  phoneNumer: string;
  userId: string;
  playSonicId: number;
}
