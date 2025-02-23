/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CustomButton,
  CustomKTCard,
  CustomKTCardBody,
  CustomKTIcon,
} from "@presentation/components";
import { stringifyRequestQuery } from "@presentation/helpers";
import { useQuery, useQueryClient } from "react-query";
import { Form, Formik } from "formik";
import { useState } from "react";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import Calendar, { getColorForCourt } from "./components/Calendar";
import validationSchemas from "@presentation/helpers/validationSchemas";
import * as Yup from "yup";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { IDDlOption } from "@domain/entities";
import { ReservationQueryInstance } from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import { useClubCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useClubCourtsDDL";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { ReservationStatusEnum } from "@domain/enums/reservationStatus/ReservationStatusEnum";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function MyReservations() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startTime, setStartTime] = useState(
    moment().startOf("week").toISOString()
  );
  const [endTime, setEndTime] = useState(moment().endOf("week").toISOString());
  const [courtId, setCourtId] = useState<any>("All");
  const [isIndoor, setIsIndoor] = useState(false);
  const navigate = useNavigate();

  const { auth } = useAuthStore();
  const clubId = auth?.clubID || 0;

  const {
    data: ReservationData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["MyReservations", searchQuery],
    queryFn: () => {
      return ReservationQueryInstance.getReservationList(
        `${ReservationUrlEnum.GetReservationList}clubId=${clubId}&${searchQuery}`
      );
    },
  });

  const initialValues = {
    fromDate: moment().startOf("week").toISOString(),
    toDate: moment().endOf("week").toISOString(),
    court: {
      label: "All",
      value: "All",
    } as IDDlOption | null,
  };

  const filterSchema = Yup.object().shape({
    // fromDate: validationSchemas.Date,
    // toDate: validationSchemas.Date.when("fromDate", {
    //   is: (fromDate: string) => fromDate !== null,
    //   then: (schema) =>
    //     schema.min(Yup.ref("fromDate"), "To Date can't be before From Date"),
    //   otherwise: (schema) => schema,
    // }),
    court: validationSchemas.object,
  });

  // return all non cancelled reservations.
  const filteredData = ReservationData?.data.filter((data) => {
    return (
      data.status === ReservationStatusEnum["Approved"] ||
      data.status === ReservationStatusEnum["New"]
    );
  });

  const { ClubCourtsOption, isClubCourtLoading } = useClubCourtsDDL(clubId);

  const handleSubmit = (values: typeof initialValues) => {
    let query = "";
    if (values.court?.value !== "All") {
      query = stringifyRequestQuery({
        filter: {
          courtId: values.court?.value,
        },
      });
    }
    const getCourt = ClubCourtsOption.find(
      (court) => court.value === values.court?.value
    );
    setSearchQuery(query);
    setStartTime(values.fromDate);
    setEndTime(values.toDate);
    setCourtId(values.court?.value);
    setIsIndoor(getCourt?.isIndoor);
  };
  const queryClient = useQueryClient();

  const generateCourtColors = ({ label, value }: IDDlOption) => {
    const color = getColorForCourt(+value);
    return (
      <>
        <div
          key={color}
          style={{
            backgroundColor: color,
            borderRadius: "50%",
            width: "20px",
            height: "20px",
          }}
        />
        {label}
      </>
    );
  };

  return (
    <CustomKTCard>
      <div className="tw-ml-10 tw-mt-4">
        <CustomKTIcon iconName="element-6" className="fs-1 text-primary" />
        <button
          onClick={() => navigate(`/apps/myreservations/list?from=calendar`)}
        >
          <CustomKTIcon iconName="element-9" className="fs-1" />
        </button>
      </div>
      <CustomKTCardBody>
        <Formik
          initialValues={initialValues}
          validationSchema={filterSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ resetForm, values }) => (
            <Form
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <div className="row row-cols-2 align-items-center flex-wrap  border border-2  p-2 rounded mb-5">
                <CustomTimePicker
                  label="From-Date"
                  name="fromDate"
                  placeholder="Select From Date"
                />
                <CustomTimePicker
                  label="To-Date"
                  name="toDate"
                  placeholder="SELECT_TO_DATE"
                  minDate={values.fromDate}
                />
                <CustomSelectField
                  name="court"
                  options={[
                    { label: "All", value: "All" },
                    ...ClubCourtsOption,
                  ]}
                  isloading={isClubCourtLoading}
                  label="DDL-COURT-NAME"
                  placeholder="DDL-CHOOSE-COURT"
                />
                <div className="d-flex mb-2">
                  {/* <CustomButton
                    type="reset"
                    text="RESET_FILTER"
                    onClick={() => {
                      resetForm();
                      setSearchQuery("");
                      setApplyFilter(false);
                      queryClient.removeQueries("MyReservations");
                      }}
                      className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                      data-kt-user-table-filter="reset"
                      disabled={isLoading}
                      /> */}
                  <CustomButton
                    type="submit"
                    text={"APPLY_FILTER"}
                    className="btn btn-primary"
                    data-kt-menu-dismiss="true"
                    data-kt-user-table-filter="filter"
                    disabled={isLoading}
                  />
                </div>
                {courtId === "All" && (
                  <div className="d-flex tw-items-center mb-2 tw-gap-2">
                    {ClubCourtsOption.map((court) =>
                      generateCourtColors(court)
                    )}
                    <div
                      style={{
                        backgroundColor: "gray",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    Pending
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
        {ReservationData?.data && !isLoading && !isFetching && (
          <Calendar
            ReservationData={filteredData ?? []}
            startTime={startTime}
            endTime={endTime}
            courtId={courtId}
            clubId={clubId}
            isIndoor={isIndoor}
          />
        )}

        {(isLoading || isFetching) && <PleaseWaitTxt />}
      </CustomKTCardBody>
    </CustomKTCard>
  );
}
