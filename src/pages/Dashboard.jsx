
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/features/authSlice";
import { FaFacebook, FaInstagram, FaEdit, FaTrash } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";

import EventForm from "../components/dashboard/EventForm";
import GroupForm from "../components/dashboard/GroupForm";
import { fetchEvents, deleteEvent } from "../redux/features/eventSlice";
import { fetchGroups, deleteGroup } from "../redux/features/groupSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [greet, setGreet] = useState("");
  const [activeView, setActiveView] = useState("events");

  // Redux state
  const user = useSelector((state) => state.auth.user);
  const profile = `${import.meta.env.VITE_API_SERVER_IMAGE}${user?.image}`;
  const { events, loading: eventsLoading } = useSelector((state) => state.events);
  const { groups, loading: groupsLoading } = useSelector((state) => state.groups);

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      dispatch(fetchEvents());
      dispatch(fetchGroups());
    }
  }, [dispatch, user]);

  // ... rest of existing code remains the same ...


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
  // Delete handlers
  const handleDeleteGroup = (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      dispatch(deleteGroup(groupId));
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(eventId));
    }
  };

  return (
    <section id="dashboard" className="py-2">
      <div className="container-fluid">
        <div className="row mt-4">
          {/* Updated Sidebar */}
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

              <ul className="list-group text-start my-1 border">
                <li className="list-group-item border-0 my-2">
                  <button
                    className={`text-decoration-none text-dark btn btn-link ${activeView === 'groups' ? 'text-primary' : ''}`}
                    onClick={() => setActiveView('groups')}
                  >
                    Groups
                  </button>
                </li>
                <li className="list-group-item border-0 my-1">
                  <button
                    className={`text-decoration-none text-dark btn btn-link ${activeView === 'events' ? 'text-primary' : ''}`}
                    onClick={() => setActiveView('events')}
                  >
                    Events
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-12">
                {activeView === "events" && <EventForm groups={groups} />}
              </div>
              <div className="col-md-12">
                {activeView === "groups" && <GroupForm />}
              </div>
            </div>

            {/* Groups Table */}
            {activeView === "groups" && (
              <div className="mt-4">
                <h3>Your Groups</h3>
                {groupsLoading ? (
                  <p>Loading groups...</p>
                ) : groups.length > 0 ? (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map((group) => (
                        <tr key={group.id}>
                          <td>{group.name}</td>
                          <td>{group.description}</td>
                          <td>
                            <Link
                              to={`/edit-group/${group.id}`}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No groups found.</p>
                )}
              </div>
            )}

            {/* Events Section */}
            {activeView === "events" && (
              <div className="mt-4">
                <h3>Your Events</h3>
                {eventsLoading ? (
                  <p>Loading events...</p>
                ) : events.length > 0 ? (
                  <div className="row">
                    {events.map((event) => {
                      const eventGroup = groups.find(g => g.id === event.group);
                      return (
                        <div key={event.id} className="col-md-4 mb-3">
                          <div className="card h-100">
                            <div className="card-body d-flex flex-column">
                              <h5 className="card-title">{event.title}</h5>
                              <p className="flex-grow-1">{event.description}</p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  Group: {eventGroup?.name || "No group"}
                                </small>
                                <div>
                                  <Link
                                    to={`/edit-event/${event.id}`}
                                    className="btn btn-sm btn-outline-primary me-2"
                                  >
                                    <FaEdit />
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>No events found.</p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;