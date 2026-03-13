import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StaffDashboard() {
  const navigate = useNavigate();
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authorityToken");
    if (!token) {
      navigate("/staff-login");
      return;
    }

    axios
      .get("http://localhost:5000/api/complaints/department/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const list = res.data || [];
        setPendingComplaints(list.filter((c) => c.status !== "Resolved"));
        setResolvedComplaints(list.filter((c) => c.status === "Resolved"));
        setNotifications(
          list
            .filter((c) => c.status === "Pending")
            .map((c) => ({
              id: c._id,
              complaintId: c._id,
              message: `New complaint: ${c.title}`,
              date: new Date(c.createdAt).toLocaleDateString(),
            }))
        );
      })
      .catch(() => {
        setPendingComplaints([]);
        setResolvedComplaints([]);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authorityToken");
    localStorage.removeItem("staffDepartment");
    localStorage.removeItem("staffEmail");
    navigate("/staff-login");
  };

  const openComplaint = (id) => {
    navigate(`/staff-complaints/${id}`);
  };

  const openNotification = (notification) => {
    navigate(`/staff-notifications?complaintId=${notification.complaintId}`);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2>Staff Dashboard</h2>

        <div style={{ display: "flex", gap: "16px", position: "relative" }}>
          <div ref={notificationRef} style={{ position: "relative" }}>
            <button onClick={toggleNotifications} type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {notifications.length > 0 ? ` (${notifications.length})` : ""}
            </button>
            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "30px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  padding: "10px",
                  width: "260px",
                  zIndex: 10,
                }}
              >
                {notifications.length === 0 ? (
                  <p>No new notifications</p>
                ) : (
                  <ul>
                    {notifications.map((n) => (
                      <li key={n.id}>
                        <button type="button" onClick={() => openNotification(n)}>
                          {n.message}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div ref={profileRef} style={{ position: "relative" }}>
            <button onClick={toggleProfileMenu} type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "30px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  padding: "10px",
                  width: "160px",
                  zIndex: 10,
                }}
              >
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <h3>Pending Complaints</h3>
        <ul>
          {pendingComplaints.map((c) => (
            <li key={c._id}>
              <b>{c.title}</b> | {c.wardNumber}, {c.streetArea} | {new Date(c.createdAt).toLocaleDateString()} | {c.status}{" "}
              <button onClick={() => openComplaint(c._id)}>View</button>
            </li>
          ))}
          {pendingComplaints.length === 0 && <li>No pending complaints</li>}
        </ul>

        <h3>Resolved Complaints</h3>
        <ul>
          {resolvedComplaints.map((c) => (
            <li key={c._id}>
              <b>{c.title}</b> | {c.wardNumber}, {c.streetArea} | {new Date(c.createdAt).toLocaleDateString()} | {c.status}{" "}
              <button onClick={() => openComplaint(c._id)}>View</button>
            </li>
          ))}
          {resolvedComplaints.length === 0 && <li>No resolved complaints</li>}
        </ul>
      </div>
    </div>
  );
}

export default StaffDashboard;
