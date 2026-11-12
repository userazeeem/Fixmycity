
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import "./Dashboard.css";

const API_URL = "http://localhost:5000/api/complaints";
const IMAGE_BASE_URL = "http://localhost:5000";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      if (response.data.success) {
        setComplaints(response.data.complaints);
      } else {
        setError("Unable to fetch complaints.");
      }
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        "Unable to load complaints. Please check the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="dashboard-page">

      <section className="dashboard-header">
        <div>
          <span>CITIZEN DASHBOARD</span>
          <h1>Welcome Back, Citizen!</h1>
          <p>Track your complaints and help improve your city.</p>
        </div>

        <Link to="/categories" className="new-report-btn">
          + Report New Issue
        </Link>
      </section>

      <section className="dashboard-stats">

        <div className="stat-card">
          <span>Total Complaints</span>
          <h2>{loading ? "..." : totalComplaints}</h2>
        </div>

        <div className="stat-card">
          <span>Pending</span>
          <h2>{loading ? "..." : pendingComplaints}</h2>
        </div>

        <div className="stat-card">
          <span>In Progress</span>
          <h2>{loading ? "..." : inProgressComplaints}</h2>
        </div>

        <div className="stat-card">
          <span>Resolved</span>
          <h2>{loading ? "..." : resolvedComplaints}</h2>
        </div>

      </section>

      <section className="complaints-section">

        <div className="complaints-heading">
          <div>
            <h2>Recent Complaints</h2>
            <span>Your latest reported issues</span>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchComplaints}
            disabled={loading}
            title="Refresh complaints"
          >
            <RefreshCw size={17} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading && <p>Loading complaints...</p>}

        {error && (
          <p style={{ color: "#dc2626" }}>{error}</p>
        )}

        {!loading && !error && complaints.length === 0 && (
          <p>No complaints have been submitted yet.</p>
        )}

        {!loading && !error && complaints.length > 0 && (
          <div className="complaints-table">

            <div className="table-header">
              <span>ID</span>
              <span>Issue</span>
              <span>Category</span>
              <span>Image</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            {complaints.map((complaint) => (
              <div className="table-row" key={complaint.id}>

                <span>
                  #FM{String(complaint.id).padStart(3, "0")}
                </span>

                <span>{complaint.title}</span>

                <span>{complaint.category}</span>

                <span>
                  {complaint.image_url ? (
                    <a
                      href={`${IMAGE_BASE_URL}${complaint.image_url}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={`${IMAGE_BASE_URL}${complaint.image_url}`}
                        alt="Complaint evidence"
                        className="complaint-thumbnail"
                      />
                    </a>
                  ) : (
                    "No image"
                  )}
                </span>

                <span>{formatDate(complaint.created_at)}</span>

                <span>
                  <strong
                    className={`status ${complaint.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {complaint.status}
                  </strong>
                </span>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Dashboard;
