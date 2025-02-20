import { useMemo, useRef } from "react";
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
  FormikContextType,
  FormikProps,
  FormikValues,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { QUERIES } from "@presentation/helpers";
import { useQueryClient } from "react-query";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import validationSchemas from "@presentation/helpers/validationSchemas";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { IReservationData } from "@domain/entities/Reservation/Reservation";
import { ReservationCommandInstance } from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import { ResarvationOptions } from "@presentation/helpers/DDL/ResarvationOptions";
import { ReservationStatusOptionsOptions } from "@presentation/helpers/DDL/ReservationStatusOptions";
import { useCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useCourtsDDL";
import { useSlotTypesDDL } from "@presentation/hooks/queries/DDL/SlotTypes/useSlotTypesDDL";

interface IProps {
  ReservationData: IReservationData;
  isLoading: boolean;
}

export const UpdateReservationForm = ({
  ReservationData,
  isLoading,
}: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  const initialValues = useMemo(() => {
    return {
      id: ReservationData.id,
      courtId: ReservationData.courtId,
      slotTypeId: ReservationData.slotTypeId,
      startTime: ReservationData.startTime,
      endTime: ReservationData.endTime,
      status: ReservationData.status,
      reservationTypeId: ReservationData.reservationTypeId,
      levelMin: ReservationData.levelMin,
      levelMax: ReservationData.levelMax,
      isPublic: ReservationData.isPublic,
      reservationDate: ReservationData.reservationDate,
      slotsRemaining: ReservationData.slotsRemaining,
      sportId: 1,
      ownerID: "345ebbb9-924b-4359-845d-60860c5ed515",
    };
  }, [ReservationData]);

  const _ReservationSchema = Object.assign({
    courtId: validationSchemas.object,
    slotTypeId: validationSchemas.object,
    // startTime: Yup.string().required("Required"),
    // endTime: Yup.string().required("Required"),
    // reservationDate: Yup.string().required("Required"),
    // levelMin: Yup.number().required("Required"),
    // levelMax: Yup.number().required("Required"),
    // reservationTypeId: validationSchemas.object,
    // status: validationSchemas.object,
  });

  const ReservationSchema = Yup.object().shape(_ReservationSchema);
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();

    formData.append("Id", String(initialValues.id));
    formData.append("CourtId", values.courtId.value);
    formData.append("SlotTypeId", values.slotTypeId.value);
    formData.append("StartTime", values.startTime);
    formData.append("EndTime", values.endTime);
    formData.append("Status", values.status);
    formData.append("ReservationTypeId", values.reservationTypeId);
    formData.append("LevelMin", values.levelMin);
    formData.append("LevelMax", values.levelMax);
    formData.append("IsPublic", values.isPublic);
    formData.append("ReservationDate", values.reservationDate);
    formData.append("SportId", values.sportId);
    formData.append("OwnerID", values.ownerID);
    try {
      const data = await ReservationCommandInstance.updateReservation(
        ReservationUrlEnum.UpdateReservation,
        formData
      );
      if (data) {
        CustomToast("Reservation updated successfully", "success", {
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
        console.error("Error submitting form:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <PleaseWaitTxt />
      ) : (
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          initialTouched={Languages.reduce<{ [key: string]: boolean }>(
            (acc, lang) => {
              if (lang.id !== 2) acc[`name${lang.id}`] = true;
              return acc;
            },
            {}
          )}
          validationSchema={ReservationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <ReservationUpdateForm />
        </Formik>
      )}
    </>
  );
};

const ReservationUpdateForm = () => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
  }: FormikContextType<FormikValues> = useFormikContext();
  const { CourtsOption, isCourtLoading } = useCourtsDDL();
  const { SlotTypesOption, isSlotTypesLoading } = useSlotTypesDDL();
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
                options={CourtsOption}
                isloading={isCourtLoading}
                label="DDL-Court-NAME"
                placeholder="DDL-Court-NAME"
                touched={touched}
                errors={errors}
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
            </div>

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
              />
            </div>
            <div className="row  row-cols-1 row-cols-md-2 border-info-subtle border-black">
              <CustomTimePicker
                name={"reservationDate"}
                label="Reservation-Date"
                placeholder="Reservation-Date"
                enableTime={true}
                Mode="single"
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

export default UpdateReservationForm;
