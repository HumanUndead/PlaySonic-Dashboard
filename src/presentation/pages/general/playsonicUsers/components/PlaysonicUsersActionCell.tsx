import {
  ActionItem,
  CustomActionsCell,
  CustomModal,
} from "@presentation/components";
import { CustomToast } from "@presentation/components/alerts/CustomToast";
import { FC } from "react";
import { useQueryClient, useQuery } from "react-query";
import { QUERIES } from "@presentation/helpers";
import { useListView } from "@presentation/context/index";
import UpdatePlaysonicUsersForm from "./UpdatePlaysonicUsersForm";
import { PlaysonicUsersQueryByIdInstance } from "@app/useCases/general/playsonicUsers/query/PlaysonicUsersQueryById";
import { authenticationURLEnum } from "@domain/enums";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
}

const PlaysonicUsersActionCell: FC<Props> = ({ id }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.PlaysonicUsersList, id],
    queryFn: () => {
      return PlaysonicUsersQueryByIdInstance.getPlaysonicUsersById(
        authenticationURLEnum.getUser,
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

  console.log("data", data);
  return (
    <>
      <CustomActionsCell
        id={id}
        editBtnOnClick={() => {
          setItemIdForUpdate(id);
        }}
        deleteBtn={false}
        children={
          <ActionItem
            icon="pencil"
            title="Transaction"
            onClick={() => navigate(`/apps/admin/usertransection/${id}`)}
          />
        }
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="Update Playsonic User"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdatePlaysonicUsersForm
              PlaysonicUserData={data}
              isLoading={isLoading}
            />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { PlaysonicUsersActionCell };
