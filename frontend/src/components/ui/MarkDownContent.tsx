import { Components } from 'react-markdown';



export const markdownComponents: Components = {
  table: (props) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),

  thead: (props) => <thead className="bg-gray-50" {...props} />,

  th: (props) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
  ),

  td: (props) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" {...props} />
  ),

  code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
    return inline ? (
      <code className="px-1 py-0.5 bg-gray-100 rounded text-sm" {...props}>
        {children}
      </code>
    ) : (
      <div className="my-4">
        <pre className="block bg-gray-800 text-white rounded-lg p-4 overflow-x-auto">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  },

  h2: (props) => <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-800 border-b pb-2" {...props} />,

  h3: (props) => <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-700" {...props} />,

  p: (props) => <p className="text-gray-600 leading-relaxed mb-4" {...props} />,

  ul: (props) => <ul className="list-disc list-inside ml-4 mb-4 text-gray-600" {...props} />,

  li: (props) => <li className="mb-2" {...props} />,

  blockquote: (props) => (
    <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4 text-gray-600" {...props} />
  ),

  hr: (props) => <hr className="my-8 border-t-2 border-gray-100" {...props} />,

  strong: (props) => <strong className="font-semibold text-gray-800" {...props} />,
};

