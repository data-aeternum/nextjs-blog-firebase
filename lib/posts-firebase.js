// Import the firebase app instance
import { db } from './firebase'; // load from firebase.js in same dir
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';// Firestore functions used below.

// Get all posts for the home page, sorted newest first.
export async function getSortedPostsData() { // Called by getStaticProps in index.js.
    // Fetch every document in the posts collection.
    const snapshot = await getDocs(collection(db, 'posts')); // Wait for Firestore.
    // Turn each document into a plain post object.
    const allPostsData = snapshot.docs.map((postDoc) => { // Loop over every document.
        // Read this document's fields.
        const data = postDoc.data(); // Gives { title, date, author, contentHtml }.
        // Return only what the home page needs.
        return { id: postDoc.id, title: data.title, date: data.date }; // One list item.
    }); // End of the map.
    // Sort so the newest date comes first.
    return allPostsData.sort((a, b) => { // Compare two posts at a time.
        // Return 1 to move a after b, or -1 to keep a first.
        return a.date < b.date ? 1 : -1; // Same sort you wrote last week.
    }); // End of the sort.
} // End of getSortedPostsData.

// Get the list of post IDs so Next.js knows which pages to build.
export async function getAllPostIds() { // Called by getStaticPaths in [id].js.
    // Fetch every document in the posts collection.
    const snapshot = await getDocs(collection(db, 'posts')); // Wait for Firestore.
    // Turn each document into the route shape Next.js requires.
    return snapshot.docs.map((postDoc) => { // Loop over every document.
        // Return one route object for this post.
        return { params: { id: postDoc.id } }; // e.g. { params: { id: 'pre-rendering' } }.
    }); // End of the map.
} // End of getAllPostIds.

// Get the data for one post, matched by its document ID.
export async function getPostData(id) { // id comes from the URL, e.g. "dynamic-routes".
    // Build a query for the posts collection where the document ID equals id.
    const q = query(collection(db, 'posts'), where(documentId(), '==', id)); // Describes the search; nothing runs yet.
    // Run the query and wait for Firestore to send back the results.
    const snapshot = await getDocs(q); // A query always returns a list, even for one match.
    // Handle the case where no document matched.
    if (snapshot.empty) { // True when the list has zero documents.
        // Stop the build with a clear message.
        throw new Error('Post not found: ' + id); // Only happens if the ID doesn't exist.
    } // End of the not-found check.
    // Take the first (and only) matching document.
    const postDoc = snapshot.docs[0]; // docs is the array of results.
    // Read the document's fields into a plain object.
    const data = postDoc.data(); // Gives { title, date, author, contentHtml }.
    // Return the post in the shape the page expects.
    return { // Start the returned object.
        id: postDoc.id, // The document ID.
        title: data.title, // The post title.
        date: data.date, // The post date string.
        author: data.author, // The post author.
        contentHtml: data.contentHtml, // The post body as HTML.
    }; // End the returned object.
} // End of getPostData.