import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginRegister.css";

const initialState = {
  role: "homeowner",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
  errors: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: validateField(action.field, action.value, state),
        },
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors,
      };

    default:
      return state;
  }
};

const validateField = (field, value, state) => {
  switch (field) {
    case "email":
      return /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email";
    case "password":
      return value.length >= 6 ? "" : "Password must be at least 6 characters";
    case "confirmPassword":
      return value === state.password ? "" : "Passwords do not match";
    case "name":
      return value.length >= 3 ? "" : "Name must be at least 3 characters";
    case "agreeToTerms":
      return value ? "" : "You must agree to the terms";
    case "role":
      return value ? "" : "Role is required";
    default:
      return "";
  }
};


function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [state, formDispatch] = useReducer(reducer, initialState);
  const [serverError, setServerError] = useState("");
  const { dispatch } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    formDispatch({
      type: "UPDATE_FIELD",
      field: name,
      value: type === "checkbox" ? checked : value,
    });
  };

  const location = useLocation();

  useEffect(() => {
    if(location.state?.openRegister){
      setActiveTab("register");
      setIsLogin(false);
    
    }
    if(location.state?.openLogin){
      setActiveTab("login");
      setIsLogin(true);
    }
  }, [activeTab, location.state]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Manual validation
    const fields = ["role", "email", "password"];
    if (!isLogin) {
      fields.push("name", "confirmPassword", "agreeToTerms");
    }

    const errors = {};
    fields.forEach((field) => {
      errors[field] = validateField(field, state[field], state);
    });

    const hasErrors = Object.values(errors).some((err) => err !== "");
    formDispatch({ type: "SET_ERRORS", errors });

    if (hasErrors) {
      return;
    }

    try {
      const { role, email, password, name, agreeToTerms } = state;
      const formData = isLogin
        ? { email, password, role }
        : { name, email, password, role, agreeToTerms };

      const url = isLogin
        ? "http://localhost:5050/api/auth/login"
        : "http://localhost:5050/api/auth/register";

      const res = await axios.post(url, formData);


      const { token, user } = res.data;

      dispatch({ type: "LOGIN", payload: { token, user } });
      localStorage.setItem('user', JSON.stringify(user));
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setServerError(msg);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-visual">
          <h2>GardenCleaner</h2>
          <p>Clean Spaces. Happy Faces.</p>
        </div>

        <div className="login-form-section">
          <div className="login-tabs">
            <button
              className={isLogin && activeTab === "login" ? "active" : ""}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={!isLogin && activeTab==="register" ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {serverError && <div className="error-banner">{serverError}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            {!isLogin &&
              <div className="role-toggle">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="homeowner"
                    checked={state.role === "homeowner"}
                    onChange={handleChange}
                  />{" "}
                  Homeowner
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={state.role === "provider"}
                    onChange={handleChange}
                  />{" "}
                  Provider
                </label>
              </div>
            }
            <p>{state.errors.role}</p>

            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={state.name}
                  onChange={handleChange}
                />
                <p>{state.errors.name}</p>
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={state.email}
              onChange={handleChange}
            />
            <p>{state.errors.email}</p>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
            />
            <p>{state.errors.password}</p>

            {!isLogin && (
              <>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={state.confirmPassword}
                  onChange={handleChange}
                />
                <p>{state.errors.confirmPassword}</p>

                <label className="terms">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={state.agreeToTerms}
                    onChange={handleChange}
                  />{" "}
                  I agree to the Terms & Conditions
                </label>
                <p>{state.errors.agreeToTerms}</p>
              </>
            )}

            <button type="submit">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
