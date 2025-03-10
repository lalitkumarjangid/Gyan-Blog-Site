# Gyan Blog

Gyan Blog is a modern, performant, and scalable blog platform built with React JS, Tailwind CSS, ShadCN, Acertinity UI, Hono, and deployed on Cloudflare. This project aims to provide a seamless and intuitive blogging experience with a clean and responsive design.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **React JS**: Modern JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **ShadCN**: Shadow DOM components for encapsulated styles
- **Acertinity UI**: Custom UI components for a unique look and feel
- **Hono**: Lightweight web framework for handling backend logic
- **Cloudflare**: Fast, secure, and reliable deployment platform

## Installation

To get started with Gyan Blog, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/lalitkumarjangid/gyan-blog-site.git
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**: Create a `.env` file in the root directory and add necessary environment variables.

4. **Start the development server**:
    ```bash
    cd server
    wrangler dev src/index.ts
    ```
5.  **Start the Fronted**
    ```bash
    cd client
    npm run dev
    ``    

## Usage

Once the development server is running, you can access the blog at `http://localhost:3000`. You can customize the blog by modifying the components in the `src` directory.

### Building for Production

To build the project for production, run:
```bash
npm run build
```

## Folder Structure

```plaintext
Gyan Blog/
├── blog-backend/       # Backend application
│   ├── .wrangler/      # Cloudflare Workers configuration
│   ├── node_modules/   # Backend dependencies
│   ├── prisma/         # Prisma database setup
│   ├── src/            # Backend source code
│   │   ├── routes/     # API routes
│   │   │   ├── index.ts # Main backend routes file
│   ├── .env            # Environment variables
│   ├── package.json    # Backend dependencies and scripts
│   ├── tsconfig.json   # TypeScript configuration
│   ├── wrangler.toml   
│
├── common/             # Shared utilities and modules
│   ├── dist/           # Compiled shared modules
│   ├── src/            # Shared source code
│   ├── package.json    # Dependencies for common utilities
│
├── frontend/           # Frontend application
│   ├── dist/           # Compiled frontend code
│   ├── node_modules/   # Frontend dependencies
│   ├── public/         # Static assets
│   ├── src/            # Frontend source code
│   │   ├── assets/     # Static files like images and icons
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions and API logic
│   │   ├── pages/      # Page-based routing (React.js style)
│   ├── index.html      # Main HTML file
│   ├── package.json    # Frontend dependencies and scripts
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── vite.config.ts  # Vite configuration
│   ├── tsconfig.json   # TypeScript configuration
│
├── README.md           # Project documentation
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Create a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
