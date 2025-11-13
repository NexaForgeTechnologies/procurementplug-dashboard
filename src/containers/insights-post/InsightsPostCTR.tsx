"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { InsightsPostDM } from "@/domain-models/insights-post/InsightsPostDM";

function InsightsPostCTR() {
  // Fetch insights posts
  const fetchInsightsPosts = async (): Promise<InsightsPostDM[]> => {
    const response = await axios.get<InsightsPostDM[]>("/api/insights-post");
    return response.data;
  };

  const { data: insightsPosts, isLoading, isError, refetch } = useQuery<InsightsPostDM[]>({
    queryKey: ["insights-post"],
    queryFn: fetchInsightsPosts,
  });

  const [selectedPost, setSelectedPost] = useState<InsightsPostDM | null>(null);

  const handleViewDetails = (table: InsightsPostDM) => {
    setSelectedPost((prev) =>
      prev?.id === table.id ? null : table
    );
  };

  const handleApprove = (id?: number) => async () => {
    try {
      await axios.put("/api/insights-post", {
        id,
        status: "Approved",
        is_approved: 1,
      });
      // Refresh the data after approval
      setSelectedPost(null);
      refetch();
    }
    catch (error) {
      console.error("Error approving roundtable:", error);
    }
  };

  const handleDecline = (id?: number) => async () => {
    try {
      await axios.put("/api/insights-post", {
        id,
        status: "Declined",
        is_approved: 0,
      });

      // Refresh the data after declining
      setSelectedPost(null);
      refetch();
    }
    catch (error) {
      console.error("Error declining roundtable:", error);
    }
  }

  if (isLoading) return <div>Loading insightsPosts...</div>;
  if (isError) return <div>Failed to load insightsPosts.</div>;


  return (
    <>
      {!selectedPost && (
        <div>
          <h3 className="max-w-[780px] m-auto text-center font-extrabold text-3xl md:text-5xl mb-4 md:mb-8 text-[#010101]">
            Insights Post Request
          </h3>

          {/* Post Header */}
          <div className="grid grid-cols-8 gap-3 mb-3 font-medium">
            <span>Post Title</span>
            <span>Category</span>
            <span>Type</span>
            <span>Sponsored</span>
            <span>Submitted By</span>
            <span>Date</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {/* Dynamic Rows */}
          {insightsPosts?.map((post) => (
            <div
              key={post.id}
              className="text-xs text-[#808080] py-2 border-t border-t-[#808080] grid grid-cols-8 gap-3 items-center"
            >
              <span>{post.name || "N/A"}</span>
              <span>{post.companyName || "N/A"}</span>
              <span>{post.title || "N/A"}</span>
              <span>{post.package || "N/A"}</span>
              <span>{post.date || "N/A"}</span>
              <span>£{post.payment || "N/A"}</span>
              <span>{post.status || "N/A"}</span>
              <button
                className="cursor-pointer p-2 rounded-md bg-[#B08D58] text-white h-max"
                onClick={() => handleViewDetails(post)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPost && (
        <div className="space-y-4">
          <h3 className="max-w-[780px] m-auto text-center font-extrabold text-3xl md:text-5xl mb-4 md:mb-8 text-[#010101]">
            Post Details Page
          </h3>

          {/* Company Registration */}
          <div className="max-w-[500px] rounded border border-[#DBBB89] p-3 space-y-4">
            <img src="" alt="" className="w-full h-[150px] object-cover rounded-sm" />
            <p className="w-max border border-[#DBBB89] p-1 rounded-sm text-xs text-[#1B1B1B]">ARTICLE</p>
            <div className="space-y-1">
              <h3 className="text-xl text-[#85009D] font-bold">The Future of Sustainable Energy</h3>
              <p className="text-[#1B1B1B] text-sm">As the world moves toward cleaner and more efficient
                technologies, sustainable energy is at the forefront of
                innovation.</p>
            </div>
            <div className="text-[#1B1B1B]">
              <div>
                <span className="font-bold" >Category: </span>
                <span>
                  {/* £{selectedPost.payment} {selectedPost.package} */}
                  Energy
                </span>
              </div>
              <div>
                <span className="font-bold" >Type: </span>
                <span>
                  {/* £{selectedPost.payment} {selectedPost.package} */}
                  Article
                </span>
              </div>
              <div>
                <span className="font-bold" >Sponsored: </span>
                <span>
                  {/* £{selectedPost.payment} {selectedPost.package} */}
                  Yes
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 items-center">
            <button
              className="cursor-pointer text-[#B08D57] bg-white border border-[#B08D57] rounded-sm px-6 py-2"
              onClick={() => setSelectedPost(null)}
            >
              Back
            </button>

            {/* Approve Button */}
            <button onClick={handleApprove(selectedPost.id)} className="cursor-pointer text-white bg-[#B08D57] border border-[#B08D57] rounded-sm px-6 py-2">
              Approve & Publish
            </button>

            {/* Decline Button */}
            <button onClick={handleDecline(selectedPost.id)} className="cursor-pointer text-[#B08D57] bg-white border border-[#B08D57] rounded-sm px-6 py-2">
              Reject Submission
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default InsightsPostCTR;
