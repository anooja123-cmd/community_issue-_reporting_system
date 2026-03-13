import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function StaffComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [fakeReason, setFakeReason] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authorityToken");
    if (!token) {
      navigate("/staff-login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setComplaint(res.data);
        if (res.data.status === "Pending") {
          return axios.put(
            `http://localhost:5000/api/complaints/${id}/status`,
            { status: "In Progress" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        return null;
      })
      .then((res) => {
        if (res && res.data) setComplaint(res.data);
      })
      .catch(() => {
        setComplaint(null);
      });
  }, [id]);

  const markResolved = () => {
    const token = localStorage.getItem("authorityToken");
    if (!token || !complaint) return;

    axios
      .put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status: "Resolved" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        navigate("/staff-dashboard");
      });
  };

  const reportAsFake = () => {
    const token = localStorage.getItem("authorityToken");
    if (!token || !complaint) return;

    axios
      .put(
        `http://localhost:5000/api/complaints/${id}/report-fake`,
        { reason: fakeReason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setComplaint(res.data);
        navigate("/staff-dashboard");
      });
  };

  const printComplaint = () => {
    if (!complaint) return;
    const win = window.open("", "_blank");
    win.document.write(`<h2>Complaint Details</h2>`);
    win.document.write(`<p>Title: ${complaint.title}</p>`);
    win.document.write(`<p>Description: ${complaint.description}</p>`);
    win.document.write(`<p>Department: ${complaint.department}</p>`);
    win.document.write(`<p>Ward Number: ${complaint.wardNumber}</p>`);
    win.document.write(`<p>Street/Area: ${complaint.streetArea}</p>`);
    win.document.write(`<p>Landmark: ${complaint.landmark}</p>`);
    win.document.write(`<p>Status: ${complaint.status}</p>`);
    win.document.write(`<p>Date: ${complaint.date}</p>`);
    win.document.close();
    win.print();
  };

  if (!complaint) return <p>Complaint not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Complaint Details</h2>
      <p><b>Title:</b> {complaint.title}</p>
      <p><b>Description:</b> {complaint.description}</p>
      <p><b>Department:</b> {complaint.department}</p>
      <p><b>Ward Number:</b> {complaint.wardNumber}</p>
      <p><b>Street / Area:</b> {complaint.streetArea}</p>
      <p><b>Landmark:</b> {complaint.landmark}</p>
      <p><b>Status:</b> {complaint.status}</p>
      <p><b>Date:</b> {new Date(complaint.createdAt).toLocaleDateString()}</p>
      {complaint.fakeReason && (
        <p><b>Fake Report Reason:</b> {complaint.fakeReason}</p>
      )}

      {complaint.image && (
        <img src={`http://localhost:5000/${complaint.image}`} alt="Complaint" width="300" />
      )}

      <br /><br />

      <button onClick={markResolved}>Resolved</button>
      <button onClick={printComplaint} style={{ marginLeft: "10px" }}>
        Print Complaint
      </button>
      <br /><br />
      <textarea
        placeholder="Reason for reporting as fake (optional)"
        rows="3"
        value={fakeReason}
        onChange={(e) => setFakeReason(e.target.value)}
      />
      <br />
      <button onClick={reportAsFake}>Report as Fake</button>
    </div>
  );
}

export default StaffComplaintDetails;
