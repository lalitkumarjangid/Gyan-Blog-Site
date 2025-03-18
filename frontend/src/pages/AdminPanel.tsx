import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import debounce from "lodash/debounce";

interface UserBlog {
  id: number;
  title: string;
  content: string;
  published: boolean;
  publishedDate: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  isAdmin: boolean;
  isBlocked: boolean; 
  totalBlogs: number;
  blogs: UserBlog[];
}

interface JwtPayload {
  id: number;
  isAdmin: boolean;
}

export const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async (query?: string) => {
    setIsLoading(true);
    try {
      const endpoint = query
        ? `${BACKEND_URL}/api/v1/blog/admin/search?query=${encodeURIComponent(query)}`
        : `${BACKEND_URL}/api/v1/blog/admin/data`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      // Sort users by their most recent blog
      const sortedUsers = response.data.users.sort((a: User, b: User) => {
        const aDate = a.blogs[0]?.publishedDate || "0";
        const bDate = b.blogs[0]?.publishedDate || "0";
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });

      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users data");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length >= 2 || query.length === 0) {
        fetchUsers(query);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.isAdmin) {
        toast.error("You are not an admin");
        navigate("/blogs");
      } else {
        toast.success("Welcome Admin!");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Invalid token");
      navigate("/signin");
    }
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleDelete = async (blogId: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/delete/${blogId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      toast.success("Blog deleted successfully");
      fetchUsers(searchQuery); // Refresh with current search query
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting blog");
    }
  };

  const handleBlogClick = (blogId: number) => {
    navigate(`/blog/${blogId}`);
  };
  
  const handleUnblockUser = async (userId: number) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/blog/admin/unblock/${userId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      toast.success("User unblocked successfully");
      fetchUsers(searchQuery); // Refresh the user list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error unblocking user");
    }
  };

  const renderUserCard = (user: User) => (
    <div
      key={user.id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <span className="text-gray-400 text-sm">Author ID: {user.id}</span>
            </div>
            <p className="text-gray-600">{user.username}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                user.isAdmin
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {user.isAdmin ? "Admin" : "User"}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {user.totalBlogs} {user.totalBlogs === 1 ? "blog" : "blogs"}
            </span>
          </div>
        </div>
      </div>
  
      {user.isBlocked && (
        <button
          onClick={() => handleUnblockUser(user.id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors mb-4"
        >
          Unblock User
        </button>
      )}
  
      {user.blogs.map((blog) => (
        <div
          key={blog.id}
          className="flex justify-between items-center p-4 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer mb-2"
          onClick={() => handleBlogClick(blog.id)}
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{blog.title}</p>
              <span className="text-gray-400 text-sm">ID: {blog.id}</span>
            </div>
            <p className="text-sm text-gray-500">
              Published: {new Date(blog.publishedDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-1 rounded text-sm ${
                blog.published ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
              }`}
            >
              {blog.published ? "Draft" : "Published"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(blog.id);
              }}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Delete blog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => navigate("/blogs")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            View Blog Site
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Search by username, user ID, or blog ID..."
              className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users data...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            users.map(renderUserCard)
          )}
        </div>
      </div>
    </div>
  );
};