import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

interface Blog {
  id: number;
  title: string;
  content: string;
  publishedDate: string;
  author: {
    name: string;
  };
}

interface JwtPayload {
  id: number;
  isAdmin: boolean;
}

export const AdminPanel = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    // Check if user is admin
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setIsAdmin(decoded.isAdmin);
      if (!decoded.isAdmin) {
        toast.error('You are not an admin');
      } else {
        toast.success('Welcome Admin!');
      }
    } catch (error) {
      toast.error('Invalid token');
      navigate('/signin');
      return;
    }

    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      // Sort blogs by publishedDate in descending order (newest first)
      const sortedBlogs = response.data.blogs.sort((a: Blog, b: Blog) => 
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      );
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Error fetching blogs');
    }
  };

  const handleDelete = async (blogId: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/delete/${blogId}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error deleting blog');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          {!isAdmin && (
            <button 
              onClick={() => navigate('/blogs')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Go to Blogs
            </button>
          )}
        </div>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold">{blog.title}</h2>
                    <span className="text-gray-400 text-sm">ID: {blog.id}</span>
                  </div>
                  <p className="text-gray-600 mb-2">Author: {blog.author.name}</p>
                  <p className="text-gray-500 text-sm">
                    Published: {new Date(blog.publishedDate).toLocaleDateString()}
                  </p>
                </div>
                {isAdmin ? (
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};