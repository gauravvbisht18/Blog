// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase, set, ref, get, remove, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

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
const auth = getAuth(app);
const db = getDatabase(app);

// DOM elements
const my_blog = document.querySelector('.my_blog');
const login_page = document.querySelector('.login');
const notify = document.querySelector('.notifiy');
const add_post_Btn = document.querySelector('#post_btn');
const Sign_btn = document.querySelector('#sign_in');
const sign_out_btn = document.querySelector('#logout');
const update_btn = document.querySelector('.update_btn');
const post_btn = document.querySelector('.post_btn');

// Authentication state observer
onAuthStateChanged(auth, (user) => {
   if (user) {
      my_blog.classList.remove('hide');
      login_page.classList.add('hide');
      GetPostData(); // Load posts when user is authenticated
   } else {
      my_blog.classList.add('hide');
      login_page.classList.remove('hide');
      clearFields(); // Clear input fields on logout
   }
});

// Sign in user
function SignInUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      notify.innerHTML = "Successfully logged in!";
    })
    .catch((error) => {
      console.error("Error signing in:", error.message);
      notify.innerHTML = "Login failed. Please try again.";
    });
}

// Sign out user
sign_out_btn.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      notify.innerHTML = "Signed out successfully.";
      clearFields();
    })
    .catch((error) => {
      console.error("Error signing out:", error.message);
      notify.innerHTML = "Error signing out. Try again.";
    });
});

// Blog section - Add post
function Add_Post() {
  const title = document.querySelector('#title').value;
  const post_content = document.querySelector('#post_content').value;
  const id = Date.now();

  set(ref(db, 'post/' + id), {
    title: title,
    post_content: post_content
  })
    .then(() => {
      notify.innerHTML = "Post added successfully.";
      clearFields();
      GetPostData();
    })
    .catch((error) => {
      console.error("Error adding post:", error.message);
      notify.innerHTML = "Failed to add post.";
    });
}

// Clear input fields and notifications
function clearFields() {
  document.querySelector('#title').value = "";
  document.querySelector('#post_content').value = "";
 
}

// Event listeners for authentication and blog functions
document.addEventListener('DOMContentLoaded', () => {
    Sign_btn.addEventListener('click', SignInUser);
    add_post_Btn.addEventListener('click', Add_Post);
});

// Fetch and display posts from Firebase
function GetPostData() {
  const user_ref = ref(db, 'post/');
  get(user_ref)
    .then((snapshot) => {
      const data = snapshot.val();
      const table = document.querySelector('table');
      let html = "";

      for (const key in data) {
        const { title, post_content } = data[key];
        html += `
          <tr>
            <td><span class="postNumber"></span></td>
            <td>${title}</td>
            <td><button class="delete" onclick="delete_data(${key})">Delete</button></td>
            <td><button class="update" onclick="update_data(${key})">Update</button></td>
          </tr>`;
      }

      table.innerHTML = html;
    })
    .catch((error) => {
      console.error("Error fetching data:", error.message);
      notify.innerHTML = "Failed to load posts.";
    });
}

// Delete post
window.delete_data = function (key) {
  remove(ref(db, `post/${key}`))
    .then(() => {
      notify.innerHTML = "Post deleted successfully.";
      GetPostData();
    })
    .catch((error) => {
      console.error("Error deleting post:", error.message);
      notify.innerHTML = "Failed to delete post.";
    });
};

// Update post data
window.update_data = function (key) {
  const user_ref = ref(db, `post/${key}`);

  get(user_ref)
    .then((item) => {
      document.querySelector('#title').value = item.val().title;
      document.querySelector('#post_content').value = item.val().post_content;

      update_btn.classList.add('show');
      post_btn.classList.add('hide');

      // Update form submit handler
      update_btn.onclick = () => Update_Form(key); // Use arrow function for single call
    })
    .catch((error) => {
      console.error("Error fetching data for update:", error.message);
      notify.innerHTML = "Error fetching post details.";
    });
};

// Update form submission
function Update_Form(key) {
  const title = document.querySelector('#title').value;
  const post_content = document.querySelector('#post_content').value;

  update(ref(db, `post/${key}`), {
    title: title,
    post_content: post_content
  })
    .then(() => {
      notify.innerHTML = "Post updated successfully.";
      update_btn.classList.remove('show');
      post_btn.classList.remove('hide');
      clearFields();
      GetPostData();
    })
    .catch((error) => {
      console.error("Error updating post:", error.message);
      notify.innerHTML = "Failed to update post.";
    });
}
