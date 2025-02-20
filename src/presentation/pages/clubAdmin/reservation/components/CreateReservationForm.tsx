import { useRef } from "react";
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
import { QUERIES } from "@presentation/helpers";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import validationSchemas from "@presentation/helpers/validationSchemas";
import { ReservationCommandInstance } from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import { useSlotTypesDDL } from "@presentation/hooks/queries/DDL/SlotTypes/useSlotTypesDDL";
import { useClubCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useClubCourtsDDL";
import { useAuthStore } from "@infrastructure/storage/AuthStore";

export const CreateReservationForm = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    courtId: null,
    slotTypeId: null,
    startTime: null,
    endTime: null,
    status: { value: 1, label: "New" },
    reservationTypeId: { value: 4, label: "Book Court" },
    levelMin: null,
    levelMax: null,
    isPublic: false,
    reservationDate: null,
    slotsRemaining: 1,
    sportId: 1,
    ownerID: "345ebbb9-924b-4359-845d-60860c5ed515",
  });

  const _ReservationSchema = Object.assign({
    courtId: validationSchemas.object,
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
    formData.append("CourtId", values.courtId.value);
    formData.append("SlotTypeId", values.slotTypeId.value);
    formData.append("StartTime", values.startTime);
    formData.append("EndTime", values.endTime);
    formData.append("Status", values.status.value);
    formData.append("ReservationTypeId", values.reservationTypeId.value);
    formData.append("LevelMin", values.levelMin);
    formData.append("LevelMax", values.levelMax);
    formData.append("IsPublic", values.isPublic);
    formData.append("ReservationDate", values.reservationDate);
    formData.append("SportId", values.sportId);
    formData.append("OwnerID", values.ownerID);

    try {
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
          queryKey: [QUERIES.ReservationList],
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
      <ReservationForm />
    </Formik>
  );
};

const ReservationForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
  }: FormikContextType<FormikValues> = useFormikContext();
  const { auth } = useAuthStore();
  const clubId = auth?.clubID || 0;

  const { setItemIdForUpdate } = useListView();
  const { SlotTypesOption, isSlotTypesLoading } = useSlotTypesDDL();
  const { ClubCourtsOption, isClubCourtLoading } = useClubCourtsDDL(clubId);
  return (
    <>
      <Form
        className="form container-fluid w-100"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="row row-cols-md-1 row-cols-sm-1 row-cols-1">
          <div className="row">
            <div className="row row-cols-2 1 row-cols-md-2">
              <CustomSelectField
                name="courtId"
                options={ClubCourtsOption}
                isloading={isClubCourtLoading}
                label="DDL-COURT-MANE"
                placeholder="DDL-COURT-MANE"
                touched={touched}
                errors={errors}
                disabled={clubId ? false : true}
              />
            </div>
            {/* 
            <div className="row  row-cols-1 row-cols-md-2 border-info-subtle border-black">
              <CustomSelectField
                name="status"
                options={ReservationStatusOptionsOptions}
                label="DDL-Status"
                placeholder="DDL-Status"
                touched={touched}
                errors={errors}
                disabled={true}
              />
              <CustomSelectField
                name="reservationTypeId"
                options={ResarvationOptions}
                label="DDL-Reservaion-Type"
                placeholder="DDL-Reservaion-Type"
                touched={touched}
                errors={errors}
                disabled={true}
              />
            </div> */}
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
              <CustomTimePicker
                name={"reservationDate"}
                label="Reservation-Date"
                placeholder="Reservation-Date"
                enableTime={false}
                Mode="single"
              />
              <CustomSelectField
                name="slotTypeId"
                options={SlotTypesOption}
                isloading={isSlotTypesLoading}
                label="DDL-Slot-Type-NAME"
                placeholder="DDL-Slot-Type-NAME"
                touched={touched}
                errors={errors}
              />
              <CustomCheckbox
                labelTxt="isPublic"
                name={"indoor"}
                touched={touched}
                errors={errors}
              />
            </div>
          </div>
        </div>
        <div className="text-center pt-15">
          <CustomButton
            type="reset"
            text="CANCEL"
            onClick={() => setItemIdForUpdate(undefined)}
            className="btn btn-light me-3"
            disabled={isSubmitting}
          />
          <CustomButton
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !isValid}
            text={isSubmitting ? "PLEASE_WAIT" : "SUBMIT"}
          />
        </div>
        {isSubmitting && <CustomListLoading />}
      </Form>
    </>
  );
};
