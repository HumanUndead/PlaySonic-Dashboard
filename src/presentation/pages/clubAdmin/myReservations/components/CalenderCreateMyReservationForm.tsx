import { FC, useEffect, useRef, useState } from "react";
import {
  CustomButton,
  CustomCheckbox,
  CustomInputField,
  CustomListLoading,
  CustomToast,
} from "@presentation/components";
import { useListView } from "@presentation/context";
import {
  Form,
  Formik,
  FormikProps,
  useFormikContext,
  FormikValues,
  FormikContextType,
} from "formik";
import * as Yup from "yup";
import { useQueryClient } from "react-query";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import validationSchemas from "@presentation/helpers/validationSchemas";
import { ReservationCommandInstance } from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import { useSlotTypesDDL } from "@presentation/hooks/queries/DDL/SlotTypes/useSlotTypesDDL";
import { CreateNewUser } from "./CreateNewUser";
import { useGetSlotTypeByCourtIdDDL } from "@presentation/hooks/queries/DDL/SlotTypes/useGetSlotTypeByCourtIdDDL ";
import { GetPlaySonicByIdInstance } from "@app/useCases/getPlaySonicId";
import { GetPlaySonicByIdUrlEnum } from "@domain/enums/URL/GetPlaySonicById/GetPlaySonicById";
import { useClubCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useClubCourtsDDL";

interface ICourtId {
  courtId: number | "All";
  startTime: string;
  reservationDate: string;
  clubId: number;
  isIndoor: boolean;
}
export const CalenderCreateMyReservationForm: FC<ICourtId> = ({
  courtId,
  reservationDate,
  startTime,
  clubId,
  isIndoor,
}) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = {
    courtId: courtId === "All" ? null : courtId,
    playSonicId: 0,
    slotTypeId: null,
    startTime: startTime,
    endTime: null,
    status: { value: 1, label: "New" },
    reservationTypeId: { value: 4, label: "Book Court" },
    levelMin: null,
    levelMax: null,
    isPublic: !isIndoor,
    reservationDate: reservationDate,
    slotsRemaining: 1,
    sportId: 1,
    //  ownerID: "345ebbb9-924b-4359-845d-60860c5ed515",
    ownerID: null,
  };

  const _ReservationSchema = Object.assign({
    courtId: courtId === "All" ? validationSchemas.object : null,
    slotTypeId: validationSchemas.object,
    startTime: Yup.string().required("Required"),
    endTime: Yup.string().required("Required"),
    reservationDate: Yup.string().required("Required"),
    levelMin: Yup.number().required("Required"),
    levelMax: Yup.number().required("Required"),
    reservationTypeId: validationSchemas.object,
    status: validationSchemas.object,
  });

  const ReservationSchema = Yup.object().shape(_ReservationSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append(
      "CourtId",
      courtId === "All" ? values.courtId.value : courtId
    );
    formData.append("SlotTypeId", values.slotTypeId.value);
    formData.append("StartTime", values.startTime);
    formData.append("EndTime", values.endTime);
    formData.append("ReservationTypeId", values.reservationTypeId.value);
    formData.append("LevelMin", values.levelMin);
    formData.append("LevelMax", values.levelMax);
    formData.append("IsPublic", values.isPublic);
    formData.append("ReservationDate", values.reservationDate);
    formData.append("SportId", values.sportId);
    formData.append("Status", "2");
    formData.append("Source", "Web");

    try {
      if (Object.keys(values.ownerID ?? {}).length === 0) {
        const findUser = await GetPlaySonicByIdInstance.getPlaySonicById(
          GetPlaySonicByIdUrlEnum.GetGetPlaySonicByIdById,
          values.playSonicId
        );

        if (findUser) {
          formData.append("OwnerID", findUser.userId);
        }
      } else {
        formData.append("OwnerID", values.ownerID.value);
      }
      const data = await ReservationCommandInstance.createReservation(
        ReservationUrlEnum.CreateReservation,
        formData
      );
      if (data) {
        CustomToast("Reservation is created successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: ["MyReservations"],
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        CustomToast(error.message, "error", { autoClose: 6000 });
        console.error("Error Create form:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={ReservationSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <ReservationForm
        courtId={courtId}
        formikRef={formikRef}
        clubId={clubId}
      />
    </Formik>
  );
};
interface Iprop {
  courtId: number | "All";
  formikRef: React.MutableRefObject<FormikProps<FormikValues> | null>;
  clubId: number;
}
const ReservationForm = ({ courtId, formikRef, clubId }: Iprop) => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    setFieldValue,
  }: FormikContextType<FormikValues> = useFormikContext();
  const { ClubCourtsOption, isClubCourtLoading } = useClubCourtsDDL(clubId);
  const [getCourtId, setGetCourtId] = useState(courtId === "All" ? 0 : courtId);
  const { SlotTypesOption } = useSlotTypesDDL();
  const { CourtSlotTypesOption, refresh } = useGetSlotTypeByCourtIdDDL(
    courtId === "All" ? getCourtId : courtId,
    !!getCourtId
  );

  const filteredSlotTypes = SlotTypesOption.filter((slot) =>
    CourtSlotTypesOption.includes(slot.value)
  );

  useEffect(() => {
    if (values.courtId) {
      setGetCourtId(values.courtId.value);
      setFieldValue("slotTypeId", null);
      refresh();
    }
  }, [values.courtId]);

  useEffect(() => {
    if (values.slotTypeId && values.startTime) {
      const slotDuration = parseInt(values.slotTypeId.label);
      const startTime = new Date(`1970-01-01T${values.startTime}:00`);
      startTime.setMinutes(startTime.getMinutes() + slotDuration);
      const updatedEndTime = startTime.toTimeString().substring(0, 5);

      setFieldValue("endTime", updatedEndTime);
    }
  }, [values.slotTypeId, values.startTime, setFieldValue]);

  return (
    <>
      <Form
        className="form container-fluid w-100  d-inline"
        placeholder={undefined}
        style={{ paddingBottom: "100px" }}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="row row-cols-md-1 row-cols-sm-1 row-cols-1">
          <div className="row">
            <div className="row row-cols-1 row-cols-md-2">
              {courtId === "All" && (
                <CustomSelectField
                  name="courtId"
                  options={ClubCourtsOption}
                  isloading={isClubCourtLoading}
                  label="DDL-COURT-NAME"
                  placeholder="DDL-CHOOSE-COURT"
                />
              )}
              <CustomSelectField
                name="slotTypeId"
                options={filteredSlotTypes}
                // isloading={isSlotTypesLoading}
                label="DDL-Slot-Type-NAME"
                placeholder="DDL-Slot-Type-NAME"
                touched={touched}
                errors={errors}
              />
              <CustomTimePicker
                name={"reservationDate"}
                label="Reservation-Date"
                placeholder="Reservation-Date"
                enableTime={false}
                Mode="single"
              />
            </div>
            <div className="row  row-cols-1 row-cols-md-2 border-info-subtle border-black">
              <CustomTimePicker
                name={"startTime"}
                label="Start-Time"
                placeholder="Start-Time"
                enableTime={true}
                Mode="time"
              />
              <CustomTimePicker
                name={"endTime"}
                label="End-Time"
                placeholder="End-Time"
                enableTime={true}
                Mode="time"
                minTime={values.startTime}
              />
            </div>

            <div className="row  row-cols-1 row-cols-md-2 border-info-subtle border-black">
              <CustomInputField
                name="levelMin"
                placeholder="Reservation-Level-Min"
                label="Reservation-Level-Min"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
              />
              <CustomInputField
                name="levelMax"
                placeholder="Reservation-Level-Max"
                label="Reservation-Level-Max"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
              />{" "}
              <div className="row  row-cols-1 row-cols-md-2 border-info-subtle border-black">
                <CustomCheckbox
                  labelTxt="isPublic"
                  name={"isPublic"}
                  touched={touched}
                  errors={errors}
                />
              </div>
            </div>
            <hr />
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black position-relative">
          <CustomInputField
            name="playSonicId"
            placeholder="PlaySonicId"
            label="PlaySonicId"
            as="input"
            touched={touched}
            errors={errors}
            type="number"
            isSubmitting={isSubmitting}
          />
        </div>

        {isSubmitting && <CustomListLoading />}
      </Form>
      <CreateNewUser
        values={values}
        setFieldValue={setFieldValue}
        clubId={clubId}
      />
      <div className="text-center pt-15">
        <CustomButton
          type="submit"
          className="btn btn-primary"
          onClick={() => {
            formikRef.current?.submitForm();
          }}
          disabled={isSubmitting || !isValid}
          text={isSubmitting ? "PLEASE_WAIT" : "SUBMIT"}
        />
      </div>
    </>
  );
};
