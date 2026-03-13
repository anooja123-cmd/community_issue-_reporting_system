import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function VerifyStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/admin/authority/${id}`)
      .then((res) => {
        setStaff(res.data);
      })
      .catch(() => {
        setError("Staff not found.");
      });
  }, [id]);

  const approve = async () => {
    await axios.put(`http://localhost:5000/api/admin/approve-authority/${id}`);
    alert("Staff Approved");
  };

  const reject = async () => {
    await axios.put(`http://localhost:5000/api/admin/reject-authority/${id}`);
    alert("Staff Rejected");
  };

  if (error) return <p>{error}</p>;
  if (!staff) return <p>Loading...</p>;

  return (
    <div>
      <h2>STAFF VERIFICATION</h2>

      <button onClick={() => navigate("/admin/staff")}>BACK</button>

      <p>Name: {staff.name}</p>
      <p>Email: {staff.email}</p>
      <p>Phone: {staff.phone}</p>
      <p>Department: {staff.department}</p>
      <p>Employee ID: {staff.employeeId}</p>
      <p>Status: {staff.status}</p>

      {staff.certificate && (
        <>
          <img
            src={`http://localhost:5000/${staff.certificate}`}
            alt="Department License"
            width="300"
          />
          <br />
          <a
            href={`http://localhost:5000/${staff.certificate}`}
            target="_blank"
            rel="noreferrer"
          >
            OPEN CERTIFICATE
          </a>
        </>
      )}

      <br /><br />

      <button onClick={approve}>APPROVE</button>
      <button onClick={reject}>REJECT</button>
    </div>
  );
}

export default VerifyStaff;
