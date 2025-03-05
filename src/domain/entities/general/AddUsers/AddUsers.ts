/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAddUsersCommand {
  createAddUsers(url: string, body: any): Promise<IAddUsersData>;
  updateAddUsers(url: string, body: IAddUsersBody): Promise<IAddUsersData>;
  deleteAddUsers(url: any, id: number): Promise<IAddUsersData>;
  multipleDeleteAddUsers(url: string, ids: number[]): Promise<IAddUsersData>;
}

export interface IAddUsersQuery {
  getAddUsersList(url: string): Promise<IAddUsersBody>;
}

export interface IAddUsersQueryById {
  getAddUsersById(url: string, id: number | string): Promise<IAddUsersData>;
}

export interface IAddUsersBody {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: IAddUsersData[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface IAddUsersData {
  id: number;
  userName: string;
  firstName: string;
  email: string;
  password: string;
  phoneNo: string;
  phoneNumber: string;
  roleId: number;
  clubId: number;
  roleName: string;
  clubName: string;
}
