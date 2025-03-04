/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import {
  CustomButton,
  CustomInputField,
  CustomListLoading,
  CustomModal,
  CustomToast,
} from "@presentation/components";
import { ListViewProvider, useListView } from "@presentation/context";
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
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { GenderOptionsDDL } from "@presentation/helpers/DDL/GenderOptions";
import { addReservationUserCommandInstance } from "@app/useCases/addReservationUser/Command/addReservationUserCommand";
import { AddReservationUserUrlEnum } from "@domain/enums/URL/AddReservationUser/AddReservationUser";
import { GetPlaySonicByIdInstance } from "@app/useCases/getPlaySonicId";
import { GetPlaySonicByIdUrlEnum } from "@domain/enums/URL/GetPlaySonicById/GetPlaySonicById";
import { showPalySonicIdAlert } from "@presentation/components/alerts/showPalySonicIdAlert";
import { PhoneInputField } from "@presentation/components/forms/PhoneInputField";

function formatPhoneNumber(phoneNumber: string) {
  // Remove the leading '+' sign
  let numberWithoutPlus = phoneNumber.slice(1);

  // Remove the 0 after the country code (if it exists)
  const countryCodeLength = 3; // Assuming country code is always 3 digits
  if (
    numberWithoutPlus.length > countryCodeLength &&
    numberWithoutPlus[countryCodeLength] === "0"
  ) {
    numberWithoutPlus =
      numberWithoutPlus.slice(0, countryCodeLength) +
      numberWithoutPlus.slice(countryCodeLength + 1);
  }

  // Add '00' prefix
  const formattedNumber = "00" + numberWithoutPlus;

  return formattedNumber;
}

const CreateNewUserForm = ({ setFieldValue, values, clubId }: any) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(false);
  const [createUserModal, setCreateUserModal] = useState(false);
  const initialValues = Object.assign({
    firstName: null,
    lastName: null,
    phone: null,
    displayName: null,
    dob: null,
    userLevel: null,
    gender: null,
    createBy: clubId,
  });

  const _ReservationSchema = Object.assign({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    displayName: Yup.string().required("Required"),
    userPhone: Yup.string()
      .required("Required")
      .min(11, "Invalid Phone")
      .max(14, "Invalid Phone"),
  });

  const ReservationSchema = Yup.object().shape(_ReservationSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("FirstName", values.firstName);
    formData.append("LastName", values.lastName);
    formData.append("Phone", formatPhoneNumber(values.userPhone));
    formData.append("DisplayName", values.displayName);
    if (values.dob) {
      formData.append("DOB", values.dob);
    }
    if (values.userLevel) {
      formData.append("UserLevel", values.userLevel);
    }
    formData.append("Gender", values.gender.value);
    formData.append("CreateBy", values.createBy);

    try {
      const data =
        await addReservationUserCommandInstance.addReservationUserCommand(
          AddReservationUserUrlEnum.CreateReservationUser,
          formData
        );
      if (data) {
        CustomToast("Reservation is created successfully", "success", {
          autoClose: 3000,
        });
        showPalySonicIdAlert(
          `Your Playsonic ID is ${data.playSonicId}`,
          "Success Create"
        );
        setFieldValue("playSonicId", data.playSonicId);
        setFieldValue("ownerID", {
          value: data.userId,
          label: data.userName,
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
      setCreateUserModal(false);
    }
  };
  const HandleFindUser = async () => {
    try {
      const findUser = await GetPlaySonicByIdInstance.getPlaySonicById(
        GetPlaySonicByIdUrlEnum.GetGetPlaySonicByIdById,
        values.playSonicId
      );

      if (findUser) {
        setUser(true);
        setFieldValue("ownerID", {
          value: findUser.userId,
          label: findUser.userName,
        });
      }
    } catch {
      CustomToast("User Not found", "error");
      setUser(false);
    }
  };
  return (
    <>
      {user && (
        <div className="row row-cols-1 row-cols-md-2 border-info-subtle border-black">
          <CustomSelectField
            name="ownerID"
            label="DDL-Owner"
            placeholder="DDL-Owner"
            options={[]}
          />
        </div>
      )}
      <div className="d-flex tw-gap-5">
        <CustomButton
          type="button"
          text="Find"
          onClick={() => HandleFindUser()}
          className="btn btn-primary"
        />
        <CustomButton
          type="button"
          text="Create New"
          onClick={() => setCreateUserModal(true)}
          className="btn btn-light-primary"
        />
      </div>

      {createUserModal && (
        <CustomModal
          modalTitle="Create-New-User"
          modalSize={"xl"}
          onClick={() => setCreateUserModal(false)}
        >
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={ReservationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values, setSubmitting);
            }}
          >
            <ReservationForm setCreateUserModal={setCreateUserModal} />
          </Formik>
        </CustomModal>
      )}
    </>
  );
};
const ReservationForm = ({
  setCreateUserModal,
}: {
  setCreateUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isSubmitting, isValid }: FormikContextType<FormikValues> =
    useFormikContext();

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
            <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
              <CustomInputField
                name="firstName"
                placeholder="Firts-Name"
                label="Firts-Name"
                as="input"
              />
              <CustomInputField
                name="lastName"
                placeholder="Last-Name"
                label="Last-Name"
                as="input"
              />
            </div>
            <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
              <CustomInputField
                name="displayName"
                placeholder="User-DISPLAY-NAME"
                label="User-DISPLAY-NAME"
                as="input"
              />
              <PhoneInputField
                name="userPhone"
                placeholder="USER-PHONE"
                label="USER-PHONE"
              />
            </div>
            <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
              <CustomSelectField
                name="gender"
                options={GenderOptionsDDL}
                label="DDL-GENDER"
                placeholder="DDL-GENDER"
              />
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
            <CustomTimePicker
              label="Bith-Date"
              name="dob"
              placeholder="Bith-Date"
              labelRequired={false}
            />
            <CustomInputField
              name="userLevel"
              placeholder="Level"
              label="Level"
              as="input"
              type="number"
              labelRequired={false}
            />
          </div>
        </div>
        <div className="text-center pt-15">
          <CustomButton
            type="reset"
            text="CANCEL"
            onClick={() => setCreateUserModal(false)}
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

export const CreateNewUser = ({ setFieldValue, values, clubId }: any) => {
  return (
    <ListViewProvider>
      <CreateNewUserForm
        setFieldValue={setFieldValue}
        values={values}
        clubId={clubId}
      />
    </ListViewProvider>
  );
};
