import { useField } from "formik";
import { CountryIso2, PhoneInput } from "react-international-phone";
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
          placeholder={_placeholder}
          defaultCountry={defaultCountry}
          // inputStyle={{
          //   backgroundColor: "#f9f9f9",
          //   height: "100%",
          //   border: "none",
          //   display: "block",
          //   width: "100%",
          //   padding: "0.775rem 1rem",
          //   fontSize: " 1.1rem",
          //   fontWeight: "500",
          //   lineHeight: "1.5",
          //   color: "#4b5675",
          //   border: "1px solid #dbdfe9",
          //   appearance: "none",
          //   borderRadius: "0.475rem",
          //   boxShadow: "false",
          //   transition: "border-color 0.15s ease-in-out, box-shadow 0.15s",
          // }}
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
