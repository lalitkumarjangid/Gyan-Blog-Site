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

    const loadMoreBlogs = useCallback(() => {
        if (isFetching || loadedCount >= filteredBlogs.length) return;
        setIsFetching(true);
        setTimeout(() => {
            setLoadedCount((prev) => Math.min(prev + 5, filteredBlogs.length));
            setIsFetching(false);
        }, 1000);
    }, [filteredBlogs.length, isFetching, loadedCount]);

    useEffect(() => {
        if (!loading && filteredBlogs.length > 0) {
            setVisibleBlogs(filteredBlogs.slice(0, loadedCount));
        }
    }, [filteredBlogs, loading, loadedCount]);

    useEffect(() => {
        setLoadedCount(5);
    }, [searchTerm]);

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
                { rootMargin: "150px", threshold: 0.2 }
            );

            if (node) observer.current.observe(node);
        },
        [loadMoreBlogs, isFetching, loadedCount, blogs.length]
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                <Appbar />
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[...Array(4)].map((_, index) => (
                            <BlogSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Appbar />
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="space-y-8">
                    <div className="text-center space-y-4 mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                            Discover Amazing Articles
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Dive into a world of insights, tutorials, and tech discoveries. 
                            Stay updated with the latest in software engineering.
                        </p>
                        <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {visibleBlogs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-600">No articles found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {visibleBlogs.map((blog, index) => (
                                <div
                                    key={blog.id}
                                    ref={index === visibleBlogs.length - 1 ? lastBlogRef : null}
                                    className="transform transition-all duration-300 hover:scale-102 hover:shadow-lg"
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
                    )}

                    {isFetching && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[...Array(2)].map((_, index) => (
                                <BlogSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {!isFetching && loadedCount >= blogs.length && visibleBlogs.length > 0 && (
                        <div className="text-center py-8">
                            <div className="inline-block px-6 py-3 bg-blue-50 rounded-full shadow-sm">
                                <span className="text-blue-600 font-medium">
                                    🎉 You've caught up! No more articles to load
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};