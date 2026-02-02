import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api";

export default function ComplaintDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true);
      try {
        // Backend does NOT have /complaints/:id
        // So fetch all and filter
        const res = await client.get("/complaints");
        const found = res.data.complaints.find(
          (c) => c.id === Number(id)
        );

        setComplaint(found || null);
      } catch (err) {
        console.error(err);
        alert("Failed to load complaint");
        nav("/track");
      }
      setLoading(false);
    };

    fetchComplaint();
  }, [id, nav]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!complaint) {
    return (
      <div className="p-6 text-center text-gray-500">
        Complaint not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => nav("/track")}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Back to My Complaints
        </button>

        {/* Complaint Details */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">
                {complaint.title}
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Complaint ID: #{complaint.id}
              </p>
            </div>

            <div className="flex gap-2 flex-col items-end">
              <span
                className={`px-4 py-2 rounded-full text-white font-bold ${
                  complaint.priority === "High"
                    ? "bg-red-600"
                    : complaint.priority === "Medium"
                    ? "bg-orange-600"
                    : "bg-green-600"
                }`}
              >
                {complaint.priority} Priority
              </span>

              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                Status: {complaint.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 font-semibold">
                CATEGORY
              </p>
              <p className="text-lg font-bold text-gray-800">
                {complaint.category}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">
                LOCATION
              </p>
              <p className="text-lg font-bold text-gray-800">
                {complaint.location}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 font-semibold mb-2">
              DESCRIPTION
            </p>
            <p className="text-gray-700 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Submitted on{" "}
            {new Date(complaint.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Timeline (Static / Placeholder) */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📅 Status Timeline
          </h2>

          <div className="text-center py-8 text-gray-500">
            No status updates yet. Complaint is awaiting admin review.
          </div>
        </div>
      </div>
    </div>
  );
}
