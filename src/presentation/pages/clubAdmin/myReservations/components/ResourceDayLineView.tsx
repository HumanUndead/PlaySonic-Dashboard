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
import { ReservationStatusEnum } from "@domain/enums/reservationStatus/ReservationStatusEnum";
import { CalenderCreateMyReservationForm } from "./CalenderCreateMyReservationForm";

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceId: number;
  status: number;
  reservationData: IReservationData;
}

const localizer = momentLocalizer(moment);

const statusColors = {
  New: "#3699FF", // primary
  Approved: "#1BC5BD", // success
  Confirmed: "#E4E6EF", // secondary
  InProgress: "#FFA800", // warning
  Finished: "#181C32", // dark
  Cancelled: "#F64E60", // danger
};

const ResourceDayLineView = () => {
  const { auth } = useAuthStore();
  const clubId = auth?.clubID || 0;
  const navigate = useNavigate();
  const [isModalopen, setIsModalOpen] = useState<boolean>(false);
  const [isReservationModal, setIsReservationModal] = useState(false);
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
        status: reservation.status,
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

  const getEventStyle = (event: CalendarEvent) => {
    const status = ReservationStatusEnum[event.status];
    const backgroundColor =
      statusColors[status as keyof typeof statusColors] || "#3699FF";

    return {
      style: {
        backgroundColor,
        color: "#FFFFFF",
        borderRadius: "4px",
        border: "none",
      },
    };
  };

  const onSelectEvent = (event: CalendarEvent) => {
    setIsModalOpen(true);
    setModalTitle(event.title);
    setReservationPerDay([event.reservationData]);
  };

  const onSelectSlot = (slotInfo: any) => {
    setIsReservationModal(true);
    setClickedReservationDate(slotInfo.start);
    setClickedReservationTime(slotInfo.start);
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
        <div className="tw-flex tw-flex-wrap tw-gap-4 tw-pr-4 tw-py-2 ">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="tw-flex tw-items-center tw-gap-2">
              <div
                className="tw-w-4 tw-h-4 tw-rounded"
                style={{ backgroundColor: color }}
              />
              <span className="tw-text-sm">{status}</span>
            </div>
          ))}
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          resources={resources}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          defaultDate={new Date()}
          defaultView={defaultView}
          onSelectSlot={(slotInfo) => {
            console.log(slotInfo);
          }}
          components={{
            event: (props) => {
              return (
                <>
                  <div className="tw-text-md">{props.event.title}</div>
                  <div className="tw-mt-2 tw-text-md">{"07782138223"}</div>
                </>
              );
            },
          }}
          timeslots={1}
          views={[Views.DAY]}
          onSelectEvent={onSelectEvent}
          eventPropGetter={getEventStyle}
          selectable
          style={{
            height: "100%",
          }}
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
        {isReservationModal && (
          <CustomModal
            modalTitle="Create-Reservation"
            modalSize={"xl"}
            onClick={() => setIsReservationModal(false)}
          >
            <CalenderCreateMyReservationForm
              courtId={courtId}
              reservationDate={clickedReservationDate}
              startTime={clickedReservationTime}
              clubId={clubId}
              isIndoor={isIndoor}
            />
          </CustomModal>
        )}
      </CustomKTCardBody>
    </CustomKTCard>
  );
};

export default ResourceDayLineView;
