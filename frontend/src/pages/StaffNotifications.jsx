import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function StaffNotifications() {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authorityToken");
    const params = new URLSearchParams(location.search);
    const complaintId = params.get("complaintId");

    if (complaintId && token) {
      axios
        .get(`http://localhost:5000/api/complaints/${complaintId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setComplaint(res.data);
          setSelected({
            message: `Complaint: ${res.data.title}`,
            date: new Date(res.data.createdAt).toLocaleDateString(),
          });
        })
        .catch(() => {
          setComplaint(null);
        });
    }

    setNotifications([]);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>

      {selected && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Notification Details</h3>
          <p><b>Message:</b> {selected.message}</p>
          <p><b>Date:</b> {selected.date}</p>
        </div>
      )}

      {complaint && (
        <div style={{ marginBottom: "20px" }}>
          <p><b>Department:</b> {complaint.department}</p>
          <p><b>Status:</b> {complaint.status}</p>
          <p><b>Ward Number:</b> {complaint.wardNumber}</p>
          <p><b>Street / Area:</b> {complaint.streetArea}</p>
          <p><b>Landmark:</b> {complaint.landmark}</p>
        </div>
      )}

      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            {n.message} ({n.date})
          </li>
        ))}
        {notifications.length === 0 && <li>No notifications.</li>}
      </ul>
    </div>
  );
}

export default StaffNotifications;
