/** @type {import('next').NextConfig} */
const allowedHost = process.env.NEXT_PUBLIC_DOMAIN_URL
const nextConfig = {
  images: {
    domains: [allowedHost], 
  },
  async rewrites() {
    return {
      beforeFiles: [
        // ✅ Courses
        {
          source: "/api/courses",
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses?_format=json`,
        },
        {
          source: "/api/course-search-detail/:id",
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/course-search-detail/:id?_format=json`,
        },
        {
          source: "/api/course-search/:brand",
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/course-search/:brand?_format=json`,
        },

        // ✅ News
        {
          source: "/api/news/:siteUrl",
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/news/:siteUrl?_format=json`,
        },

        // ✅ Paragraphs
        {
          source: "/api/paragraph/:id",
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/paragraph-api/:id?_format=json`,
        },

        // ✅ Menus
        {
          source: "/api/menu/:slug",
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/menu_items/:slug?_format=json`,
        },

        // ✅ Partners
        {
          source: "/api/partners",
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partners?_format=json`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
