import {
  CustomActionsCell,
  CustomModal,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { CustomToast } from "@presentation/components/alerts/CustomToast";
import { FC } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { useListView } from "@presentation/context/index";
import { IReservationData } from "@domain/entities/Reservation/Reservation";
import {
  ReservationCommandInstance,
  ReservationQueryByIdInstance,
} from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import CalenderUpdateReservationForm from "./CalenderUpdateReservationForm";
import StatusApproval from "@presentation/helpers/StatusApproval";

interface Props {
  id: number;
  name?: string;
  canDelete?: boolean;
}

const CalenderReservationActionCell: FC<Props> = ({ id, name, canDelete }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["MyReservations", id],
    queryFn: () => {
      return ReservationQueryByIdInstance.getReservationById(
        ReservationUrlEnum.GetReservationById,
        id
      );
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get Reservation data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteReservation } = useMutation(
    async (id: number) => {
      const data = await ReservationCommandInstance.deleteReservation(
        ReservationUrlEnum.DeleteReservation,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: IReservationData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await ReservationCommandInstance.deleteReservation(
              ReservationUrlEnum.DeleteReservation + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: ["MyReservations"],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: ["MyReservations"],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete Reservation", error);
        CustomToast(`Failed to delete Reservation`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteReservation(id);
    }
  };

  return (
    <>
      <CustomActionsCell
        id={id}
        editBtn={false}
        editBtnOnClick={() => {
          setItemIdForUpdate(id);
        }}
        deleteBtn={canDelete}
        deletBtnOnClick={() => handleDelete()}
        children={<StatusApproval id={id} queryKey={"MyReservations"} />}
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="Reservation-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <CalenderUpdateReservationForm
              ReservationData={data}
              isLoading={isLoading}
            />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { CalenderReservationActionCell };
