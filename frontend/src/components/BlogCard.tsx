import { Link } from "react-router-dom";

interface BlogCardProps {
  id: number;
  authorName: string;
  title: string;
  content: React.ReactNode;
  publishedDate: string;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // console.warn('Invalid date string:', dateString);
        return "";
      }

      const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(istDate);
    } catch (error) {
      // console.error('Date formatting error:', error);
      return "";
    }
  };

  const calculateReadTime = (content: React.ReactNode): string => {
    if (typeof content !== "string") return "1 min read";
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const truncateContent = (content: React.ReactNode): string => {
    if (typeof content !== "string") return "";

    const withoutHtml = content.replace(/<[^>]*>/g, "");

    const withoutHeadings = withoutHtml.replace(/#{1,6}\s+/g, "");

    const withoutLinks = withoutHeadings.replace(
      /\[([^\]]+)\]\([^)]+\)/g,
      "$1"
    );

    const withoutEntities = withoutLinks
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    const withoutCodeBlocks = withoutEntities.replace(/```[\s\S]*?```/g, "");

    const withoutInlineCode = withoutCodeBlocks.replace(/`([^`]+)`/g, "$1");

    const withoutFormatting = withoutInlineCode
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_([^_]+)_/g, "$1");

    const cleanSpaces = withoutFormatting
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ");

    const maxLength = 150;
    const cleanText = cleanSpaces.trim();

    return cleanText.length > maxLength
      ? cleanText.slice(0, maxLength).trim() + "..."
      : cleanText;
  };

  return (
    <Link to={`/blog/${id}`} className="block">
      <article className="p-6 border-b border-slate-200 hover:bg-slate-50 transition-all duration-200">
        <div className="flex items-center space-x-3">
          <Avatar name={authorName} />
          <div className="flex items-center space-x-3">
            <span className="font-medium text-gray-700">{authorName}</span>
            <Circle />
            {publishedDate && (
              <div className="text-slate-500 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25"
                  />
                </svg>
                <span className="text-sm">{formatDate(publishedDate)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {title}
          </h2>
          <p className="text-slate-600 line-clamp-2 font-normal">
            {truncateContent(content)}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span className="text-sm font-normal">
            {calculateReadTime(content)}
          </span>
        </div>
      </article>
    </Link>
  );
};

export function Circle() {
  return <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />;
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name[0].toUpperCase();
  };

  return (
    <div
      className={`
            relative inline-flex items-center justify-center 
            overflow-hidden bg-gradient-to-br from-gray-700 to-gray-600 
            rounded-full shadow-sm
            ${size === "small" ? "w-8 h-8" : "w-12 h-12"}
        `}
    >
      <span
        className={`
                ${size === "small" ? "text-sm" : "text-base"} 
                font-medium text-white
            `}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}
