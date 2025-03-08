import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import RichTextEditor from "../components/RichTextEditor";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); // Stores HTML content
    const navigate = useNavigate();

    const handlePublish = async () => {
        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }

        if (!description.trim()) {
            toast.error("Please write some content");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to publish");
                navigate("/signin");
                return;
            }

            const response = await axios.post(
                `${BACKEND_URL}/api/v1/blog`,
                { title, content: description },
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
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Appbar />
            <div className="flex justify-center py-12">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Create a New Blog
                    </h2>

                    {/* Title Input */}
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        type="text"
                        className="w-full p-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter Blog Title..."
                    />

                    {/* RichTextEditor */}
                    <div className="mt-4">
                        <RichTextEditor value={description} onChange={setDescription} />
                    </div>

                    {/* Publish Button */}
                    <button
                        onClick={handlePublish}
                        type="submit"
                        className="mt-6 w-full px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all focus:ring-4 focus:ring-blue-200"
                    >
                        🚀 Publish Post
                    </button>
                </div>
            </div>
        </div>
    );
};
