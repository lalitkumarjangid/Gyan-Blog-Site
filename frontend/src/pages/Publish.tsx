import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import BlogEditor from "../components/BlogsEditor";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please write some content");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to publish");
        navigate("/signin");
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title,
          content,
          contentType: "markdown",
        },
        { headers: { Authorization: token } }
      );

      toast.success("Blog published successfully!");
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.status === 401
            ? "Please login again to publish"
            : "Failed to publish blog";
        toast.error(message);
        if (error.response?.status === 401) {
          navigate("/signin");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Appbar />
      <div className="flex justify-center py-12">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Create a New Blog
          </h2>

          {/* Title Input */}
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            className="w-full p-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
            placeholder="Enter Blog Title..."
          />

          {/* Blog Editor */}
          <BlogEditor
            value={content}
            onChange={setContent}
            editorType="markdown"
          />

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all focus:ring-4 focus:ring-blue-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Publishing...
              </div>
            ) : (
              "🚀 Publish Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
