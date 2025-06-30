// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Label } from "@/components/ui/label";
// import { Upload, Globe, FileText, Loader2 } from "lucide-react";
// import Markdown from "react-markdown";

// interface ScrapedItem {
//   title: string;
//   content: string;
//   content_type: string;
//   source_url?: string;
//   author: string;
//   user_id: string;
// }

// interface ScrapedData {
//   team_id: string;
//   items: ScrapedItem[];
// }

// export default function WebScraperApp() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [results, setResults] = useState<ScrapedData | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // URL Scraping
//   const [blogUrl, setBlogUrl] = useState("");
//   const [teamId, setTeamId] = useState("aline123");
//   const [userId, setUserId] = useState("user123");

//   // PDF Upload
//   const [pdfFile, setPdfFile] = useState<File | null>(null);

//   // Bulk URLs
//   const [bulkUrls, setBulkUrls] = useState("");

//   const handleUrlScrape = async () => {
//     if (!blogUrl.trim()) return;

//     setIsLoading(true);
//     setError(null);
//     setResults(null);

//     try {
//       const response = await fetch("http://localhost:3001/api/scrape-url", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           url: blogUrl,
//           team_id: teamId,
//           user_id: userId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setResults(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePdfUpload = async () => {
//     if (!pdfFile) return;

//     setIsLoading(true);
//     setError(null);
//     setResults(null);

//     try {
//       const formData = new FormData();
//       formData.append("pdf", pdfFile);
//       formData.append("team_id", teamId);
//       formData.append("user_id", userId);

//       const response = await fetch("http://localhost:3001/api/scrape-pdf", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setResults(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleBulkScrape = async () => {
//     if (!bulkUrls.trim()) return;

//     setIsLoading(true);
//     setError(null);
//     setResults(null);

//     try {
//       const urls = bulkUrls.split("\n").filter((url) => url.trim());

//       const response = await fetch("http://localhost:3001/api/scrape-bulk", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           urls,
//           team_id: teamId,
//           user_id: userId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setResults(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-4xl">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">Knowledge Base Scraper</h1>
//         <p className="text-gray-600">
//           Import technical content from blogs, PDFs, and other sources into your
//           knowledge base
//         </p>
//       </div>

//       {/* Configuration */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Configuration</CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="team-id">Team ID</Label>
//             <Input
//               id="team-id"
//               value={teamId}
//               onChange={(e) => setTeamId(e.target.value)}
//               placeholder="aline123"
//             />
//           </div>
//           <div>
//             <Label htmlFor="user-id">User ID</Label>
//             <Input
//               id="user-id"
//               value={userId}
//               onChange={(e) => setUserId(e.target.value)}
//               placeholder="user123"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       <Tabs defaultValue="single-url" className="mb-6">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="single-url">Single URL</TabsTrigger>
//           <TabsTrigger value="pdf-upload">PDF Upload</TabsTrigger>
//           <TabsTrigger value="bulk-urls">Bulk URLs</TabsTrigger>
//         </TabsList>

//         <TabsContent value="single-url">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Globe className="h-5 w-5" />
//                 Scrape Single URL
//               </CardTitle>
//               <CardDescription>
//                 Enter a blog URL or website to scrape content from
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="blog-url">Blog/Website URL</Label>
//                 <Input
//                   id="blog-url"
//                   value={blogUrl}
//                   onChange={(e) => setBlogUrl(e.target.value)}
//                   placeholder="https://interviewing.io/blog"
//                 />
//               </div>
//               <Button
//                 onClick={handleUrlScrape}
//                 disabled={isLoading || !blogUrl.trim()}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Scraping...
//                   </>
//                 ) : (
//                   "Scrape Content"
//                 )}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="pdf-upload">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <FileText className="h-5 w-5" />
//                 Upload PDF
//               </CardTitle>
//               <CardDescription>
//                 Upload a PDF file to extract and chunk content
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="pdf-file">PDF File</Label>
//                 <Input
//                   id="pdf-file"
//                   type="file"
//                   accept=".pdf"
//                   onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
//                 />
//               </div>
//               <Button
//                 onClick={handlePdfUpload}
//                 disabled={isLoading || !pdfFile}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="mr-2 h-4 w-4" />
//                     Process PDF
//                   </>
//                 )}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="bulk-urls">
//           <Card>
//             <CardHeader>
//               <CardTitle>Bulk URL Scraping</CardTitle>
//               <CardDescription>
//                 Enter multiple URLs (one per line) to scrape content from
//                 multiple sources
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="bulk-urls">URLs (one per line)</Label>
//                 <Textarea
//                   id="bulk-urls"
//                   value={bulkUrls}
//                   onChange={(e) => setBulkUrls(e.target.value)}
//                   placeholder={`https://interviewing.io/blog
//                                 https://nilmamano.com/blog/category/dsa
//                                 https://quill.co/blog`}
//                   rows={6}
//                 />
//               </div>
//               <Button
//                 onClick={handleBulkScrape}
//                 disabled={isLoading || !bulkUrls.trim()}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Scraping...
//                   </>
//                 ) : (
//                   "Scrape All URLs"
//                 )}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Error Display */}
//       {error && (
//         <Card className="mb-6 border-red-200 bg-red-50">
//           <CardContent className="pt-6">
//             <p className="text-red-600">Error: {error}</p>
//           </CardContent>
//         </Card>
//       )}

//       {/* Results Display */}
//       {results && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Scraped Content</CardTitle>
//             <CardDescription>
//               Found {results.items.length} items for team: {results.team_id}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {results.items.map((item, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="font-semibold text-lg">{item.title}</h3>
//                     <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                       {item.content_type}
//                     </span>
//                   </div>
//                   {item.author && (
//                     <p className="text-sm text-gray-600 mb-2">
//                       By: {item.author}
//                     </p>
//                   )}
//                   {item.source_url && (
//                     <p className="text-sm text-blue-600 mb-2">
//                       <a
//                         href={item.source_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {item.source_url}
//                       </a>
//                     </p>
//                   )}
//                   <div className="bg-gray-50 p-3 rounded text-sm max-h-40 overflow-y-auto">
//                     <pre className="whitespace-pre-wrap">
//                       <Markdown>{item.content.substring(0, 500)}... </Markdown>
//                     </pre>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Download JSON */}
//             <div className="mt-6 pt-4 border-t">
//               <Button
//                 onClick={() => {
//                   const blob = new Blob([JSON.stringify(results, null, 2)], {
//                     type: "application/json",
//                   });
//                   const url = URL.createObjectURL(blob);
//                   const a = document.createElement("a");
//                   a.href = url;
//                   a.download = `scraped-content-${Date.now()}.json`;
//                   a.click();
//                   URL.revokeObjectURL(url);
//                 }}
//               >
//                 Download JSON
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

import { WebScraperLayout } from "@/layout/WebScrapper";

export default function HomePage() {
  return <WebScraperLayout />;
}
