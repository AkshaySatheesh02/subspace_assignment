const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 3000;

let blogData; // Define blogData at the top-level scope

app.get('/api/blog-stats', async (req, res) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    blogData = response.data; // Assign data to blogData

    const totalBlogs = blogData.blogs.length;
    const longestBlog = _.maxBy(blogData.blogs, 'title');
    const blogsWithPrivacy = _.filter(blogData.blogs, (blog) =>
      _.includes(_.toLower(blog.title), 'privacy')
    );
    const uniqueBlogTitles = _.uniqBy(blogData.blogs, 'title');

    const stats = {
      totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles: uniqueBlogTitles.map((blog) => blog.id),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Error fetching blog data' });
  }
});

app.get('/api/blog-search', async (req, res) => {
  
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    blogData = response.data; 
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "query" is required' });
  }

  if (!blogData) {
    // If blogData is not available yet, handle this scenario gracefully
    return res.status(500).json({ error: 'Blog data is not available' });
  }

  // Place your search logic here based on the query and blogData
  const filteredBlogs = _.filter(blogData.blogs, (blog) =>
    _.includes(_.toLower(blog.title), _.toLower(query))
  );

  res.json(filteredBlogs);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
