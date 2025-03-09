import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import "../App.css";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const formatDate = (dateString: string | undefined) => {
    try {
      if (!dateString) {
        return 'Just now';
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Just now';
      }

      // Use proper timezone handling
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Kolkata',
        hour12: true
      }).format(date);

    } catch (error) {
      // console.error('Date formatting error:', error);
      return 'Just now';
    }
  };

  const readingTime = () => {
    try {
      if (!blog.content) return '';
      
      const wordsPerMinute = 200;
      const words = blog.content.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} min read`;
    } catch (error) {
      return '';
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 px-4 md:px-10 w-full max-w-screen-xl pt-6 md:pt-12">
          <div className="md:col-span-8">
            <div className="text-3xl md:text-5xl font-extrabold">
              {blog.title || 'Untitled Post'}
            </div>

            {/* Author info for mobile */}
            <div className="flex items-center gap-3 mt-4 md:hidden">
              <Avatar size="small" name={blog.author?.name || "N/A"} />
              <span className="text-gray-700 font-medium">
                {blog.author?.name || "N/A"}
              </span>
            </div>

            <div className="text-slate-500 pt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25" />
                </svg>
                <span>{formatDate(blog.publishedDate)}</span>
              </div>
              {readingTime() && (
                <>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>{readingTime()}</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-6 md:pt-8 prose dark:prose-invert max-w-none">
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {blog.content || 'No content available'}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Author sidebar - hidden on mobile */}
          <div className="hidden md:block md:col-span-4 md:pl-8">
            <div className="sticky top-8">
              <div className="text-slate-600 text-lg font-medium">Author</div>
              <div className="flex w-full mt-4">
                <div className="pr-4 flex flex-col justify-center">
                  <Avatar
                    size="big"
                    name={blog.author?.name || "N/A"}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-900">
                    {blog.author?.name || "N/A"}
                  </div>
                  <div className="pt-2 text-slate-500 text-sm">
                    Sharing insights and experiences through compelling storytelling
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};