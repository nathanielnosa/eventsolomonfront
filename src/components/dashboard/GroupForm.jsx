import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { createGroup } from "../../redux/features/groupSlice";

const GroupForm = ({ onGroupAdded }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { loading, error } = useSelector((state) => state.groups);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(createGroup({ name, description }));
      if (createGroup.fulfilled.match(resultAction)) {
        toast.success("Group created successfully!");
        setName("");
        setDescription("");
        onGroupAdded(resultAction.payload);
      }
    } catch (err) {
      toast.error("Error creating group:", err);
    }
  };

  return (
    <div className="col-lg-6 mb-4">
      <div className="card">
        <ToastContainer />
        <div className="card-header bg-success text-white">
          <h5>Create Group</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Group Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Group Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Group Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={loading || !user}
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;