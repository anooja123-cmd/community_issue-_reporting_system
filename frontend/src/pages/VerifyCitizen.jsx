import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function VerifyCitizen() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {

    axios
      .get(`http://localhost:5000/api/admin/citizen/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setError("Citizen not found.");
      });

  }, [id]);

  const approve = async () => {

    await axios.put(
      `http://localhost:5000/api/admin/approve-citizen/${id}`
    );

    alert("Citizen Approved");

  };

  const reject = async () => {

    await axios.put(
      `http://localhost:5000/api/admin/reject-citizen/${id}`
    );

    alert("Citizen Rejected");

  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (

    <div>

      <h2>CITIZEN VERIFICATION</h2>

      <button onClick={() => navigate("/admin/citizens")}>BACK</button>

      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>ID Type: {user.verificationIdType}</p>
      <p>Status: {user.status}</p>

      <img
        src={`http://localhost:5000/${user.verificationIdImage}`}
        alt="Citizen ID"
        width="300"
      />

      <br /><br />

      {user.status === "pending" && (
        <>
          <button onClick={approve}>
            APPROVE
          </button>

          <button onClick={reject}>
            REJECT
          </button>
        </>
      )}

    </div>

  );

}

export default VerifyCitizen;
