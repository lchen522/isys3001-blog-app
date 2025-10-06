// ISYS3001 Blog Application - English Version
console.log('Blog application loading...');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Setup navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.getAttribute('href').substring(1);
            showSection(sectionName);
        });
    });
    
    // Setup form submission
    const form = document.getElementById('post-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addPost();
        });
    }
    
    // Show home section by default
    showSection('home');
    displayPosts();
});

// Show specific section
function showSection(sectionName) {
    console.log('Switching to section:', sectionName);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update active navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[href="#${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load posts for admin section
    if (sectionName === 'admin') {
        loadPostsForAdmin();
    }
}

// Add new blog post
function addPost() {
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    
    if (!titleInput || !contentInput) {
        alert('Error: Form elements not found');
        return;
    }
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content!');
        return;
    }
    
    // Get existing posts
    let posts = [];
    try {
        const stored = localStorage.getItem('blogPosts');
        posts = stored ? JSON.parse(stored) : [];
    } catch (e) {
        posts = [];
    }
    
    // Create new post
    const newPost = {
        title: title,
        content: content,
        date: new Date().toISOString(),
        id: Date.now()
    };
    
    // Add to beginning of array
    posts.unshift(newPost);
    
    // Save to localStorage
    try {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    } catch (e) {
        console.error('Save failed:', e);
        alert('Error saving post');
        return;
    }
    
    // Clear form
    titleInput.value = '';
    contentInput.value = '';
    
    alert('Post published successfully!');
    showSection('home');
}

// Display all posts
function displayPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;
    
    // Load posts from localStorage
    let posts = [];
    try {
        const stored = localStorage.getItem('blogPosts');
        posts = stored ? JSON.parse(stored) : [];
    } catch (e) {
        posts = [];
    }
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="no-posts">
                <h3>No Posts Yet</h3>
                <p>Create your first post in the Admin section</p>
                <button class="submit-btn" onclick="showSection('admin')">
                    Create First Post
                </button>
            </div>
        `;
        return;
    }
    
    // Display posts
    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-date">
                Published: ${new Date(post.date).toLocaleString('en-AU')}
            </div>
        </div>
    `).join('');
}

// Load posts for admin management
function loadPostsForAdmin() {
    const container = document.getElementById('admin-posts-container');
    if (!container) return;
    
    // Load posts from localStorage
    let posts = [];
    try {
        const stored = localStorage.getItem('blogPosts');
        posts = stored ? JSON.parse(stored) : [];
    } catch (e) {
        posts = [];
    }
    
    if (posts.length === 0) {
        container.innerHTML = '<p>No posts created yet</p>';
        return;
    }
    
    // Display posts with delete buttons
    container.innerHTML = posts.map((post, index) => `
        <div class="admin-post-item">
            <div class="post-info">
                <h4>${escapeHtml(post.title)}</h4>
                <div class="post-date">
                    ${new Date(post.date).toLocaleString('en-AU')}
                </div>
            </div>
            <div class="post-actions">
                <button class="secondary-btn" onclick="deletePost(${index})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Delete a post
function deletePost(index) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    // Load posts
    let posts = [];
    try {
        const stored = localStorage.getItem('blogPosts');
        posts = stored ? JSON.parse(stored) : [];
    } catch (e) {
        posts = [];
    }
    
    // Remove post
    posts.splice(index, 1);
    
    // Save updated posts
    try {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    } catch (e) {
        console.error('Delete failed:', e);
        alert('Error deleting post');
        return;
    }
    
    // Refresh displays
    loadPostsForAdmin();
    displayPosts();
    
    alert('Post deleted successfully!');
}

// Clear form function
function clearForm() {
    const form = document.getElementById('post-form');
    if (form) {
        form.reset();
    }
}

// HTML escape to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('Blog application ready');
