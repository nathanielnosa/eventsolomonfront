import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { createEvent } from "../../redux/features/eventSlice";

const EventForm = ({ groups }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { loading, error } = useSelector((state) => state.events);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    group: "",
    tagged_users: "",
    contacts: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    file: null,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.group) {
      toast.error("Please select a group");
      return;
    }

    // Convert usernames to IDs
    const taggedUserIds = await Promise.all(
      formData.tagged_users.split(',').map(async (username) => {
        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER_DOMAIN}/users/?username=${username.trim()}`
        );
        const data = await response.json();
        return data.id;
      })
    );

    taggedUserIds.forEach(id => eventData.append("tagged_users", id));

    const eventData = new FormData();
    eventData.append("title", formData.title);
    eventData.append("description", formData.description);
    eventData.append("group", formData.group);

    // Convert contacts to JSON array
    const contacts = [{
      name: formData.contacts.name,
      email: formData.contacts.email,
      phone: formData.contacts.phone,
      address: formData.contacts.address
    }];

    const eventsData = new FormData();
    eventsData.append("contacts", JSON.stringify(contacts));  // Wrap in an array

    if (formData.file) eventData.append("file", formData.file);
    
    try {
      const resultAction = await dispatch(createEvent(eventData));
      if (createEvent.fulfilled.match(resultAction)) {
        toast.success("Event created successfully!");
        setFormData({
          title: "",
          description: "",
          group: "",
          tagged_users: "",
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

              {/* Tag Users */}
              <div className="mb-3">
                <label className="form-label">Tag Users</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter usernames separated by commas"
                  name="tagged_users"
                  value={formData.tagged_users}
                  onChange={handleChange}
                />
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