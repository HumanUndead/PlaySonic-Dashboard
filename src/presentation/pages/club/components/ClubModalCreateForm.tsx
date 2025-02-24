import { Fragment, useRef, useState } from "react";
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
  FormikProps,
  useFormikContext,
  FormikValues,
  FormikContextType,
} from "formik";
import * as Yup from "yup";
import { useQueryClient } from "react-query";
import { combineBits, QUERIES } from "@presentation/helpers";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import clsx from "clsx";
import CustomEditor from "@presentation/components/forms/CustomEditor";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { ClubCommandInstance } from "@app/useCases/clubs";
import { ClubUrlEnum } from "@domain/enums/URL/Clubs/ClubUrls/Club";
import {
  FeaturesOptionsDDL,
  IfeatureOptionsDDL,
} from "@presentation/helpers/DDL/FeaturesOptions";
import { useCitiesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useCitiesDDL";
import { useAreasDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useAreasDDL";
import { useCountriesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useCountriesDDL";
import validationSchemas from "@presentation/helpers/validationSchemas";
import { CustomUploadFile } from "@presentation/components/forms/CustomUploadFile";

export const ClubModalCreateForm = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  const initialValues = Object.assign(
    {
      city: 0,
      country: 0,
      area: 0,
      phone: "",
      website: "",
      features: 0,
      payload: "New Club",
      lat: 0,
      lng: 0,
      image: null,
      images: [],
    },
    ...Languages.map((lang) => ({
      [`name${lang?.id}`]: "",
      [`description${lang?.id}`]: "",
    }))
  );

  const _ClubSchema = Object.assign(
    {
      country: validationSchemas.object,
      city: validationSchemas.object,
      area: validationSchemas.object,
    },
    ...Languages.map((lang) => {
      return lang.id === 2
        ? {
            [`name${lang?.id}`]: Yup.string().required(
              "This field is required"
            ),
          }
        : {
            [`name${lang?.id}`]: Yup.string().when([`description${lang.id}`], {
              is: (descriptionVal: string) =>
                descriptionVal && descriptionVal.trim() !== "",
              then: (schema) => schema.required("This field is required"),
              otherwise: (schema) => schema,
            }),
          };
    })
  );

  const ClubSchema = Yup.object().shape(_ClubSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const features = combineBits(
      values.features.map((feature: IfeatureOptionsDDL) => feature.value)
    );
    const formData = new FormData();
    formData.append("CountryId", values.country.value);
    formData.append("CityId", values.city.value);
    formData.append("AreaId", values.area.value);
    formData.append("Phone", values.phone);
    formData.append("Website", values.website);
    formData.append("Features", String(features));
    formData.append("Payload", values.payload);
    formData.append("lat", values.lat);
    formData.append("lng", values.lng);
    formData.append("Img", values.image);

    // Wait until update images api done >>>
    values?.images?.map((img: File) => {
      formData.append("Images", img);
    });

    let index = 0;
    Languages.forEach((lang) => {
      if (values[`name${lang?.id}`]) {
        formData.append(`ClubInfos[${index}].languageId`, lang.id.toString());
        formData.append(`ClubInfos[${index}].name`, values[`name${lang?.id}`]);
        formData.append(
          `ClubInfos[${index}].description`,
          values[`description${lang?.id}`]
        );

        index++;
      }
    });

    try {
      const data = await ClubCommandInstance.createClub(
        ClubUrlEnum.CreateClub,
        formData
      );
      if (data) {
        CustomToast("Club is created successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.ClubList],
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
      validationSchema={ClubSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <ClubForm />
    </Formik>
  );
};

const ClubForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
  }: FormikContextType<FormikValues> = useFormikContext();

  const { setItemIdForUpdate } = useListView();

  const { Languages } = useLanguageStore();
  const [languageInput, setLanguageInput] = useState(2);
  const { CountryOption, isCountryLoading } = useCountriesDDL();
  const { CityOption, isCityLoading } = useCitiesDDL();
  const { AreaOption, isAreaLoading } = useAreasDDL();

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
            <div className="row row-cols-3">
              <CustomSelectField
                name="country"
                options={CountryOption}
                labelRequired={false}
                isloading={isCountryLoading}
                label="DDL-COUNTRY_LABEL"
                placeholder="DDL-COUNTRY_LABEL"
                touched={touched}
                errors={errors}
              />
              <CustomSelectField
                name="city"
                labelRequired={false}
                options={CityOption}
                isloading={isCityLoading}
                label="DDL-CITY_LABEL"
                placeholder="DDL-CITY_LABEL"
                touched={touched}
                errors={errors}
              />
              <CustomSelectField
                name="area"
                labelRequired={false}
                options={AreaOption}
                isloading={isAreaLoading}
                label="DDL-AREA"
                placeholder="DDL-AREA"
                touched={touched}
                errors={errors}
              />
            </div>
            <div className="row row-cols-md-3 border-info-subtle border-black">
              <CustomSelectField
                name="features"
                placeholder="DDL-FEATURE"
                label="SELECT-FEATURE"
                touched={touched}
                errors={errors}
                isSubmitting={isSubmitting}
                options={FeaturesOptionsDDL}
                isMulti={true}
              />
              <CustomInputField
                name="lat"
                placeholder="CLUB-Latitude"
                label="CLUB-Latitude"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              />
              <CustomInputField
                name="lng"
                placeholder="CLUB-Longitude"
                label="CLUB-Longitude"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="row row-cols-3">
              <CustomInputField
                name="phone"
                placeholder="CLUB-PHONE"
                label="CLUB-PHONE"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              />

              {/* <CustomInputField
                name="payload"
                placeholder="CLUB-PAYLOAD"
                label="CLUB-PAYLOAD"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              /> */}

              <CustomInputField
                name="website"
                placeholder="CLUB-WEBSITE"
                label="CLUB-WEBSITE"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              />
              <CustomUploadFile
                isSubmitting={isSubmitting}
                touched={touched}
                errors={errors}
                accept="image/*"
                name="image"
                label="CLUB-IMAGE"
              />
              <CustomUploadFile
                isSubmitting={isSubmitting}
                touched={touched}
                errors={errors}
                accept="image/*"
                name="images"
                label="Club Bunner Images"
                multiple
              />
            </div>

            {/* -- Wait until update images api done >>>  */}

            {/* <div className="row row-cols-3">
              <CustomUploadFile
                name="images"
                label="Club-Covers"
                touched={touched}
                errors={errors}
                multiple={true}
                labelRequired={false}
                isSubmitting={isSubmitting}
                accept={"image/*"}
              />
            </div> */}

            <hr />
            <div className="translation mt-5">
              <div className="d-flex mb-7">
                {Languages.map((lang, index) => (
                  <button
                    type="button"
                    key={lang.prefix + lang.id + index}
                    className={clsx("btn btn-light me-3", {
                      "btn-primary": languageInput === lang.id,
                    })}
                    onClick={() => setLanguageInput(lang.id)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
              {Languages.map(
                (lang) =>
                  lang.id === languageInput && (
                    <Fragment key={lang.id + lang.id + "input+"}>
                      <div className="row row-cols-md-2 row-cols-sm-1 row-cols-1">
                        <CustomInputField
                          key={
                            lang.prefix +
                            lang.id +
                            lang.direction +
                            "input name"
                          }
                          name={`name${lang?.id}`}
                          label="CLUB-NAME"
                          placeholder="CLUB-NAME"
                          as="input"
                          touched={touched}
                          errors={errors}
                          isSubmitting={isSubmitting}
                          labelRequired={languageInput === 2 ? true : false}
                        />
                      </div>
                      <CustomEditor
                        key={lang.prefix + lang.id + "editor"}
                        name={`description${lang?.id}`}
                        labelRequired={languageInput === 2 ? true : false}
                        label={"CLUB-DISSCRIPTION"}
                      />
                    </Fragment>
                  )
              )}
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
