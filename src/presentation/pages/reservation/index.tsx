import { CustomTable } from "@presentation/components/tables";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo } from "react";
import { QUERIES } from "@presentation/helpers";
import { CustomModal } from "@presentation/components/modal/CustomModal";
import { useQuery, useQueryClient } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";
import {
  CustomKTIcon,
  CustomToast,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { ClubCommandInstance } from "@app/useCases/clubs";
import { ClubUrlEnum } from "@domain/enums/URL/Clubs/ClubUrls/Club";
import { ReservationQueryInstance } from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import { ReservationListColumns } from "./components/ReservationListColumns";
import { CreateReservationForm } from "./components/CreateReservationForm";
import ReservaionFilter from "./components/ReservaionFilter";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ReservationExpandedView } from "./components/ReservationExpandedView";

const ReservationList = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const from = queryParameters.get("from");

  const columns = useMemo(() => ReservationListColumns, []);

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: ReservationData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.ReservationList, [query]],
    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return ReservationQueryInstance.getReservationList(
        `${ReservationUrlEnum.GetReservationList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(ReservationData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [ReservationData, isFetching, isLoading, error]);

  const tableData = useMemo(() => ReservationData?.data, [ReservationData]);

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data = await ClubCommandInstance.multipleDeleteClub(
          ClubUrlEnum.MultipleDeleteClub,
          selected
        );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.ReservationList]);
          clearSelected();
          CustomToast(`Deleted successfully`, "success");
        }
      } catch (error) {
        console.error("Error when delete Sightseeing Tour", error);
        CustomToast(`Failed to Delete Sightseeing  Tour `, "error");
      }
    }
  };

  return (
    <>
      <CustomKTCard>
        {from === "calendar" && (
          <div className="tw-ml-10 tw-mt-4">
            <button onClick={() => navigate(`/apps/myreservations`)}>
              <CustomKTIcon iconName="element-6" className="fs-1" />
            </button>
            <CustomKTIcon iconName="element-9" className="fs-1 text-primary" />
          </div>
        )}
        <CustomTableToolbar
          addBtnAction={() => {
            setItemIdForUpdate(null);
          }}
          searchPlaceholder="SEARCH"
          filterBtn={true}
          FilterComponent={<ReservaionFilter />}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={false}
          addName="ADD"
        />
        <CustomTable
          columns={columns}
          data={tableData || []}
          ExpandingComponent={ReservationExpandedView}
        />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-Club"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateReservationForm />
        </CustomModal>
      )}
    </>
  );
};

function ReservationListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <ReservationList />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default ReservationListWrapper;
