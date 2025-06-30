export const swaggerExamples = {
  scrapeUrlRequest: {
    url: "https://interviewing.io/blog",
    team_id: "aline123",
    user_id: "user123",
  },

  scrapeBulkRequest: {
    urls: [
      "https://interviewing.io/blog",
      "https://nilmamano.com/blog/category/dsa",
      "https://quill.co/blog",
    ],
    team_id: "aline123",
    user_id: "user123",
  },

  scrapedDataResponse: {
    team_id: "aline123",
    items: [
      {
        title: "How to Ace Technical Interviews",
        content: "# Introduction\n\nTechnical interviews can be challenging...",
        content_type: "blog",
        source_url:
          "https://interviewing.io/blog/how-to-ace-technical-interviews",
        author: "Jane Smith",
        user_id: "user123",
      },
      {
        title: "Data Structures and Algorithms Guide",
        content: "## Arrays\n\nArrays are fundamental data structures...",
        content_type: "guide",
        source_url: "https://nilmamano.com/blog/dsa-guide",
        author: "Nil Mamano",
        user_id: "user123",
      },
    ],
  },

  errorResponse: {
    error: "Validation failed",
    message: "URL is required and must be a string",
  },
};
