import { useField } from "formik";
import {
  CountryIso2,
  PhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import clsx from "clsx";
import { useLocaleFormate } from "@presentation/hooks";

interface IProps {
  name: string;
  label?: string;
  containerClassName?: string;
  defaultCountry?: CountryIso2;
  placeholder?: string;
  labelRequired?: boolean;
}

const countries = defaultCountries.map((country) => {
  const { iso2 } = parseCountry(country);
  if (iso2 === "il") country[0] = "Palestine";
  return country;
});

export const PhoneInputField = ({
  name,
  defaultCountry = "jo",
  labelRequired = true,
  containerClassName = "",
  label,
  placeholder,
  ...props
}: IProps) => {
  const _label = useLocaleFormate(label || "");
  const _placeholder = useLocaleFormate(placeholder || "");
  const [field, meta, { setValue }] = useField(name);

  return (
    <div
      className={clsx("fv-row mb-7", containerClassName && containerClassName)}
    >
      {_label ? (
        <label
          className={clsx({
            ["required"]: labelRequired,
            ["fw-bold fs-6 mb-2"]: true,
          })}
        >
          {_label}
        </label>
      ) : null}
      <div className="position-relative">
        <PhoneInput
          inputClassName="w-100 form-control form-control-solid"
          className="form-control form-control-solid d-flex w-100"
          value={field.value}
          countries={countries}
          placeholder={_placeholder}
          defaultCountry={defaultCountry}
          flags={[
            {
              iso2: "il",
              src: "/public/media/flags/palestine.svg",
            },
          ]}
          onChange={(value) => {
            setValue(value);
          }}
          {...props}
        />
        {meta.touched && meta.error && (
          <div style={{ color: "red" }}>{meta.error}</div>
        )}
      </div>
    </div>
  );
};
