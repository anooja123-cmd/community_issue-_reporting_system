import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();
  const [fakeComplaints, setFakeComplaints] = useState([]);

  const fetchFakeComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/fake-complaints");
      setFakeComplaints(res.data);
    } catch (error) {
      console.error("Error fetching fake complaints", error);
    }
  };

  const deactivateCitizen = async (citizenId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/deactivate-citizen/${citizenId}`);
      alert("Citizen deactivated");
    } catch (error) {
      console.error("Error deactivating citizen", error);
    }
  };

  useEffect(() => {
    fetchFakeComplaints();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>ADMIN DASHBOARD</h2>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/admin/citizens")}
          style={{
            background: "black",
            color: "white",
            border: "1px solid black",
            padding: "10px 18px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          CITIZEN
        </button>

        <button
          onClick={() => navigate("/admin/staff")}
          style={{
            background: "black",
            color: "white",
            border: "1px solid black",
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          STAFF
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>REPORTED AS FAKE COMPLAINTS</h3>
        {fakeComplaints.length === 0 ? (
          <p>No fake complaints found.</p>
        ) : (
          fakeComplaints.map((c) => (
            <div
              key={c._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                width: "500px",
              }}
            >
              <p><b>Title:</b> {c.title}</p>
              <p><b>Department:</b> {c.department}</p>
              <p><b>Status:</b> {c.status}</p>
              <p><b>Reason:</b> {c.fakeReason || "No reason provided"}</p>

              <p><b>Citizen:</b> {c.citizenId?.name} ({c.citizenId?.email})</p>
              <p>
                <b>Reported By:</b>{" "}
                {c.reportedAsFakeBy?.name} ({c.reportedAsFakeBy?.email}) - {c.reportedAsFakeBy?.department}
              </p>

              {c.citizenId?._id && (
                <button
                  onClick={() => deactivateCitizen(c.citizenId._id)}
                  style={{
                    background: "red",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Deactivate Citizen
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
