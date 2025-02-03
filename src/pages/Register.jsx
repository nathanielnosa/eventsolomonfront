import { BsPersonCircle } from "react-icons/bs";
import register from '../assets/img/register.png'
import { useState } from 'react'
import { BiShow, BiHide } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
const Register = () => {
  const navigate = useNavigate()
  // show and hide password
  const [showPwd, setShowPwd] = useState(false);
  const handleShowPwd = () => {
    setShowPwd(prev => !prev)
  }

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setData(prevData => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value // Store file directly, no Base64 conversion
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.first_name && data.last_name && data.username && data.email && data.password) {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.image) {
        formData.append("image", data.image);
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/register/`, {
          method: "POST",
          body: formData, // ✅ No need for JSON.stringify()
        });

        if (response.ok) {
          toast("User registered successfully!");
          setTimeout(() => navigate("/"), 2000);
        } else {
          const errorData = await response.json();
          toast(`Error: ${errorData.message || "Registration failed"}`);
        }
      } catch (error) {
        toast("Error during registration:", error.message);
      }
    } else {
      toast("All fields are required!");
    }
  };

  return (
    <section id="register">
      <div className="container-fluid py-2">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <ToastContainer />
            <div className="card shadow px-4">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="heading">
                    <h3 className="display-5 fw-bold">Hi! Welcome</h3>
                    <p className="lead">New user right?<br /> Use the form to get started, its absolutely free.</p>
                  </div>
                  <img src={register} alt="login bg" className='img-fluid' />
                </div>
                <div className="col-md-6 bg-light">
                  <div className="heading py-3">
                    <h1 className='fw-bold display-6 mb-1'>sign up</h1>
                    <BsPersonCircle style={{ fontSize: '4rem' }} />
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-floating my-2">
                      <input type="text" className="form-control" id="first_name" placeholder="Enter first name" name="first_name" value={data.first_name} onChange={handleChange} />
                      <label htmlFor="first_name">first name</label>
                    </div>
                    <div className="form-floating my-2">
                      <input type="text" className="form-control" id="last_name" placeholder="Enter last name" name="last_name" value={data.last_name} onChange={handleChange} />
                      <label htmlFor="last_name">last name</label>
                    </div>
                    <div className="form-floating my-2">
                      <input type="text" className="form-control" id="username" placeholder="Enter username" name="username" value={data.username} onChange={handleChange} />
                      <label htmlFor="username">username</label>
                    </div>
                    <div className="form-floating my-2">
                      <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" value={data.email} onChange={handleChange} />
                      <label htmlFor="email">email</label>
                    </div>
                    <div className="form-group my-2">
                      <input type="file" className="form-control" id="image" placeholder="Enter profile photo" onChange={handleChange} name="image" />
                    </div>
                    <div className="form-floating my-2 input-group">
                      <input type={showPwd ? "text" : "password"} className="form-control" id="password" placeholder="Enter password" value={data.password} onChange={handleChange} name="password" />
                      <label htmlFor="password">Password</label>
                      <span className="input-group-text pe-auto" onClick={handleShowPwd}>
                        {showPwd ? <BiShow /> : <BiHide />}
                      </span>
                    </div>
                    <div className="mb-3">
                      <button className="btn btn-dark w-100 py-2">Sign up</button>
                    </div>
                    <div className="mb-2">
                      <Link className="text-dark" to={'/'}>Have an account already? <span className='font-medium'>Login</span></Link>                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}

export default Register