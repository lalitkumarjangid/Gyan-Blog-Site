import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import "../App.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface MiniBlog {
  id: string;
  title: string;
  publishedDate: string;
}

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const [authorBlogs, setAuthorBlogs] = useState<MiniBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const [token] = useState<string>(localStorage.getItem("token") || "");

  useEffect(() => {
    const fetchAuthorBlogs = async () => {
      if (!blog.author?.id) {
        // console.log("No author ID available");
        return;
      }

      try {
        setIsLoading(true);
        // console.log("Fetching blogs for author:", blog.author.id);

        const response = await axios.get(
          `${BACKEND_URL}/api/v1/blog/author/${blog.author.id}?limit=6`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("Backend response:", response.data);

        const recentBlogs = response.data.author.recentBlogs
          .filter(
            (authorBlog: MiniBlog) => authorBlog.id !== blog.id.toString()
          )
          .slice(0, 6);

        // console.log("Filtered blogs:", recentBlogs);
        setAuthorBlogs(recentBlogs);
      } catch (error) {
        // console.error("Failed to fetch author blogs:", error);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // console.log("Unauthorized access, redirecting to login...");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchAuthorBlogs();
    }
  }, [blog.author?.id, blog.id, token]);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <Appbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {blog.title || "Untitled Post"}
            </h1>

            {/* Author Info - Mobile */}
            <div className="md:hidden space-y-4">
              <div className="flex items-center gap-3">
                <Avatar size="small" name={blog.author?.name || "N/A"} />
                <div>
                  <span className="text-gray-900 font-medium">
                    {blog.author?.name || "N/A"}
                  </span>
                  <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <span>📅{formatDate(blog.publishedDate)}</span>
                    {readingTime() && (
                      <>
                        <span>•</span>
                        <span>⏱️{readingTime()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Author Info - Desktop */}
            <div className="hidden md:flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <Avatar size="small" name={blog.author?.name || "N/A"} />
                <div>
                  <span className="text-gray-900 font-medium">
                    {blog.author?.name || "N/A"}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">
                    Published on 📅{formatDate(blog.publishedDate)}
                  </div>
                </div>
              </div>
              {readingTime() && (
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-lg">⏱️</span>
                  <span>{readingTime()}</span>
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-8">
              <div className="prose prose-lg max-w-none">
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
                  components={{
                    h1: ({ ...props }) => (
                      <h1
                        className="text-3xl font-bold text-gray-900 mt-8 mb-4"
                        {...props}
                      />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        className="text-2xl font-bold text-gray-800 mt-6 mb-3"
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3
                        className="text-xl font-bold text-gray-800 mt-5 mb-2"
                        {...props}
                      />
                    ),
                    code: ({
                      inline,
                      className,
                      children,
                      ...props
                    }: {
                      inline?: boolean;
                      className?: string;
                      children?: React.ReactNode;
                    }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <pre className="bg-gray-80 rounded-lg p-4 my-4">
                          <code
                            className={`language-${match[1]} text-sm`}
                            {...props}
                          >
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code
                          className="bg-gray-100 rounded px-1.5 py-0.5 text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ ...props }) => (
                      <blockquote
                        className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700"
                        {...props}
                      />
                    ),
                  }}
                >
                  {blog.content || "No content available"}
                </ReactMarkdown>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-8 space-y-8">
                {/* Author Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    About the Author
                  </h2>
                  <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4">
                    <div className="rounded-full overflow-hidden">
                      <Avatar size="big" name={blog.author?.name || "N/A"} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {blog.author?.name || "N/A"}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Sharing insights and experiences through compelling
                        storytelling.
                      </p>
                    </div>
                  </div>
                </div>

                {/* More from Author */}
                {!isLoading && authorBlogs.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>More from this author</span>
                    </h2>
                    <div className="space-y-4">
                      {authorBlogs.map((authorBlog) => (
                        <Link
                          key={authorBlog.id}
                          to={`/blog/${authorBlog.id}`}
                          className="block group"
                        >
                          <article className="p-3 rounded-lg hover:bg-gray-50 transition-all">
                            <h3 className="text-gray-900 group-hover:text-blue-600 font-medium line-clamp-2">
                              {authorBlog.title}
                            </h3>
                            <time className="text-sm text-gray-500 mt-1 block">
                              📅{formatDate(authorBlog.publishedDate)}
                            </time>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <div className="space-y-4">
              <div className="text-2xl font-medium text-gray-900">
                Thanks for reading! 🙏
              </div>
              <p className="text-gray-600">
                ✨ If you enjoyed this article, consider sharing it with others
                ✨
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
