import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CitizenManagement() {

  const navigate = useNavigate();

  const [tab, setTab] = useState("pending");
  const [citizens, setCitizens] = useState([]);

  const fetchCitizens = async () => {

    let url = "";

    if (tab === "pending") {
      url = "http://localhost:5000/api/admin/pending-citizens";
    }

    if (tab === "approved") {
      url = "http://localhost:5000/api/admin/approved-citizens";
    }

    if (tab === "rejected") {
      url = "http://localhost:5000/api/admin/rejected-citizens";
    }

    const res = await axios.get(url);

    setCitizens(res.data);
  };

  useEffect(() => {
    fetchCitizens();
  }, [tab]);

  return (

    <div>

      <h3>CITIZEN MANAGEMENT</h3>

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
            <th>VIEW ID</th>
          </tr>

        </thead>

        <tbody>

          {citizens.map((user) => (

            <tr key={user._id}>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>

                <a href={`/verify-citizen/${user._id}`}>
                  VIEW
                </a>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default CitizenManagement;
