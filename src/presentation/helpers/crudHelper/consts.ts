const QUERIES = {
  User: "user",
  USERS_LIST: "users-list",
  languageList: "languageList",
  countryDDL: "countryDDL",
  zoneList: "zoneList",
  policyList: "policyList",
  // ===========
  ClubList: "ClubList",
  CourtList: "CourtList",
  CourtScheduleList: "CourtScheduleList",
  SlotTypeList: "SlotTypeList",
  CourtSlotsList: "CourtSlotsList",
  CountryList: "CountryList",
  CityList: "CityList",
  AreaList: "AreaList",
  ReservationList: "ReservationtList",
  UserReservationList: "UserReservationtList",
  RolesList: "RolesList",
  ImageBannerList: "ImageBannerList",
  AdminUsersList: "AdminUsersList",
  PlaysonicUsersList: "PlaysonicUsersList",
  MyUsersList: "MyUsersList",
  UserTransectionsList: "UserTransectionsList",
  ClubUserTransectionsList: "ClubUserTransectionsList",
};
const PAGINATION_PAGES_COUNT = 3;
const defaultPageNumberInPagination = 1;
const defaultPageSizeInPagination = 10;

export {
  QUERIES,
  PAGINATION_PAGES_COUNT,
  defaultPageNumberInPagination,
  defaultPageSizeInPagination,
};
