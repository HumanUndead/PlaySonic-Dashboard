import { useEffect, useRef, useState } from "react";
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
import { combineBits, QUERIES } from "@presentation/helpers";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { RoleTypesOptions } from "@presentation/helpers/DDL/RoleTypesOptions";
import {
  ClubAdminEnumOptions,
  PermissionsEnumOptions as DefaultPermissionsEnumOptions,
  SuberAdminEnumOptions,
} from "@presentation/helpers/DDL/PermissionsEnumOptions";
import { RolesCommandInstance } from "@app/useCases/general/roles";
import { RoleUrlEnum } from "@domain/enums/URL/General/GeneralEnum/RolesEnum";
import { RoleTypesEnum } from "@domain/enums/roleTypesEnum/RoleTypesEnum";

export const CreateRoles = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = {
    name: "",
    type: null,
    permissions: [],
  };

  const _RolesSchema = {
    name: Yup.string().required("Field is Required"),
  };

  const RolesSchema = Yup.object().shape(_RolesSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const numberPermissionsArray = values.permissions?.map(Number);
    const permissionsEnum = combineBits(numberPermissionsArray);

    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("Type", values.type.value);
    formData.append("Permissions", String(permissionsEnum));

    try {
      const data = await RolesCommandInstance.createRoles(
        RoleUrlEnum.CreateRole,
        formData
      );
      if (data) {
        CustomToast("Created successfully", "success", { autoClose: 3000 });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.RolesList],
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
      validationSchema={RolesSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <RolesForm />
    </Formik>
  );
};

const RolesForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    setFieldValue,
  }: FormikContextType<FormikValues> = useFormikContext();
  const { setItemIdForUpdate } = useListView();

  const [permissionsEnumOptions, setPermissionsEnumOptions] = useState(
    DefaultPermissionsEnumOptions
  );

  useEffect(() => {
    setPermissionsEnumOptions(
      values.type?.value === RoleTypesEnum["Super Admin"]
        ? SuberAdminEnumOptions
        : ClubAdminEnumOptions
    );
    setFieldValue("permissions", []);
  }, [values.type?.value, setFieldValue]);

  // const handleSelectPermissions = () => {
  //   if (values?.permissions?.length === permissionsEnumOptions?.length) {
  //     setFieldValue("permissions", []);
  //   } else {
  //     const allPermissions = permissionsEnumOptions.map((e) => String(e.value));
  //     setFieldValue("permissions", allPermissions);
  //   }
  // };

  return (
    <>
      <Form
        className="form container-fluid w-100"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="row">
          <div className="row row-cols-2">
            <CustomInputField
              name="name"
              placeholder="ROLE-NAME"
              label="ROLE-NAME"
              as="input"
              isSubmitting={isSubmitting}
            />
            <CustomSelectField
              name="type"
              options={RoleTypesOptions}
              label="DDL-ROLE-TYPE"
              placeholder="DDL-ROLE-TYPE"
            />
          </div>

          {values.type?.value && (
            <div className="bg-text-secondary-emphasis p-5 rounded-2 shadow-sm my-4">
              <h2 className="text-info">Permissions</h2>
              {/* <div className="d-flex justify-content-between align-items-center">
                <CustomButton
                  type="button"
                  className="btn btn-flush btn-white text-decoration-underline mx-5"
                  text={
                    values?.permissions?.length ===
                    permissionsEnumOptions?.length
                      ? "CLEAR-ALL"
                      : "SELECT-ALL-Permissions"
                  }
                  onClick={handleSelectPermissions}
                />
              </div> */}
              <div className="row">
                {permissionsEnumOptions?.map((permission) => (
                  <div className="col-md-3" key={permission.value}>
                    <CustomCheckbox
                      labelTxt={permission.label}
                      value={permission.value.toString()}
                      name={`permissions`}
                      isTranslated={false}
                      touched={touched}
                      labelRequired={false}
                      errors={errors}
                      txtClassName="text-black"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
