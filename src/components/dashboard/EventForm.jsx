import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { createEvent } from "../../redux/features/eventSlice";

const EventForm = ({ groups }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { loading, error } = useSelector((state) => state.events);

  const [users, setUsers] = useState([]); // New state to store all users
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    group: "",
    tagged_users: [], // Store as an array of selected user IDs
    contacts: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    file: null,
  });

  useEffect(() => {
    // Fetch users to populate the select dropdown
    const fetchUsers = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/users/`, {
        headers: {
          "Authorization": `Bearer ${user?.token}`, // Pass the token if required
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Assuming your API returns a list of users
      } else {
        toast.error("Error fetching users.");
      }
    };

    fetchUsers();
  }, [user?.token]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contacts: { ...prev.contacts, [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData((prev) => ({
      ...prev,
      file: files[0],
    }));
  };

  const handleUserSelect = (e) => {
    const selectedUsers = Array.from(e.target.selectedOptions, option => option.value);
    setFormData((prev) => ({
      ...prev,
      tagged_users: selectedUsers,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.group) {
      toast.error("Please select a group");
      return;
    }

    // Prepare FormData
    const eventData = new FormData();
    eventData.append("title", formData.title);
    eventData.append("description", formData.description);
    eventData.append("group", formData.group);
     eventData.append("user", user.id); 

    // Convert contacts to JSON array
    const contacts = [{
      name: formData.contacts.name,
      email: formData.contacts.email,
      phone: formData.contacts.phone,
      address: formData.contacts.address
    }];
    eventData.append("contacts", JSON.stringify(contacts));

    // Add selected users (tagged users)
    formData.tagged_users.forEach(id => eventData.append("tagged_users", id));

    if (formData.file) eventData.append("file", formData.file);
    
    try {
      const resultAction = await dispatch(createEvent(eventData));
      if (createEvent.fulfilled.match(resultAction)) {
        toast.success("Event created successfully!");
        setFormData({
          title: "",
          description: "",
          group: "",
          tagged_users: [],
          contacts: { name: "", email: "", phone: "", address: "" },
          file: null,
        });
      }
    } catch (err) {
      toast.error("Error creating event:", err);
    }
  };

  return (
    <div className="col-lg-6 mb-4">
      <div className="card">
        <ToastContainer />
        <div className="card-header bg-primary text-white">
          <h5>Create Event</h5>
        </div>
        <div className="card-body">
          {!user ? (
            <p className="text-danger">You must be logged in to create an event.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Event Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* Group Selection */}
              <div className="mb-3">
                <label className="form-label">Group</label>
                <select
                  className="form-control"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Group</option>
                  {(Array.isArray(groups) ? groups : []).map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Users (Multi-select dropdown) */}
              <div className="mb-3">
                <label className="form-label">Tag Users</label>
                <select
                  multiple
                  className="form-control"
                  name="tagged_users"
                  value={formData.tagged_users}
                  onChange={handleUserSelect}
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} {/* or another user attribute */}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Details */}
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Contact Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contact Name"
                      name="name"
                      value={formData.contacts.name}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Contact Email"
                      name="email"
                      value={formData.contacts.email}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contact phone"
                      name="phone"
                      value={formData.contacts.phone}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Contact Address</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Contact Address"
                      name="address"
                      value={formData.contacts.address}
                      onChange={handleContactChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-3">
                <label className="form-label">Upload File</label>
                <input
                  type="file"
                  className="form-control"
                  name="file"
                  onChange={handleFileChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !user || groups.length === 0}
              >
                {loading ? "Creating..." :
                  groups.length === 0 ? "Create a Group First" : "Create Event"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventForm;
