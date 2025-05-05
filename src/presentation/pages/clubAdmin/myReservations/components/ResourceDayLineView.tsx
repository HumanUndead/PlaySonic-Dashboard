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
import { QUERIES } from "@presentation/helpers";
import { CourtScheduleQueryInstance } from "@app/useCases/courtSchedule";
import { CourtScheduleUrlEnum } from "@domain/enums/URL/CourtSchedule/CourtScheduleUrls/CourtSchedule";
import DatePicker from "react-datepicker";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";

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
  New: "#40a6dc", // primary
  Approved: "#17c653", // success
  Confirmed: "#E4E6EF", // secondary
  InProgress: "#FFA800", // warning
  Finished: "#181C32", // dark
  Cancelled: "#f8285a", // danger
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

  const [clickedReservationDate, setClickedReservationDate] =
    useState<string>("");
  const [clickedReservationTime, setClickedReservationTime] =
    useState<string>("");
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [isIndoor, setIsIndoor] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const columns = useMemo(() => CalenderReservationListColumns, []);

  const { data: courtsData } = useQuery({
    queryKey: ["Courts", clubId],
    queryFn: () =>
      CourtQueryInstance.getCourtList(
        CourtUrlEnum.GetCourtList + `clubId=${clubId}`
      ),
  });

  const {
    data: CourtScheduleData,
    isLoading: CourtScheduleLoading,
    isFetching: CourtScheduleFetching,
  } = useQuery({
    queryKey: [QUERIES.CourtScheduleList, courtsData?.data[0].id],

    queryFn: () => {
      return CourtScheduleQueryInstance.getCourtScheduleList(
        `${CourtScheduleUrlEnum.GetCourtScheduleList}courtId=${courtsData?.data[0].id}`
      );
    },
    enabled: !!courtsData?.data[0].id,
  });

  // Get min and max times from court schedule
  const minTime = useMemo(() => {
    if (!CourtScheduleData?.data?.[0]?.startTime) return "00:00:00";
    return CourtScheduleData.data[0].startTime;
  }, [CourtScheduleData]);

  const maxTime = useMemo(() => {
    if (!CourtScheduleData?.data?.[0]?.endTime) return "23:59:59";
    return CourtScheduleData.data[0].endTime;
  }, [CourtScheduleData]);

  // Check if the schedule spans overnight
  const isOvernight = useMemo(() => {
    if (!minTime || !maxTime) return false;
    const startHour = parseInt(minTime.split(":")[0]);
    const endHour = parseInt(maxTime.split(":")[0]);
    return endHour < startHour;
  }, [minTime, maxTime]);

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
    const allEvents: CalendarEvent[] = [];

    ReservationData.data.forEach((reservation: IReservationData) => {
      const startDateTime = new Date(
        `${reservation.reservationDate.split("T")[0]}T${reservation.startTime}`
      );
      const endDateTime = new Date(
        `${reservation.reservationDate.split("T")[0]}T${reservation.endTime}`
      );

      const isOvernight = endDateTime < startDateTime;

      if (isOvernight) {
        // First part of the event (today)
        allEvents.push({
          id: reservation.id,
          title: reservation.name,
          start: startDateTime,
          end: endDateTime,
          resourceId: reservation.courtId,
          status: reservation.status,
          reservationData: reservation,
        });

        // Second part of the event (next day)
        allEvents.push({
          id: reservation.id,
          title: reservation.name,
          start: new Date(
            moment(startDateTime).add(1, "day").toDate().setHours(0, 0, 0)
          ),
          end: new Date(
            moment(startDateTime)
              .add(1, "day")
              .toDate()
              .setHours(
                +reservation.endTime.split(":")[0],
                +reservation.endTime.split(":")[1],
                0
              )
          ),
          resourceId: reservation.courtId,
          status: reservation.status,
          reservationData: reservation,
        });
      } else {
        allEvents.push({
          id: reservation.id,
          title: reservation.name,
          start: startDateTime,
          end: endDateTime,
          resourceId: reservation.courtId,
          status: reservation.status,
          reservationData: reservation,
        });
      }
    });

    return allEvents;
  }, [ReservationData]);

  const resources = useMemo(() => {
    if (!courtsData?.data) return [];

    return courtsData.data.map((court: ICourtData) => ({
      resourceId: court.id,
      resourceTitle: court.name,
    }));
  }, [courtsData]);

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

  const defaultView = Views.DAY;

  const onSelectEvent = (event: CalendarEvent) => {
    setIsModalOpen(true);
    setModalTitle(event.title);
    setReservationPerDay([event.reservationData]);
  };

  const onSelectSlot = (slotInfo: {
    start: Date;
    end: Date;
    resourceId?: number | string;
  }) => {
    setIsReservationModal(true);
    setClickedReservationDate(moment(slotInfo.start).format("YYYY-MM-DD"));
    setClickedReservationTime(moment(slotInfo.start).format("HH:mm"));
    setSelectedCourtId(
      slotInfo.resourceId ? Number(slotInfo.resourceId) : null
    );
  };

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  if (isLoading || isFetching || CourtScheduleLoading || CourtScheduleFetching)
    return <PleaseWaitTxt />;

  return (
    <CustomKTCard>
      <div className="tw-ml-10 tw-mt-4 tw-flex tw-gap-1">
        <CustomKTIcon iconName="element-10" className="fs-1 text-primary" />
        <button onClick={() => navigate(`/apps/myreservations`)}>
          <CustomKTIcon iconName="element-6" className="fs-1" />
        </button>
        <button
          onClick={() => navigate(`/apps/myreservations/list?from=calendar`)}
        >
          <CustomKTIcon iconName="element-9" className="fs-1" />
        </button>
      </div>
      <CustomKTCardBody>
        <div className="tw-flex tw-flex-col tw-gap-4">
          <div className="tw-flex tw-items-center tw-justify-center tw-gap-8 tw-mb-4">
            <button
              onClick={() =>
                setCurrentDate(moment(currentDate).subtract(1, "day").toDate())
              }
              className="tw-p-2 tw-rounded-full tw-bg-gray-100 hover:tw-bg-gray-200"
            >
              <CustomKTIcon iconName="arrow-left" className="fs-2" />
            </button>
            <div className="tw-relative">
              <div
                className="tw-text-center tw-cursor-pointer hover:tw-text-primary"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <div className="tw-text-4xl tw-font-semibold">
                  {moment(currentDate).format("dddd")}
                </div>
                <div className="tw-text-lg">
                  {moment(currentDate).format("MMMM D, YYYY")}
                </div>
              </div>
              {showDatePicker && (
                <div className="tw-absolute tw-top-full tw-left-1/2 tw-transform tw--translate-x-1/2 tw-z-10 tw-mt-2">
                  <DatePicker
                    selected={currentDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setCurrentDate(date);
                        setShowDatePicker(false);
                      }
                    }}
                    inline
                    calendarClassName="tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-2"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() =>
                setCurrentDate(moment(currentDate).add(1, "day").toDate())
              }
              className="tw-p-2 tw-rounded-full tw-bg-gray-100 hover:tw-bg-gray-200"
            >
              <CustomKTIcon iconName="arrow-right" className="fs-2" />
            </button>
          </div>
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
            toolbar={false}
            resourceTitleAccessor="resourceTitle"
            date={currentDate}
            defaultView={defaultView}
            onSelectSlot={onSelectSlot}
            min={
              new Date(
                currentDate.setHours(
                  +minTime.split(":")[0],
                  +minTime.split(":")[1],
                  0
                )
              )
            }
            max={new Date(currentDate.setHours(23, 59, 59))}
            components={{
              event: (props) => {
                return (
                  <>
                    <div className="tw-flex tw-flex-col tw-gap-1 tw-p-2">
                      <div className="tw-text-md tw-font-medium ">
                        {props.event.title}
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <i className="fas fa-phone text-white"></i>
                        <span className="tw-text-sm">
                          {props.event.reservationData.phoneNumber}
                        </span>
                      </div>
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <i className="fas fa-user text-white"></i>
                        <span className="tw-text-sm">
                          {props.event.reservationData.employeeName || "N/A"}
                        </span>
                      </div>
                      <div
                        style={{
                          height: "24px",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                  </>
                );
              },
            }}
            timeslots={1}
            views={[Views.DAY]}
            onSelectEvent={onSelectEvent}
            eventPropGetter={getEventStyle}
            selectable
          />
          {isOvernight && (
            <Calendar
              localizer={localizer}
              events={events}
              resources={resources}
              date={moment(currentDate).add(1, "day").toDate()}
              defaultView={defaultView}
              onSelectSlot={onSelectSlot}
              resourceIdAccessor="resourceId"
              toolbar={false}
              resourceTitleAccessor="resourceTitle"
              min={
                new Date(
                  moment(currentDate).add(1, "day").toDate().setHours(0, 0, 0)
                )
              }
              max={
                new Date(
                  moment()
                    .add(1, "day")
                    .toDate()
                    .setHours(
                      +maxTime.split(":")[0],
                      +maxTime.split(":")[1] + 30,
                      0
                    )
                )
              }
              components={{
                event: (props) => {
                  return (
                    <>
                      <div className="tw-flex tw-flex-col tw-gap-1 tw-p-2">
                        <div className="tw-text-md tw-font-medium ">
                          {props.event.title}
                        </div>
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <i className="fas fa-phone text-white"></i>
                          <span className="tw-text-sm">
                            {props.event.reservationData.phoneNumber}
                          </span>
                        </div>
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <i className="fas fa-user text-white"></i>
                          <span className="tw-text-sm">
                            {props.event.reservationData.employeeName || "N/A"}
                          </span>
                        </div>
                        <div
                          style={{
                            height: "24px",
                            backgroundColor: "white",
                          }}
                        />
                      </div>
                    </>
                  );
                },
              }}
              timeslots={1}
              views={[Views.DAY]}
              onSelectEvent={onSelectEvent}
              eventPropGetter={getEventStyle}
              selectable
            />
          )}
        </div>
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
              courtId={selectedCourtId || 0}
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
