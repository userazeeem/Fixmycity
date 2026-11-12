
import { useState } from "react";
import axios from "axios";
import {
  Camera,
  MapPin,
  FileText,
  ArrowLeft,
  Send,
  ImagePlus,
  X,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import "./ReportIssue.css";

const API_URL = "http://localhost:5000/api/complaints";

const categories = [
  "Roads & Potholes",
  "Water Supply",
  "Garbage & Sanitation",
  "Street Lights",
  "Drainage",
  "Public Safety"
];

function ReportIssue() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    address: ""
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");

    const input = document.getElementById("issue-image");

    if (input) input.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      setError("Please select an issue category.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create multipart form data
      const submissionData = new FormData();

      submissionData.append("title", formData.title);
      submissionData.append("category", formData.category);
      submissionData.append("description", formData.description);
      submissionData.append("address", formData.address);

      // Attach image only when selected
      if (image) {
        submissionData.append("image", image);
      }

      // Send form data to Express + Multer
      const response = await axios.post(
        API_URL,
        submissionData
      );

      if (response.data.success) {
        setComplaintId(response.data.complaintId);
        setSubmitted(true);
      } else {
        setError("Complaint submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Complaint submission error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      address: ""
    });

    removeImage();
    setComplaintId(null);
    setError("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="report-success">
        <div className="success-card">
          <CheckCircle size={65} />

          <h1>Report Submitted!</h1>

          <p>
            Your complaint has been successfully saved.
            Thank you for helping improve your city!
          </p>

          <p>
            <strong>Complaint ID: #{complaintId}</strong>
          </p>

          <Link to="/dashboard" className="success-btn">
            Go to Dashboard
          </Link>

          <button
            className="another-report"
            onClick={resetForm}
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-container">

        <Link to="/" className="back-home">
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="report-heading">
          <span className="report-label">CITIZEN REPORTING</span>

          <h1>
            Report an <span>Issue.</span>
          </h1>

          <p>
            Help us identify and resolve problems in your neighborhood.
          </p>
        </div>

        <form className="report-form" onSubmit={handleSubmit}>

          <div className="form-section-title">
            <FileText size={21} />
            <h2>Issue Information</h2>
          </div>

          <div className="form-group">
            <label htmlFor="title">Issue Title *</label>

            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g. Large pothole near main road"
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Issue Category *</label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>

            <textarea
              id="description"
              name="description"
              placeholder="Describe the problem, its location and how it affects the community..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              maxLength={1000}
              required
            />

            <small>
              {formData.description.length}/1000 characters
            </small>
          </div>

          <div className="form-divider" />

          <div className="form-section-title">
            <Camera size={21} />
            <h2>Upload Evidence</h2>
          </div>

          <div className="upload-area">
            {imagePreview ? (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt="Complaint evidence preview"
                />

                <button
                  type="button"
                  className="remove-image"
                  onClick={removeImage}
                  aria-label="Remove image"
                >
                  <X size={18} />
                </button>

                <p>{image?.name}</p>
              </div>
            ) : (
              <label
                htmlFor="issue-image"
                className="upload-label"
              >
                <ImagePlus size={35} />

                <strong>Upload an issue photograph</strong>

                <span>PNG, JPG or WEBP (maximum 5 MB)</span>

                <span className="choose-file">
                  Upload Image
                </span>
              </label>
            )}

            <input
              id="issue-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              hidden
            />
          </div>

          <div className="form-divider" />

          <div className="form-section-title">
            <MapPin size={21} />
            <h2>Location Details</h2>
          </div>

          <div className="form-group">
            <label htmlFor="address">Issue Address *</label>

            <textarea
              id="address"
              name="address"
              placeholder="Enter the street, area, city and nearby landmark..."
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          {error && (
            <p
              role="alert"
              style={{
                color: "#dc2626",
                marginBottom: "15px"
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="submit-report"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Complaint"}

            <Send size={18} />
          </button>

          <p className="form-note">
            Please provide accurate information to help resolve the issue.
          </p>

        </form>
      </div>
    </div>
  );
}

export default ReportIssue;
