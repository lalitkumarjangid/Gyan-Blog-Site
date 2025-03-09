import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Recently';
        }

        // Create a date formatter with explicit timezone to ensure consistent display
        const formatter = new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Kolkata',
            hour12: false, // Ensure 24-hour format
            hour: undefined, // Don't show time
            minute: undefined,
            second: undefined
        });

        return formatter.format(date);
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Recently';
    }
};

export const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Appbar />
                <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {[...Array(5)].map((_, i) => (
                            <BlogSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const sortedBlogs = [...blogs].sort((a, b) => 
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Appbar />
            <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    <div className="text-center space-y-2 mb-2">
                        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                            Latest Articles
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore the latest insights, tutorials, and developments in software engineering
                        </p>
                    </div>
                    
                    <div className="grid gap-6 sm:gap-8">
                        {sortedBlogs.map(blog => (
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                authorName={blog.author?.name || "Anonymous"}
                                title={blog.title}
                                content={blog.content}
                                publishedDate={formatDate(blog.publishedDate)}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}