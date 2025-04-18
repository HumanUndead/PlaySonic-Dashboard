import { PlaysonicUsersQueryByIdInstance } from "@app/useCases/general/playsonicUsers/query/PlaysonicUsersQueryById";
import { ReservationQueryByIdInstance } from "@app/useCases/reservation";
import { authenticationURLEnum } from "@domain/enums";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import { QUERIES } from "@presentation/helpers";
import { FC } from "react";
import { useQuery } from "react-query";

export const ReservationExpandedView: FC<any> = ({ row }) => {
  const { data: userReservationData, isLoading } = useQuery({
    queryKey: [QUERIES.UserReservationList, row.original.id],
    queryFn: () => {
      return ReservationQueryByIdInstance.getUserReservationById(
        `${ReservationUrlEnum.UserReservation}`,
        row.original.id
      );
    },
    enabled: row.original.reservationTypeId !== 4,
  });

  const { data, isLoading: isLoadingUser } = useQuery({
    queryKey: [QUERIES.PlaysonicUsersList, row.original.ownerID],
    queryFn: () => {
      return PlaysonicUsersQueryByIdInstance.getPlaysonicUsersById(
        authenticationURLEnum.getUser,
        row.original.ownerID
      );
    },
    enabled: row.original.reservationTypeId === 4,
  });

  if (isLoading || isLoadingUser) {
    return (
      <div className="px-8 py-4 bg-light-primary rounded mx-8 mb-4">
        <div className="d-flex justify-content-center">
          <span className="spinner-border text-primary"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-4 bg-light-primary rounded mx-8 mb-4">
      <div className="table-responsive">
        <table className="table-row-bordered table-row-gray-100">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800">
              <th>User Name</th>
              <th className="tw-pl-6">Phone</th>
            </tr>
          </thead>
          <tbody>
            {userReservationData &&
              userReservationData?.data?.map((user) => (
                <tr key={user.userId}>
                  <td>{user.fullName}</td>
                  <td className="tw-pl-6">{user.phone || "N/A"}</td>
                </tr>
              ))}
            {data && (
              <tr key={data.id}>
                <td>
                  {data.firstName} {data.lastName}
                </td>
                <td className="tw-pl-6">{data.phoneNo || "N/A"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
