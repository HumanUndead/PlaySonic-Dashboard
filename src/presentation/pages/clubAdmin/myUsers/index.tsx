import { CustomTable } from "@presentation/components/tables";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo } from "react";
import { QUERIES } from "@presentation/helpers";
import { useQuery } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";
import { MyUsersQueryInstance } from "@app/useCases/myUsers/query/myUsersQuery";
import { MyUsersUrlEnum } from "@domain/enums/URL/MyUsers/MyUsers";
import { MyUsersListColumns } from "./components/MyUsersListColumns";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
const MyUsers = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();
  const columns = useMemo(() => MyUsersListColumns, []);
  const { auth } = useAuthStore();
  const clubId = auth?.clubID || 0;

  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const {
    data: MyUsersData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.MyUsersList, [query]],
    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return MyUsersQueryInstance.getMyUsersList(
        `${MyUsersUrlEnum.GetMyUsersList}clubId=${clubId}+${searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(MyUsersData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [MyUsersData, isFetching, isLoading, error]);

  const tableData = useMemo(() => MyUsersData?.data, [MyUsersData]);
  // const checkSuperCreatePermission = useCheckPermission("Access Super Create");
  return (
    <>
      <CustomKTCard>
        <CustomTableToolbar
          addBtnAction={() => {
            setItemIdForUpdate(null);
          }}
          searchPlaceholder="SEARCH"
          filterBtn={true}
          // FilterComponent={<MyUsersFilter></MyUsersFilter>}
          addBtn={false}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
    </>
  );
};

function MyUsersListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <MyUsers />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default MyUsersListWrapper;
