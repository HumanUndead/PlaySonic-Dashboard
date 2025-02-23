/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPlaysonicUsersCommand {
  createPlaysonicUsers(url: string, body: any): Promise<IPlaysonicUsersData>;
  updatePlaysonicUsers(
    url: string,
    body: IPlaysonicUsersBody
  ): Promise<IPlaysonicUsersData>;
  deletePlaysonicUsers(url: any, id: number): Promise<IPlaysonicUsersData>;
  multipleDeletePlaysonicUsers(
    url: string,
    ids: number[]
  ): Promise<IPlaysonicUsersData>;
}

export interface IPlaysonicUsersQuery {
  getPlaysonicUsersList(url: string): Promise<IPlaysonicUsersBody>;
}

export interface IPlaysonicUsersQueryById {
  getPlaysonicUsersById(
    url: string,
    id: number | string
  ): Promise<IPlaysonicUsersData>;
}

export interface IPlaysonicUsersBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IPlaysonicUsersData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IPlaysonicUsersData {
  id: number;
  email: string;
  userName: string;
  phoneNo: string;
  firstName: string;
  lastName: string;
  address: string | null;
  countryId: string | null;
  cityId: string | null;
  postCode: string | null;
  photo: string | null;
  active: boolean;
  level: number;
  otp: string;
  token: string;
}

export interface IPlaysonicUserUpdate {
  id: string;
  level?: number;
  password?: string;
}
