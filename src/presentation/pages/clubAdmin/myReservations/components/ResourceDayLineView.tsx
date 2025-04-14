import { useMemo, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import { useQuery } from "react-query";
import { CourtQueryInstance } from "@app/useCases/court";
import { CourtUrlEnum } from "@domain/enums/URL/Court/CourtUrls/Court";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
import moment from "moment";
import { ICourtData } from "@domain/entities/Court/Court";
import { ReservationQueryInstance } from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { IReservationData } from "@domain/entities/Reservation/Reservation";
import {
  CustomKTCard,
  CustomKTCardBody,
  CustomKTIcon,
  CustomModal,
  CustomTable,
} from "@presentation/components";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalenderReservationListColumns } from "./CalenderReservationListColumns";

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceId: number;
  reservationData: IReservationData;
}
const localizer = momentLocalizer(moment);

const ResourceDayLineView = () => {
  const { auth } = useAuthStore();
  const clubId = auth?.clubID || 0;
  const navigate = useNavigate();
  const [isModalopen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [reservationPerDay, setReservationPerDay] = useState<
    IReservationData[]
  >([]);

  const columns = useMemo(() => CalenderReservationListColumns, []);

  const { data: courtsData } = useQuery({
    queryKey: ["Courts", clubId],
    queryFn: () =>
      CourtQueryInstance.getCourtList(
        CourtUrlEnum.GetCourtList + `clubId=${clubId}`
      ),
  });

  const {
    data: ReservationData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["MyReservations"],
    queryFn: () => {
      return ReservationQueryInstance.getReservationList(
        `${ReservationUrlEnum.GetReservationList}clubId=${clubId}`
      );
    },
  });

  const events = useMemo(() => {
    if (!ReservationData?.data) return [];
    return ReservationData.data.map((reservation: IReservationData) => {
      const startDateTime = new Date(
        `${reservation.reservationDate.split("T")[0]}T${reservation.startTime}`
      );
      const endDateTime = new Date(
        `${reservation.reservationDate.split("T")[0]}T${reservation.endTime}`
      );

      return {
        id: reservation.id,
        title: reservation.name,
        start: startDateTime,
        end: endDateTime,
        resourceId: reservation.courtId,
        reservationData: reservation,
      };
    });
  }, [ReservationData]);

  const resources = useMemo(() => {
    if (!courtsData?.data) return [];

    return courtsData.data.map((court: ICourtData) => ({
      resourceId: court.id,
      resourceTitle: court.name,
    }));
  }, [courtsData]);

  const defaultView = Views.DAY;

  const onSelectEvent = (event: CalendarEvent) => {
    setIsModalOpen(true);
    setModalTitle(event.title);
    setReservationPerDay([event.reservationData]);
  };

  if (isLoading || isFetching) return <PleaseWaitTxt />;

  return (
    <CustomKTCard>
      <div className="tw-ml-10 tw-mt-4 tw-flex tw-gap-1">
        <button onClick={() => navigate(`/apps/myreservations`)}>
          <CustomKTIcon iconName="element-6" className="fs-1" />
        </button>
        <button
          onClick={() => navigate(`/apps/myreservations/list?from=calendar`)}
        >
          <CustomKTIcon iconName="element-9" className="fs-1" />
        </button>
        <CustomKTIcon iconName="element-10" className="fs-1 text-primary" />
      </div>
      <CustomKTCardBody>
        <Calendar
          localizer={localizer}
          events={events}
          resources={resources}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          defaultDate={new Date()}
          defaultView={defaultView}
          views={[Views.DAY]}
          onSelectEvent={onSelectEvent}
          style={{ height: "100%" }}
        />
        {isModalopen && (
          <CustomModal
            modalTitle={modalTitle}
            modalSize={"xl"}
            onClick={() => setIsModalOpen(false)}
          >
            <CustomTable
              withPagination={false}
              columns={columns}
              data={reservationPerDay || []}
            />
          </CustomModal>
        )}
      </CustomKTCardBody>
    </CustomKTCard>
  );
};

export default ResourceDayLineView;
