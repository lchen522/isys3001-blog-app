// ISYS3001 Blog Application - Minimal Working Version
class BlogApp {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        this.init();
    }

    init() {
        // Setup everything when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupNavigation();
        this.setupForm();
        this.showSection('home');
        this.displayPosts();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionName = link.getAttribute('href').substring(1);
                this.showSection(sectionName);
            });
        });
    }

    setupForm() {
        const form = document.getElementById('post-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addPost();
            });
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionName}"]`).classList.add('active');

        // Refresh content if needed
        if (sectionName === 'admin') {
            this.loadPostsForAdmin();
        }
    }

    addPost() {
        const title = document.getElementById('post-title').value.trim();
        const content = document.getElementById('post-content').value.trim();

        if (!title || !content) {
            alert('Please fill in both title and content!');
            return;
        }

        const newPost = {
            title: title,
            content: content,
            date: new Date().toISOString()
        };

        this.posts.unshift(newPost);
        this.savePosts();
        
        document.getElementById('post-form').reset();
        alert('Post published successfully!');
        this.showSection('home');
    }

    displayPosts() {
        const container = document.getElementById('posts-container');
        if (!container) return;

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
                <h3>${this.escapeHtml(post.title)}</h3>
                <p>${this.escapeHtml(post.content)}</p>
                <small>Published: ${new Date(post.date).toLocaleString('en-AU')}</small>
            </div>
        `).join('');
    }

    loadPostsForAdmin() {
        const container = document.getElementById('admin-posts-container');
        if (!container) return;

        if (this.posts.length === 0) {
            container.innerHTML = '<p>No posts created yet</p>';
            return;
        }

        container.innerHTML = this.posts.map((post, index) => `
            <div class="admin-post-item">
                <div>
                    <h4>${this.escapeHtml(post.title)}</h4>
                    <small>${new Date(post.date).toLocaleString('en-AU')}</small>
                </div>
                <button class="secondary-btn" onclick="blogApp.deletePost(${index})">
                    Delete
                </button>
            </div>
        `).join('');
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
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Start the application
const blogApp = new BlogApp();