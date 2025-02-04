import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventForm from "../components/dashboard/EventForm";
import GroupForm from "../components/dashboard/GroupForm";
import { fetchEvents } from "../redux/features/eventSlice";
import { fetchGroups } from "../redux/features/groupSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [greet, setGreet] = useState("");

  // Redux state
  const user = useSelector((state) => state.auth.user);
  const profile = `${import.meta.env.VITE_API_SERVER_IMAGE}`+`${user.image}`
 
  const { events, loading: eventsLoading } = useSelector((state) => state.events);
  const { groups, loading: groupsLoading } = useSelector((state) => state.groups);

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      dispatch(fetchEvents());
      dispatch(fetchGroups());
    }
  }, [dispatch, user]);

  // Time-based greeting
  useEffect(() => {
    const time = new Date().getHours();
    if (time < 12) setGreet("good morning");
    else if (time < 16) setGreet("good afternoon");
    else setGreet("good evening");
  }, []);

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    navigate("/");
  };

  // Redirect to login if no user
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <section id="dashboard" className="py-2">
      <div className="container-fluid">
        <div className="row mt-4">
          {/* Sidebar */}
          <aside className="col-md-3 bg-white shadow-sm rounded p-3">
            <div className="text-center mb-4">
              <img
                src={profile || "https://randomuser.me/api/portraits/men/55.jpg"}
                alt={user?.username}
                className="rounded-circle mb-2"
                style={{ width: "120px", height: "120px" }}
              />
              <p className="text-muted text-capitalize">{greet}</p>
              <h5>{user?.first_name} {user?.last_name}</h5>
              <p className="text-muted">{user?.email}</p>
              <div className="d-flex gap-3 justify-content-center">
                <a href="/" className="text-dark"><FaFacebook /></a>
                <a href="/" className="text-dark"><FaInstagram /></a>
                <a href="/" className="text-dark"><BsTwitter /></a>
              </div>
              <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>

              <ul className="list-group text-start my-2 border">
                <li className="list-group-item border-0 my-2">Groups</li>
                <li className="list-group-item border-0 my-2">Events</li>
                <li className="list-group-item border-0 my-2">Users</li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="col-md-9">
            <div className="row">
              <EventForm groups={groups} />
              <GroupForm />
            </div>

            {/* Events Section */}
            <div className="mt-4">
              <h3>Your Events</h3>
              {eventsLoading ? (
                <p>Loading events...</p>
              ) : events.length > 0 ? (
                <div className="row">
                  {events.map((event) => (
                    <div key={event.id} className="col-md-4 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">{event.title}</h5>
                          <p>{event.description}</p>
                          <small>Group: {event.group?.name}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No events found.</p>
              )}
            </div>

            {/* Calendar Section */}
            <div className="mt-4">
              <h3>Calendar</h3>
              <Calendar value={date} onChange={setDate} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;