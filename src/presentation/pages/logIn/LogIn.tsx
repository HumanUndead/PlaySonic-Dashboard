import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { useLogin } from "@presentation/hooks/queries/auth/useLogin";
// import { DomainErrorMessagesEnum } from "@domain/enums";
// import { InvalidCredentialsError, UnexpectedError } from "@domain/errors";
// import { UnauthorizedError } from "@domain/errors/UnauthorizedError";
// import { useLogin } from "@hooks/queries/auth/useLogin";

const loginSchema = Yup.object().shape({
  // username: Yup.string().required("username is required"),
  // password: Yup.string()
  //   .min(6, "Minimum 6 symbols")
  //   .max(50, "Maximum 50 symbols")
  //   .matches(/[0-9]/, "Password requires a number")
  //   .matches(/[a-z]/, "Password requires a lowercase letter")
  //   .matches(/[A-Z]/, "Password requires an uppercase letter")
  //   .matches(/[^\w]/, "Password requires a symbol")
  //   .required("Password is required"),
});

const initialValues = {
  username: "",
  password: "",
};

export function Login() {
  const { loading, login } = useLogin();
  //   const { loginError } = useLogin();
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        await login(values.username, values.password);
      } catch (error) {
        setStatus(error);
      }
      setSubmitting(false);
    },
  });

  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      <div className="text-center mb-11">
        <h1 className="text-gray-900 fw-bolder mb-3">Sign In</h1>
      </div>

      {formik.status && (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold"> {formik.status}</div>
        </div>
        //   ) : (
        //     <div className="mb-10 bg-light-info p-8 rounded">
        //       <div className="text-info">
        //         Use account <strong>khaledriyal@gmail.com</strong> and password
        //         <strong>0000</strong> to continue.
        //       </div>
        //     </div>
      )}
      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label className="form-label fs-6 fw-bolder text-gray-900">
          User Name
        </label>
        <input
          placeholder="User Name"
          {...formik.getFieldProps("username")}
          className={clsx(
            "form-control bg-transparent",
            { "is-invalid": formik.touched.username && formik.errors.username },
            {
              "is-valid": formik.touched.username && !formik.errors.username,
            }
          )}
          type="username"
          name="username"
          autoComplete="off"
        />
        {formik.touched.username && formik.errors.username && (
          <div className="fv-plugins-message-container">
            <span role="alert">{formik.errors.username}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-3">
        <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
          Password
        </label>
        <input
          type="password"
          autoComplete="off"
          {...formik.getFieldProps("password")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid": formik.touched.password && formik.errors.password,
            },
            {
              "is-valid": formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
        <div />

        {/* begin::Link */}
        <Link to="/auth/forgot-password" className="link-primary">
          Forgot Password ?
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className="d-grid mb-10">
        <button
          type="submit"
          id="kt_sign_in_submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className="indicator-label">Continue</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      {/* <div className="text-gray-500 text-center fw-semibold fs-6">
        Not a Member yet?{" "}
        <Link to="/auth/registration" className="link-primary">
          Sign up
        </Link>
      </div> */}
    </form>
  );
}

//     navigate("/apps/admin");
//     setSubmitting(false);
//     console.log("error messages", error);
//     if (error instanceof InvalidCredentialsError) {
//       console.error("Invalid credentials:", error.message);
//     } else if (error instanceof UnexpectedError) {
//       console.error("Unexpected error occurred:", error.message);
//     } else {
//       console.error("Error:", error.message);
//     }
//   }
//     if (
//       error.response &&
//       error.response.data &&
//       error.response.data.message
//     ) {
//       setStatus(error);
//     } else {
//       setStatus("An unexpected error occurred. Please try again.");
//     }
//     setSubmitting(false);
//     console.error("Error:", error);
//   }

//     if (error instanceof InvalidCredentialsError) {
//       setStatus("Invalid email or password.");
//     } else if (error instanceof UnauthorizedError) {
//       setStatus("Unauthorized access.");
//     } else {
//       setStatus("Something went wrong");
//     }
//   }
