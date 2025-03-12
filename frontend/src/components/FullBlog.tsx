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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
              <div className="md:hidden">
                <div className="flex items-center gap-3 mt-4">
                  <Avatar size="small" name={blog.author?.name || "N/A"} />
                  <span className="text-gray-700 font-medium">
                    {blog.author?.name || "N/A"}
                  </span>
                </div>

                <div className="text-gray-500 pt-3 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">📅</span>
                    <span>{formatDate(blog.publishedDate)}</span>
                  </div>
                  {readingTime() && (
                    <>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">⏳</span>
                        <span>{readingTime()}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* More from Author Button & Dropdown */}
                {!isLoading && authorBlogs.length > 0 && (
                  <div className="relative mt-4">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2.5 rounded-xl shadow-md transition-all duration-200"
                    >
                      📚 More from {blog.author?.name}
                      <span
                        className={`transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {/* Dropdown Content */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-80 overflow-y-auto">
                        {authorBlogs.map((authorBlog) => (
                          <Link
                            key={authorBlog.id}
                            to={`/blog/${authorBlog.id}`}
                            className="block group"
                          >
                            <article className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                              <h3 className="text-gray-900 group-hover:text-blue-600 font-medium line-clamp-2">
                                {authorBlog.title}
                              </h3>
                              <time className="text-sm text-gray-500 mt-1 block">
                                {formatDate(authorBlog.publishedDate)}
                              </time>
                            </article>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="pt-6 md:pt-8 prose dark:prose-invert max-w-none markdown-content">
                <div className="text-gray-500 pt-3 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">📅</span>
                    <span>{formatDate(blog.publishedDate)}</span>
                  </div>
                  {readingTime() && (
                    <>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">⏳</span>
                        <span>{readingTime()}</span>
                      </div>
                    </>
                  )}
                </div>
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
                    h1: ({ node, ...props }) => (
                      <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
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
                        <pre
                          className={`language-${match[1]} bg-gray-800 p-4 rounded-lg`}
                        >
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code
                          className="bg-gray-100 dark:bg-gray-800 rounded px-1"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ node, ...props }) => (
                      <pre
                        className="bg-gray-800 p-4 rounded-lg overflow-x-auto"
                        {...props}
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <table
                        className="min-w-full border-collapse my-4"
                        {...props}
                      />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="border border-gray-300 px-4 py-2 bg-gray-100"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="border border-gray-300 px-4 py-2"
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-gray-300 pl-4 italic my-4"
                        {...props}
                      />
                    ),
                  }}
                >
                  {blog.content || "No content available"}
                </ReactMarkdown>
              </div>
            </div>

            {/* Sidebar - Author Info and Related Posts */}
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

                {/* Author's Top 5 Blogs */}
                {!isLoading && authorBlogs.length > 0 && (
                  <div className="mt-8 border-t pt-6">
                    <h2 className="text-gray-600 text-xl font-semibold mb-6 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      More from {blog.author?.name}
                    </h2>
                    <div className="space-y-3">
                      {authorBlogs.map((authorBlog) => (
                        <Link
                          key={authorBlog.id}
                          to={`/blog/${authorBlog.id}`}
                          className="block group"
                        >
                          <article className="p-4 rounded-xl hover:bg-gray-50 border border-gray-100 transition-all duration-200 hover:shadow-sm hover:border-gray-200">
                            <div className="flex items-center justify-between">
                              <h3 className="text-gray-900 group-hover:text-blue-600 transition-colors duration-200 font-medium line-clamp-1 flex-1">
                                {authorBlog.title}
                              </h3>
                              <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                            <time className="text-sm text-gray-500 mt-2 items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {formatDate(authorBlog.publishedDate)}
                            </time>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
