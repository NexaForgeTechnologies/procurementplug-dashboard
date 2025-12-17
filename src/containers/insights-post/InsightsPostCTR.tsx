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

  const handleViewDetails = (post: InsightsPostDM) => {
    setSelectedPost((prev) =>
      prev?.id === post.id ? null : post
    );
  };

  const handleApprove = (id?: number) => async () => {
    try {
      await axios.put("/api/insights-post", {
        id,
        is_approved: 1,
        selectedPost
      });
      // Refresh the data after approval
      setSelectedPost(null);
      refetch();
    }
    catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const handleDecline = (id?: number) => async () => {

    try {
      await axios.put("/api/insights-post", {
        id,
        is_approved: 0,
        selectedPost
      });

      // Refresh the data after declining
      setSelectedPost(null);
      refetch();
    }
    catch (error) {
      console.error("Error declining post:", error);
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
          <div className="grid grid-cols-7 gap-3 mb-3 font-medium">
            <span>Post Title</span>
            <span>Category</span>
            <span>Type</span>
            <span>Sponsored</span>
            <span>Payment</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {/* Dynamic Rows */}
          {insightsPosts?.map((post) => (
            <div
              key={post.id}
              className="text-xs text-[#808080] py-2 border-t border-t-[#808080] grid grid-cols-7 gap-3 items-center"
            >
              <span>{post.heading || "N/A"}</span>
              <span>{post.category || "N/A"}</span>
              <span>{post.content_type || "N/A"}</span>
              <span>{post.sponsor == "1" ? "Yes" : "No"}</span>
              <span>{post.payment || "N/A"}</span>
              <span>{post.is_approved == 1 ? "Approved" : "Pending"}</span>
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

          {/* Details */}
          <div className="max-w-[500px] rounded border border-[#DBBB89] p-3 space-y-4">
            <img src={selectedPost.banner_img || "/images/default-rectangle.webp"} alt="" className="w-full h-[150px] object-cover rounded-sm" />
            <p className="w-max border border-[#DBBB89] p-1 rounded-sm text-xs text-[#1B1B1B]">{selectedPost.content_type}</p>

            <div className="space-y-1">
              <h3 className="text-xl text-[#85009D] font-bold">{selectedPost.heading}</h3>
              <p className="text-[#1B1B1B] text-sm">{selectedPost.description}</p>
            </div>

            <div className="text-[#1B1B1B]">
              <div>
                <span className="font-bold" >Category: </span>
                <span>{selectedPost.category}</span>
              </div>
              <div>
                <span className="font-bold" >Type: </span>
                <span>{selectedPost.content_type}</span>
              </div>
              <div>
                <span className="font-bold" >Sponsored: </span>
                <span>{selectedPost.sponsor == "1" ? "Yes" : "No"}</span>
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
            <button
              onClick={handleApprove(selectedPost.id)}
              className="cursor-pointer text-white bg-[#B08D57] border border-[#B08D57] rounded-sm
               px-6 py-2">
              Approve & Publish
            </button>

            {/* Decline Button */}
            <button
              onClick={handleDecline(selectedPost.id)}
              className="cursor-pointer text-[#B08D57] bg-white border border-[#B08D57] rounded-sm
               px-6 py-2">
              Reject Submission
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default InsightsPostCTR;
