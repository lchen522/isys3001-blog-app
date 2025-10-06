class BlogApp {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        this.init();
    }

    init() {
        this.setupNavigation();
        this.showSection('home');
        this.displayPosts();
        this.setupForm();
        this.updatePostCounts();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });
    }

    showSection(sectionName) {
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.getElementById(sectionName).classList.add('active');
        document.querySelector(`[href="#${sectionName}"]`).classList.add('active');

        if (sectionName === 'admin') {
            this.loadPostsForAdmin();
        }
    }

    displayPosts() {
        const container = document.getElementById('posts-container');
        
        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="no-posts">
                    <h3>No Posts Yet</h3>
                    <p>Create your first post in Admin section</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.posts.map(post => `
            <div class="post-card">
                <h3 class="post-title">${this.escapeHtml(post.title)}</h3>
                <div class="post-content">${this.escapeHtml(post.content)}</div>
                <div class="post-date">
                    Published: ${new Date(post.date).toLocaleString('en-AU')}
                </div>
            </div>
        `).join('');

        this.updatePostCounts();
    }

    loadPostsForAdmin() {
        const container = document.getElementById('admin-posts-container');
        
        if (this.posts.length === 0) {
            container.innerHTML = '<p>No posts created yet</p>';
            return;
        }

        container.innerHTML = this.posts.map((post, index) => `
            <div class="admin-post-item">
                <div class="post-info">
                    <h4>${this.escapeHtml(post.title)}</h4>
                    <div class="post-date">
                        ${new Date(post.date).toLocaleString('en-AU')}
                    </div>
                </div>
                <div class="post-actions">
                    <button class="secondary-btn" onclick="blogApp.deletePost(${index})">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

        this.updatePostCounts();
    }

    setupForm() {
        document.getElementById('post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPost();
        });
    }

    addPost() {
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        if (!title.trim() || !content.trim()) {
            alert('Please fill in both title and content!');
            return;
        }

        const newPost = {
            title: title.trim(),
            content: content.trim(),
            date: new Date().toISOString()
        };

        this.posts.unshift(newPost);
        this.savePosts();
        document.getElementById('post-form').reset();
        alert('Post published successfully!');
        this.showSection('home');
    }

    deletePost(index) {
        if (confirm('Are you sure you want to delete this post?')) {
            this.posts.splice(index, 1);
            this.savePosts();
            this.loadPostsForAdmin();
            this.displayPosts();
        }
    }

    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
        this.updatePostCounts();
    }

    updatePostCounts() {
        const homeCount = document.getElementById('post-count');
        const adminCount = document.getElementById('admin-post-count');
        
        if (homeCount) homeCount.textContent = this.posts.length;
        if (adminCount) adminCount.textContent = this.posts.length;
    }

    clearForm() {
        document.getElementById('post-form').reset();
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    window.blogApp = new BlogApp();
});