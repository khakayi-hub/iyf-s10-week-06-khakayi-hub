const form = document.getElementById("postForm");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const postsContainer = document.getElementById("posts");
const loadingText = document.getElementById("loading");

async function createPost(title, body, userId = 1) {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            body,
            userId
        })
    });

    if (!response.ok) {
        throw new Error("Failed to create post");
    }

    return await response.json();
}

function displayPost(post) {
    const div = document.createElement("div");
    div.classList.add("post");

    div.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <small>Post ID: ${post.id}</small>
    `;

    postsContainer.prepend(div);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value;
    const body = bodyInput.value;

    try {
        loadingText.style.display = "block";

        const newPost = await createPost(title, body);

        displayPost(newPost);

        form.reset();

    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        loadingText.style.display = "none";
    }
});