# Postman Documentation Setup Guide

## Quick Start

1. **Import Collection**

   - Open Postman
   - Click "Import" button
   - Select `postman/Web-Scraper-API.postman_collection.json`

2. **Import Environment**

   - Import `postman/Web-Scraper-API.postman_environment.json`
   - Select the environment from dropdown

3. **Start Testing**
   - All requests use environment variables
   - Ready to test immediately

## Features Included

### 📁 **Organized Structure**

- Health & Info endpoints
- Content Scraping endpoints
- Logical grouping and descriptions

### 🔧 **Environment Variables**

- `{{baseUrl}}` - API base URL
- `{{teamId}}` - Team identifier
- `{{userId}}` - User identifier

### 📝 **Rich Documentation**

- Detailed descriptions for each endpoint
- Parameter explanations
- Feature lists and limitations
- Processing workflows

### 🧪 **Example Responses**

- Success scenarios with real data
- Error responses with proper status codes
- Multiple response examples per endpoint

### 🎯 **Ready-to-Use Requests**

- Pre-filled request bodies
- Proper headers set
- File upload examples

## Publishing Documentation

### Option 1: Postman Public Documentation

1. Right-click collection → "Publish Docs"
2. Configure settings and publish
3. Get shareable URL

### Option 2: Team Workspace

1. Create team workspace
2. Share collection with team
3. Collaborate in real-time

### Option 3: Export for External Use

1. Export collection as JSON
2. Share with external developers
3. They can import and use immediately

## Advanced Features

### Pre-request Scripts

\`\`\`javascript
// Auto-generate team ID
pm.environment.set("teamId", pm.variables.replaceIn("{{$randomUUID}}"));

// Set timestamp
pm.environment.set("timestamp", new Date().toISOString());
\`\`\`

### Test Scripts

\`\`\`javascript
// Validate response
pm.test("Status code is 200", function () {
pm.response.to.have.status(200);
});

pm.test("Response has items", function () {
const jsonData = pm.response.json();
pm.expect(jsonData.items).to.be.an('array');
pm.expect(jsonData.items.length).to.be.greaterThan(0);
});
\`\`\`

### Dynamic Variables

- `{{$randomUUID}}` - Generate random UUID
- `{{$timestamp}}` - Current timestamp
- `{{$randomInt}}` - Random integer

## Benefits Over Swagger

✅ **Easier Setup** - No YAML/JSON syntax learning
✅ **Better Testing** - Built-in test runner and scripts  
✅ **Team Collaboration** - Real-time sharing and comments
✅ **Rich Examples** - Multiple response examples with real data
✅ **Environment Management** - Easy switching between dev/prod
✅ **Visual Appeal** - Professional, customizable documentation
✅ **Export Options** - Multiple sharing and export formats

## Maintenance Tips

1. **Keep Examples Updated** - Update response examples when API changes
2. **Use Variables** - Leverage environment variables for flexibility
3. **Add Tests** - Include validation scripts for automated testing
4. **Document Changes** - Update descriptions when endpoints change
5. **Version Control** - Export and commit collection files to git
