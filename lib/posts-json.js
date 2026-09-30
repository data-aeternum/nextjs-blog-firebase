// Import the Node.js file-system module.
import fs from 'fs'; // Read the JSON file from disk during server-side generation.
// Import the Node.js path module.
import path from 'path'; // Build a platform-independent path to the data file.
// Define the absolute path to the JSON data file.
const postsFilePath = path.join(process.cwd(), 'data', 'posts.json'); // Resolve the data file from the project root.
// Read and parse every post from the JSON data file.
function readPosts() { // Keep file access in one shared helper.
  // Read the JSON file as UTF-8 text.
  const fileContents = fs.readFileSync(postsFilePath, 'utf8'); // Store the file contents as a string.
  // Convert the JSON text into JavaScript objects.
  return JSON.parse(fileContents); // Return the parsed post records.
} // Finish the readPosts helper.
// Return all posts sorted from newest to oldest.
export function getSortedPostsData() { // Define the sorted-posts data function.
  // Read a fresh copy of the post records.
  const allPostsData = readPosts(); // Store the records before sorting them.
  // Sort posts by their ISO-formatted date.
  return allPostsData.sort((firstPost, secondPost) => { // Compare each pair of posts.
    // Put the newer date before the older date.
    return firstPost.date < secondPost.date ? 1 : -1; // Return the sort order for the pair.
  }); // Finish sorting and return the records.
} // Finish the getSortedPostsData function.
// Return the route parameters for every post.
export function getAllPostIds() { // Define the dynamic-route data function.
  // Read all post records from the JSON file.
  const allPostsData = readPosts(); // Store the records used to create routes.
  // Convert each post ID into the shape required by getStaticPaths.
  return allPostsData.map((post) => { // Create one route object per post.
    // Return the dynamic route parameter for this post.
    return { params: { id: post.id } }; // Supply the post ID to the route.
  }); // Finish creating the route list.
} // Finish the getAllPostIds function.
// Return one post matching the requested ID.
export function getPostData(id) { // Define the single-post data function.
  // Read all post records from the JSON file.
  const allPostsData = readPosts(); // Store the records used for the lookup.
  // Find the post whose ID matches the requested route.
  const postData = allPostsData.find((post) => post.id === id); // Store the matching post.
  // Return the matching post or throw a clear error for invalid data.
  if (!postData) { // Check whether the requested post exists.
    throw new Error(`Post not found: ${id}`); // Stop generation when an ID is invalid.
  } // Finish the missing-post check.
  // Return the complete JSON record.
  return postData; // Provide the post data to the page.
} // Finish the getPostData function.