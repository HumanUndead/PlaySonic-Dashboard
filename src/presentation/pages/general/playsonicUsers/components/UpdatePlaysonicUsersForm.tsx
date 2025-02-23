import { useMemo, useRef } from "react";
import {
  CustomButton,
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
import { IPlaysonicUsersData } from "@domain/entities/general/PlaysonicUsers/PlaysonicUsers";
import { PlaysonicUsersCommandInstance } from "@app/useCases/general/playsonicUsers/Command/PlaysonicUsersCommand";
import { authenticationURLEnum } from "@domain/enums";

interface IProps {
  PlaysonicUserData: IPlaysonicUsersData;
  isLoading: boolean;
}

export const UpdatePlaysonicUsersForm = ({
  PlaysonicUserData,
  isLoading,
}: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  const initialValues = useMemo(() => {
    return {
      id: PlaysonicUserData.id,
      level: PlaysonicUserData.level,
      password: "",
    };
  }, [PlaysonicUserData]);

  const _PlaysonicUserSchema = Object.assign({
    level: Yup.number().required().nullable(),
    password: Yup.string()
      .nullable()
      .min(6, "Password must be at least 6 characters long")
      .matches(/\d/, "Password must contain at least one digit")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/,
        "Password must contain at least one special character"
      ),
  });

  const PlaysonicUserSchema = Yup.object().shape(_PlaysonicUserSchema);
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();

    formData.append("ID", String(values.id));
    formData.append("UserLevel", values.level ?? 1);
    formData.append("Password", values.password);

    try {
      const data = await PlaysonicUsersCommandInstance.updatePlaysonicUser(
        authenticationURLEnum.UpdateUserByAdmin,
        formData
      );
      if (data) {
        CustomToast("Reservation updated successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.PlaysonicUsersList],
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
          validationSchema={PlaysonicUserSchema}
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
  console.log("erre", errors);
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
            <div className="row  row-cols-1 row-cols-md-2 border-info-subtle border-black">
              <CustomInputField
                name="level"
                placeholder="Level"
                label="Level"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
                labelRequired={false}
              />
              <CustomInputField
                name="password"
                placeholder="Password"
                label="Password"
                as="input"
                touched={touched}
                errors={errors}
                type="password"
                isSubmitting={isSubmitting}
                toggleShowPassword
                labelRequired={false}
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

export default UpdatePlaysonicUsersForm;
