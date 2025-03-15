import { useState, useEffect, useRef, useCallback } from "react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
import { useSearch } from "../components/Search";

const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Recently";

        return new Intl.DateTimeFormat("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Asia/Kolkata",
        }).format(date);
    } catch (error) {
        console.error("Date formatting error:", error);
        return "Recently";
    }
};

export const Blogs = () => {
    const { loading, blogs } = useBlogs();
    const [visibleBlogs, setVisibleBlogs] = useState<any[]>([]);
    const [loadedCount, setLoadedCount] = useState(5);
    const [isFetching, setIsFetching] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const { searchTerm } = useSearch();

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.author?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Load more blogs
     const loadMoreBlogs = useCallback(() => {
        if (isFetching || loadedCount >= filteredBlogs.length) return;
        setIsFetching(true);
        setTimeout(() => {
            setLoadedCount((prev) => Math.min(prev + 5, filteredBlogs.length));
            setIsFetching(false);
        }, 1000);
    }, [filteredBlogs.length, isFetching, loadedCount])

    // Load initial blogs when data is available
    useEffect(() => {
        if (!loading && filteredBlogs.length > 0) {
            setVisibleBlogs(filteredBlogs.slice(0, loadedCount));
        }
    }, [filteredBlogs, loading, loadedCount]);

    useEffect(() => {
        setLoadedCount(5);
    }, [searchTerm]);

    // Observe last blog for infinite scrolling
    const lastBlogRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetching || loadedCount >= blogs.length) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        loadMoreBlogs();
                    }
                },
                { rootMargin: "100px", threshold: 0.5 }
            );

            if (node) observer.current.observe(node);
        },
        [loadMoreBlogs, isFetching, loadedCount, blogs.length]
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <Appbar />
                <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {[...Array(3)].map((_, index) => (
                            <BlogSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Appbar />
            <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    <div className="text-center space-y-2 mb-2">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                            Latest Articles
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore the latest insights, tutorials, and developments in software engineering.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:gap-8">
                        {visibleBlogs.map((blog, index) => (
                            <div
                                key={blog.id}
                                ref={index === visibleBlogs.length - 1 ? lastBlogRef : null}
                            >
                                <BlogCard
                                    id={blog.id}
                                    authorName={blog.author?.name || "Anonymous"}
                                    title={blog.title}
                                    content={blog.content}
                                    publishedDate={formatDate(blog.publishedDate)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Show loading effect while fetching more blogs */}
                    {isFetching && (
                        <div className="mt-6 space-y-4">
                            {[...Array(2)].map((_, index) => (
                                <BlogSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {/* Show "No more blogs" message when all blogs are loaded */}
                    {!isFetching && loadedCount >= blogs.length && (
                        <div className="text-center text-gray-500 mt-6">
                            🎉 You have reached the end! No more blogs to load.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};