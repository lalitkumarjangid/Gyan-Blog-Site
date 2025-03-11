import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import "../App.css";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Just now"
      : new Intl.DateTimeFormat("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "Asia/Kolkata",
          hour12: true,
        }).format(date);
  };

  const readingTime = () => {
    if (!blog.content) return "";
    const wordsPerMinute = 200;
    const words = blog.content.trim().split(/\s+/).length;
    return `${Math.ceil(words / wordsPerMinute)} min read`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Appbar />
      <div className="flex-grow">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-12 px-4 md:px-10 w-full max-w-screen-xl pt-6 md:pt-12">
            <div className="md:col-span-8">
              <h1 className="text-3xl md:text-5xl font-extrabold">
                {blog.title || "Untitled Post"}
              </h1>

              {/* Mobile Author Info */}
              <div className="flex items-center gap-3 mt-4 md:hidden">
                <Avatar size="small" name={blog.author?.name || "N/A"} />
                <span className="text-gray-700 font-medium">
                  {blog.author?.name || "N/A"}
                </span>
              </div>

              <div className="text-gray-500 pt-3 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  📅 <span>{formatDate(blog.publishedDate)}</span>
                </div>
                {readingTime() && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1">
                      ⏳ <span>{readingTime()}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Blog Content */}
              <div className="pt-6 md:pt-8 prose dark:prose-invert max-w-none markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[
                    rehypeRaw,
                    [
                      rehypeSanitize,
                      {
                        allowElements: [
                          "h1",
                          "h2",
                          "h3",
                          "h4",
                          "h5",
                          "h6",
                          "p",
                          "ul",
                          "ol",
                          "li",
                          "blockquote",
                          "strong",
                          "em",
                          "del",
                          "a",
                          "img",
                          "pre",
                          "code",
                          "table",
                          "thead",
                          "tbody",
                          "tr",
                          "th",
                          "td",
                          "hr",
                          "br",
                          "div",
                          "span",
                          "summary",
                          "details",
                        ],
                        allowAttributes: {
                          "*": ["class", "id", "style"],
                          a: ["href", "target", "rel"],
                          img: ["src", "alt", "title"],
                          code: ["class", "language"],
                          pre: ["class", "language"],
                        },
                      },
                    ],
                  ]}
                  components={
                    {
                      // ... existing markdown components ...
                    }
                  }
                >
                  {blog.content || "No content available"}
                </ReactMarkdown>
              </div>
            </div>

            {/* Sidebar - Author Info */}
            <div className="hidden md:block md:col-span-4 md:pl-8">
              <div className="sticky top-8">
                <h2 className="text-gray-600 text-lg font-medium">Author</h2>
                <div className="flex w-full mt-4">
                  <div className="pr-4 flex flex-col justify-center">
                    <Avatar size="big" name={blog.author?.name || "N/A"} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {blog.author?.name || "N/A"}
                    </h3>
                    <p className="pt-2 text-gray-500 text-sm">
                      Sharing insights and experiences through compelling
                      storytelling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 md:px-10 py-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2 text-2xl">
              <span>Thanks for reading!</span>
              <span role="img" aria-label="folded hands">
                🙏
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span role="img" aria-label="sparkles">
                ✨
              </span>
              <span>Don't forget to share if you enjoyed this article</span>
              <span role="img" aria-label="sparkles">
                ✨
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
