import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, get, ref } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzCMmKZDM-iQfkgS7G6DwK0uwoGn2NZHk",
    authDomain: "blogging-website-d3824.firebaseapp.com",
    projectId: "blogging-website-d3824",
    storageBucket: "blogging-website-d3824.appspot.com",
    messagingSenderId: "1081124317183",
    appId: "1:1081124317183:web:60174ba7fd17be5c7429ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Select the main container and add a loading indicator
const table = document.querySelector('.main');
table.innerHTML = `<p>Loading posts...</p>`;

// Function to get blog post data from Firebase
async function getPostData() {
    const userRef = ref(db, 'post/');
    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            renderPosts(data);
        } else {
            table.innerHTML = `<p>No posts available.</p>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        table.innerHTML = `<p>Failed to load posts. Please try again later.</p>`;
    }
}

// Function to render posts on the blog page
function renderPosts(data) {
    let html = "";
    for (const key in data) {
        const { title, post_content } = data[key];
        html += `
            <div class="post">
                <h2>${title}</h2>
                <p>${post_content}</p>
            </div>
        `;
    }
    table.innerHTML = html;
}

// Fetch posts when the page loads
getPostData();
