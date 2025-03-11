import { createBlogInput, updateBlogInput } from "@lalitdev/blog-zodauth";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "You are not logged in",
      });
    }
  } catch (e) {
    c.status(403);
    return c.json({
      message: "You are not logged in",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: Number(authorId),
      publishedDate: new Date(), // Add current date when creating blog
    },
  });

  return c.json({
    id: blog.id,
    publishedDate: blog.publishedDate, // Return publishedDate in response
  });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.blog.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({
    id: blog.id,
  });
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogs = await prisma.blog.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      publishedDate: true, 
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      publishedDate: 'desc' 
    }
  });

  return c.json({
    blogs,
  });
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        title: true,
        content: true,
        publishedDate: true, // Add publishedDate to selection
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return c.json({
      blog,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while fetching blog post",
    });
  }
});
blogRouter.get("/author/:authorId", async (c) => {
  const authorId = c.req.param("authorId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const authorWithBlogs = await prisma.user.findUnique({
      where: {
        id: Number(authorId)
      },
      select: {
        id: true,
        name: true,
        blogs: {
          select: {
            id: true,
            title: true,
            content: true,
            publishedDate: true,
          },
          orderBy: {
            publishedDate: 'desc'
          },
          take: 5  // Get only the 5 most recent blogs
        },
        _count: {
          select: {
            blogs: true
          }
        }
      }
    });

    if (!authorWithBlogs) {
      c.status(404);
      return c.json({
        message: "Author not found"
      });
    }

    return c.json({
      author: {
        id: authorWithBlogs.id,
        name: authorWithBlogs.name,
        totalBlogs: authorWithBlogs._count.blogs,
        recentBlogs: authorWithBlogs.blogs
      }
    });

  } catch (e) {
    c.status(500);
    return c.json({
      message: "Error while fetching author details"
    });
  }
});

// Admin Api's below

blogRouter.delete("/delete/:id", async (c) => {
  const id = c.req.param("id");
  const authHeader = c.req.header("authorization") || "";

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const payload = await verify(authHeader, c.env.JWT_SECRET);
    const isAdmin = payload.isAdmin || false;

    if (!isAdmin) {
      c.status(403);
      return c.json({
        message: "You are not an admin. Only admins can delete blog posts.",
      });
    }

    await prisma.blog.delete({
      where: {
        id: Number(id),
      },
    });

    return c.json({
      message: "Blog deleted successfully by admin",
    });
  } catch (e) {
    c.status(500);
    return c.json({
      message: "Error while deleting blog post",
    });
  }
});

blogRouter.get("/admin/data", async (c) => {
  const authHeader = c.req.header("authorization") || "";
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const payload = await verify(authHeader, c.env.JWT_SECRET);
    const isAdmin = payload.isAdmin || false;

    if (!isAdmin) {
      c.status(403);
      return c.json({
        message: "Only admins can access this data",
      });
    }

    const data = await prisma.user.findMany({
      include: {
        blogs: {
          select: {
            id: true,
            title: true,
            content: true,
            published: true,
            publishedDate: true,
          },
          orderBy: {
            publishedDate: 'desc'
          }
        },
        _count: {
          select: {
            blogs: true
          }
        }
      }
    });

    const formattedData = data.map(user => ({
      id: user.id,
      name: user.name,
      username: user.username,
      totalBlogs: user._count.blogs,
      blogs: user.blogs
    }));

    return c.json({
      users: formattedData
    });

  } catch (e) {
    c.status(500);
    return c.json({
      message: "Error while fetching data"
    });
  }
});

blogRouter.get("/admin/search", async (c) => {
  const query = c.req.query("query");
  const authHeader = c.req.header("authorization") || "";
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const payload = await verify(authHeader, c.env.JWT_SECRET);
    const isAdmin = payload.isAdmin || false;

    if (!isAdmin) {
      c.status(403);
      return c.json({
        message: "Only admins can access this data",
      });
    }

    const searchConditions: any[] = [];

    // Add numeric search if query is a number
    if (query && !isNaN(Number(query))) {
      searchConditions.push(
        { id: Number(query) },
        { blogs: { some: { id: Number(query) } } }
      );
    }

    // Add text search conditions
    if (query) {
      searchConditions.push(
        {
          username: {
            contains: query,
            mode: 'insensitive' as const
          }
        },
        {
          name: {
            contains: query,
            mode: 'insensitive' as const
          }
        }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        OR: searchConditions.length > 0 ? searchConditions : undefined
      },
      include: {
        blogs: {
          orderBy: {
            publishedDate: 'desc'
          }
        },
        _count: {
          select: {
            blogs: true
          }
        }
      }
    });

    return c.json({
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        username: user.username,
        totalBlogs: user._count.blogs,
        blogs: user.blogs
      }))
    });

  } catch (e) {
    c.status(500);
    return c.json({
      message: "Error while searching"
    });
  }
});