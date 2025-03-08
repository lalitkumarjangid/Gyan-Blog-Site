import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if (loading) {
        return <div>
            <Appbar /> 
            <div className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    // Sort blogs by publishedDate in descending order (newest first)
    const sortedBlogs = [...blogs].sort((a, b) => 
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );

    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div>
                {sortedBlogs.map(blog => <BlogCard
                    key={blog.id}
                    id={blog.id}
                    authorName={blog.author?.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={new Date(blog.publishedDate).toLocaleDateString()}
                />)}
            </div>
        </div>
    </div>
}