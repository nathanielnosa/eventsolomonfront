import { BsPersonCircle } from "react-icons/bs";
import login from '../assets/img/login.png';
import { useState } from 'react';
import { BiShow, BiHide } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/features/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Show and hide password
  const [showPwd, setShowPwd] = useState(false);
  const handleShowPwd = () => setShowPwd(prev => !prev);

  // Form state
  const [data, setData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = data;

    if (!username || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store tokens
        sessionStorage.setItem("access_token", result.access);
        sessionStorage.setItem("refresh_token", result.refresh);

        // Fetch user details
        const userResponse = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/user/`, {
          headers: { "Authorization": `Bearer ${result.access}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();

          // Dispatch user details to Redux
          dispatch(loginSuccess({
            id: userData.id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            username: userData.username,
            image: userData.image || "", // Handle optional image field
            token:result.access
          }));

          toast.success("Login successful!");
          navigate("/dashboard");
        } else {
          toast.error("Failed to fetch user details.");
        }
      } else {
        toast.error(result.detail || "Invalid credentials, try again.");
      }
    } catch (error) {
      toast.error(`Error during login: ${error.message}`);
    }
  };

  return (
    <section id="login">
      <div className="container-fluid py-5">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <ToastContainer />
            <div className="card shadow p-4">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="heading">
                    <h3 className="display-5 fw-bold">Welcome Back!</h3>
                    <p className="lead">To keep connected with us please login with your personal info.</p>
                  </div>
                  <img src={login} alt="login bg" className="img-fluid" />
                </div>
                <div className="col-md-6 bg-light">
                  <div className="heading py-4">
                    <h1 className="fw-bold display-6 mb-4">Sign In</h1>
                    <BsPersonCircle style={{ fontSize: "5rem" }} />
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3 mt-3">
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter username"
                        name="username"
                        value={data.username}
                        onChange={handleChange}
                      />
                      <label htmlFor="username">Username</label>
                    </div>
                    <div className="form-floating mb-3 mt-3 input-group">
                      <input
                        type={showPwd ? "text" : "password"}
                        className="form-control"
                        id="password"
                        placeholder="Enter password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                      />
                      <label htmlFor="password">Password</label>
                      <span className="input-group-text pe-auto" onClick={handleShowPwd}>
                        {showPwd ? <BiShow /> : <BiHide />}
                      </span>
                    </div>
                    <div className="mb-3">
                      <button className="btn btn-dark w-100 py-2">Login</button>
                    </div>
                    <div className="mb-2">
                      <Link className="text-dark" to="/register">
                        Don&apos;t have an account? <span className="fw-medium">Register</span>
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
