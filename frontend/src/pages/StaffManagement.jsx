import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StaffManagement() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("pending");
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      let url = "";

      if (tab === "pending") {
        url = "http://localhost:5000/api/admin/pending-authorities";
      }

      if (tab === "approved") {
        url = "http://localhost:5000/api/admin/approved-authorities";
      }

      if (tab === "rejected") {
        url = "http://localhost:5000/api/admin/rejected-authorities";
      }

      const res = await axios.get(url);
      setStaff(res.data);
    };

    fetchStaff();
  }, [tab]);

  return (
    <div>
      <h3>STAFF MANAGEMENT</h3>

      <button onClick={() => navigate("/admin/dashboard")}>BACK</button>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setTab("pending")}>PENDING</button>
        <button onClick={() => setTab("approved")}>APPROVED</button>
        <button onClick={() => setTab("rejected")}>REJECTED</button>
      </div>

      <table border="1" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>DEPARTMENT</th>
            <th>EMPLOYEE ID</th>
            <th>CERTIFICATE</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>{user.employeeId}</td>
              <td>
                {user.certificate ? (
                  <a href={`/verify-staff/${user._id}`}>VIEW</a>
                ) : (
                  <a href={`/verify-staff/${user._id}`}>VIEW</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffManagement;
