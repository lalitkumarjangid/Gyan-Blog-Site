import { useEffect, useState, useCallback } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog {
    id: number;
    title: string;
    content: string;
    author: {
        name: string;
    };
    publishedDate: string; 
}

interface CacheItem<T> {
    data: T;
    timestamp: number;
}

// Cache with timestamp for expiration
const blogCache = new Map<string, CacheItem<Blog>>();
const blogsCache = new Map<string, CacheItem<Blog[]>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [blog, setBlog] = useState<Blog | undefined>(() => {
        const cached = blogCache.get(id);
        return cached && (Date.now() - cached.timestamp < CACHE_DURATION) ? cached.data : undefined;
    });

    const fetchBlog = useCallback(async (signal?: AbortSignal) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                headers: { Authorization: token },
                signal
            });
            
            const blogData = response.data.blog;
            blogCache.set(id, { data: blogData, timestamp: Date.now() });
            setBlog(blogData);
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError(err as Error);
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    const refresh = () => fetchBlog();

    useEffect(() => {
        const controller = new AbortController();
        const cached = blogCache.get(id);

        if (!cached || (Date.now() - cached.timestamp >= CACHE_DURATION)) {
            fetchBlog(controller.signal);
        } else {
            setBlog(cached.data);
            setLoading(false);
            // Refresh in background if cache is older than 1 minute
            if (Date.now() - cached.timestamp > 60000) {
                fetchBlog(controller.signal);
            }
        }

        return () => controller.abort();
    }, [id, fetchBlog]);

    return { loading, blog, error, refresh };
};

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [blogs, setBlogs] = useState<Blog[]>(() => {
        const cached = blogsCache.get('all');
        return cached && (Date.now() - cached.timestamp < CACHE_DURATION) ? cached.data : [];
    });

    const fetchBlogs = useCallback(async (signal?: AbortSignal) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
                headers: { Authorization: token },
                signal
            });
            
            const blogsData = response.data.blogs;
            blogsCache.set('all', { data: blogsData, timestamp: Date.now() });
            setBlogs(blogsData);
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError(err as Error);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = () => fetchBlogs();

    useEffect(() => {
        const controller = new AbortController();
        const cached = blogsCache.get('all');

        if (!cached || (Date.now() - cached.timestamp >= CACHE_DURATION)) {
            fetchBlogs(controller.signal);
        } else {
            setBlogs(cached.data);
            setLoading(false);
            // Refresh in background if cache is older than 1 minute
            if (Date.now() - cached.timestamp > 60000) {
                fetchBlogs(controller.signal);
            }
        }

        return () => controller.abort();
    }, [fetchBlogs]);

    return { loading, blogs, error, refresh };
};