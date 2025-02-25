import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  CustomButton,
  CustomInputField,
  CustomListLoading,
  CustomToast,
  showAreYouSure,
  showConfirmationAlert,
  showDeletedAlert,
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
import { combineBits, QUERIES } from "@presentation/helpers";
import { useMutation, useQueryClient } from "react-query";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import clsx from "clsx";
import validationSchemas from "@presentation/helpers/validationSchemas";
import CustomEditor from "@presentation/components/forms/CustomEditor";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { IClubData } from "@domain/entities/Clubs/Clubs";
import { ClubCommandInstance } from "@app/useCases/clubs";
import { ClubUrlEnum } from "@domain/enums/URL/Clubs/ClubUrls/Club";
import {
  FeaturesOptionsDDL,
  IfeatureOptionsDDL,
} from "@presentation/helpers/DDL/FeaturesOptions";
import { useCitiesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useCitiesDDL";
import { useAreasDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useAreasDDL";
import { useCountriesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useCountriesDDL";
import { useFindFeaturesByNumb } from "@presentation/helpers/DDL/FindFeaturesByNumb";
import { CustomUploadFile } from "@presentation/components/forms/CustomUploadFile";
import { CustomImageReviewForUpdate } from "@presentation/components/forms/CustomImageReviewForUpdate";

interface IProps {
  ClubData: IClubData;
  isLoading: boolean;
}

export const UpdateClubModalForm = ({ ClubData, isLoading }: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  // To extract the lat and lng from full location path.
  const locationString = ClubData.location;
  const regex = /POINT \(([^ ]+) ([^)]+)\)/;
  const matches = locationString.match(regex) || "";

  const lat = parseFloat(matches[1]);
  const lng = parseFloat(matches[2]);

  const initialValues = useMemo(() => {
    const translations = Languages.reduce<{ [key: string]: string }>(
      (acc, lang) => {
        acc[`name${lang.id}`] = "";
        acc[`description${lang.id}`] = "";
        return acc;
      },
      {}
    );
    ClubData.clubInfoResponses.forEach((lang) => {
      translations[`name${lang.languageId}`] = lang.name;
      translations[`description${lang.languageId}`] = lang.description;
    });

    return {
      id: ClubData.id,
      city: ClubData?.cityId,
      country: ClubData?.countryId,
      area: ClubData.areaId,
      phone: ClubData.phone,
      website: ClubData.website,
      features: ClubData.features,
      payload: ClubData.payload,
      lat: lat,
      lng: lng,
      image: "",
      // images: ClubData.images,
      newImages: [],
      ...translations,
    };
  }, [ClubData, Languages, lng, lat]);

  const _ClubSchema = Object.assign(
    {
      country: validationSchemas.object,
      city: validationSchemas.object,
      area: validationSchemas.object,
      lat: Yup.number(),
      lng: Yup.number(),
    },
    ...Languages.map((lang) => {
      return lang.id === 2
        ? {
            [`name${lang?.id}`]: Yup.string().required(
              "This field is required"
            ),
          }
        : {
            [`name${lang?.id}`]: Yup.string().when(
              [`description${lang.id}`, `note${lang.id}`],
              {
                is: (descriptionVal: string, noteVal: string) =>
                  (descriptionVal && descriptionVal.trim() !== "") ||
                  (noteVal && noteVal.trim() !== ""),
                then: (schema) => schema.required("This field is required"),
                otherwise: (schema) => schema,
              }
            ),
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
    formData.append("Id", String(initialValues.id));
    formData.append("CountryId", values.country.value);
    formData.append("CityId", values.city.value);
    formData.append("AreaId", values.area.value);
    formData.append("Phone", values.phone);
    formData.append("Website", values.website);
    formData.append("Features", String(features));
    formData.append("Payload", values.payload);
    formData.append("lat", values.lat);
    formData.append("lng", values.lng);
    if (values.image) {
      formData.append("Img", values.image);
    }

    //  Until update images api done ---->

    values.newImages?.map((img: string) => {
      formData.append("Images", img);
    });
    const usedLangIds = ClubData.clubInfoResponses.map((lang) => {
      return lang.languageId;
    });
    let index = 0;
    Languages.forEach((lang) => {
      if (values[`name${lang?.id}`]) {
        formData.append(
          `ClubInfos[${index}].id`,
          usedLangIds.includes(lang.id) ? values.id.toString() : "0"
        );
        formData.append(`ClubInfos[${index}].clubId`, values.id.toString());
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
      const data = await ClubCommandInstance.updateClub(
        ClubUrlEnum.UpdateClub,
        formData
      );
      if (data) {
        CustomToast("Club updated successfully", "success", {
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
          validationSchema={ClubSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <ClubUpdateForm clubData={ClubData} />
        </Formik>
      )}
    </>
  );
};

interface IData {
  clubData: IClubData;
}
const ClubUpdateForm: FC<IData> = ({ clubData }) => {
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<string>();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    setFieldValue,
  }: FormikContextType<FormikValues> = useFormikContext();
  const { Languages } = useLanguageStore();
  const [languageInput, setLanguageInput] = useState(2);
  const { CountryOption, isCountryLoading } = useCountriesDDL();
  const { CityOption, isCityLoading } = useCitiesDDL();
  const { AreaOption, isAreaLoading } = useAreasDDL();

  const { featuresList } = useFindFeaturesByNumb(clubData.features);
  const featuresReturnList = featuresList?.map((feature) => ({
    value: feature.value,
    label: feature.label,
  }));

  useEffect(() => {
    setImages(clubData.images);
  }, [clubData.images]);

  useEffect(() => {
    CountryOption.forEach((elem) => {
      if (elem.value === values.country) {
        return setFieldValue("country", {
          value: elem.value,
          label: elem.label,
        });
      }
    });

    CityOption.forEach((elem) => {
      if (elem.value === values.city) {
        return setFieldValue("city", {
          value: elem.value,
          label: elem.label,
        });
      }
    });
    AreaOption.forEach((elem) => {
      if (elem.value === values.area) {
        return setFieldValue("area", {
          value: elem.value,
          label: elem.label,
        });
      }
    });

    if (featuresReturnList) {
      setFieldValue("features", featuresReturnList);
    }
  }, [CountryOption, CityOption, AreaOption, featuresList]);

  const { mutateAsync: deleteImage } = useMutation(
    async () => {
      const data = await ClubCommandInstance.deleteClubImage(
        ClubUrlEnum.DeleteClubImage,
        clubData?.id
      );
      return data;
    },
    {
      onSuccess: async () => {
        CustomToast(`Deleted successfully`, "success");
        showDeletedAlert();
        queryClient.invalidateQueries({ queryKey: [QUERIES.ClubList] });
        setItemIdForUpdate(undefined);
      },
      onError: (error) => {
        console.error("Error when deleting Country Image", error);
        CustomToast(`Failed to delete Country Image`, "error");
      },
    }
  );

  const HandelDeleteImage = async (img: string) => {
    showAreYouSure({
      message: "Are you sure you want to delete this image?",
      onConfirm: async () => {
        setImages(images?.replace(img || "", ""));
        if (img) {
          await ClubCommandInstance.deleteClubImages(
            ClubUrlEnum.DeleteClubImages,
            clubData.id || 0,
            img.split("/").pop()
          );
          // openUpdateHotelSupplierRoomModal(values?.id);
        }
      },
      onCancel: async () => {},
      icon: "warning",
    });
  };

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
              <div>
                <CustomUploadFile
                  label="Club-Image"
                  name="image"
                  touched={touched}
                  errors={errors}
                  labelRequired={true}
                  isSubmitting={isSubmitting}
                  accept={"image/*"}
                />
                {typeof values.image === "string" && clubData.image ? (
                  <CustomImageReviewForUpdate
                    inedx={1}
                    fileName={clubData.image}
                    imageUrl={clubData.image}
                    onClickDelete={async () => {
                      const confirm = await showConfirmationAlert();
                      if (confirm) {
                        await deleteImage();
                      }
                    }}
                  />
                ) : (
                  <div></div>
                )}
              </div>
            </div>

            {/* ----- Until update images api done ---- */}

            <div className="row row-cols-3">
              <div>
                <CustomUploadFile
                  name="newImages"
                  label="Club Banner Images"
                  touched={touched}
                  errors={errors}
                  multiple
                  labelRequired={false}
                  isSubmitting={isSubmitting}
                  accept={"image/*"}
                />

                {images &&
                  images.split(",").map((image) => (
                    <CustomImageReviewForUpdate
                      inedx={+image}
                      fileName={clubData.images + image}
                      imageUrl={image.trim()}
                      onClickDelete={() => {
                        HandelDeleteImage(image);
                      }}
                    />
                  ))}
              </div>
            </div>
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

export default UpdateClubModalForm;
