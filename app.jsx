const { useState, useEffect } = React;

// Helper function to fetch comments from WordPress
async function fetchComments(pageSlug) {
    try {
        const response = await fetch(`http://localhost/NewtonBlakeWebsite/wp-json/wp/v2/comments?search=${pageSlug}`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return await response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}

// Helper function to post a comment to WordPress
async function postComment(author, email, content, pageSlug) {
    try {
        const response = await fetch('http://localhost/NewtonBlakeWebsite/wp-json/wp/v2/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                author_name: author,
                author_email: email,
                content: content,
                post_slug: pageSlug,
            }),
        });
        if (!response.ok) throw new Error('Failed to post comment');
        return await response.json();
    } catch (error) {
        console.error('Error posting comment:', error);
        return null;
    }
}

// Home Page Component
function HomePage() {
    return (
        <div className="page-container">
            <div className="hero">
                <h1>Newton Blake</h1>
                <p>Designer | Artist | Creative Thinker</p>
                <div className="hero-buttons">
                    <button className="btn btn-primary">View Portfolio</button>
                    <button className="btn btn-secondary">Get In Touch</button>
                </div>
            </div>

            <section className="section">
                <h2>Welcome</h2>
                <p>Welcome to my creative portfolio. I'm a designer and artist passionate about creating beautiful and meaningful work. Browse through my projects and get a glimpse of my design philosophy and artistic approach.</p>
            </section>

            <CommentsSection pageSlug="home" />
        </div>
    );
}

// Portfolio Page Component
function PortfolioPage() {
    const portfolioItems = [
        { id: 1, title: "Project 1", description: "A beautiful design project", emoji: "🎨" },
        { id: 2, title: "Project 2", description: "Creative artwork", emoji: "🖼️" },
        { id: 3, title: "Project 3", description: "Modern design concept", emoji: "✨" },
        { id: 4, title: "Project 4", description: "Artistic exploration", emoji: "🌈" },
        { id: 5, title: "Project 5", description: "Design experiment", emoji: "💡" },
        { id: 6, title: "Project 6", description: "Creative collaboration", emoji: "🎭" },
    ];

    return (
        <div className="page-container">
            <section className="section">
                <h2>Portfolio</h2>
                <p>A collection of my recent work and creative projects.</p>
            </section>

            <div className="portfolio-grid">
                {portfolioItems.map(item => (
                    <div key={item.id} className="portfolio-item">
                        <div className="portfolio-image">{item.emoji}</div>
                        <div className="portfolio-info">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <CommentsSection pageSlug="portfolio" />
        </div>
    );
}

// Design Page Component
function DesignPage() {
    return (
        <div className="page-container">
            <section className="section">
                <h2>Design Philosophy</h2>
                <p>My approach to design is rooted in simplicity, functionality, and aesthetic excellence.</p>
            </section>

            <div className="design-container">
                <div className="design-item">
                    <h3>User-Centered Design</h3>
                    <p>Every design decision is made with the user in mind. I believe that great design is not just about how something looks, but how it works and how it makes people feel.</p>
                </div>
                <div className="design-item">
                    <h3>Minimalism</h3>
                    <p>I embrace the principle of "less is more." By removing unnecessary elements, I create clean, focused designs that communicate effectively and engage users.</p>
                </div>
                <div className="design-item">
                    <h3>Color & Typography</h3>
                    <p>Thoughtful color palettes and typography choices are essential to creating a cohesive visual identity. I carefully select typefaces and colors that enhance the overall design.</p>
                </div>
                <div className="design-item">
                    <h3>Innovation</h3>
                    <p>I stay updated with the latest design trends and technologies, always looking for new ways to push the boundaries of creative design.</p>
                </div>
            </div>

            <CommentsSection pageSlug="design" />
        </div>
    );
}

// About Page Component
function AboutPage() {
    return (
        <div className="page-container">
            <section className="section">
                <h2>About Me</h2>
            </section>

            <div className="about-content">
                <p>I'm a passionate designer and artist with a background in visual arts and digital design. My journey in the creative field has been a wonderful exploration of colors, forms, and ideas.</p>

                <h3>My Journey</h3>
                <p>I started my career with a focus on traditional art, but quickly embraced digital tools to expand my creative possibilities. Over the years, I've developed a unique style that blends traditional artistic principles with modern design techniques.</p>

                <h3>Skills & Expertise</h3>
                <p>My expertise includes:</p>
                <ul style={{marginLeft: '1.5rem'}}>
                    <li>Graphic Design</li>
                    <li>Digital Art</li>
                    <li>UI/UX Design</li>
                    <li>Illustration</li>
                    <li>Web Design</li>
                    <li>Branding & Identity</li>
                </ul>

                <h3>Philosophy</h3>
                <p>I believe that design is not just about aesthetics; it's about solving problems and creating meaningful experiences. Every project is an opportunity to learn, grow, and make a positive impact.</p>

                <h3>Let's Collaborate</h3>
                <p>I'm always interested in new projects and collaborations. Whether you have a specific design challenge or just want to brainstorm ideas, feel free to reach out. Let's create something amazing together!</p>
            </div>

            <CommentsSection pageSlug="about" />
        </div>
    );
}

// Comments Section Component
function CommentsSection({ pageSlug }) {
    const [comments, setComments] = useState([]);
    const [author, setAuthor] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadComments();
    }, [pageSlug]);

    const loadComments = async () => {
        setLoading(true);
        // In a real implementation, this would fetch from the WordPress REST API
        // For now, we'll use localStorage to simulate comment storage
        const storedComments = JSON.parse(localStorage.getItem(`comments-${pageSlug}`) || '[]');
        setComments(storedComments);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!author || !email || !content) {
            alert('Please fill in all fields');
            return;
        }

        const newComment = {
            id: Date.now(),
            author,
            email,
            content,
            date: new Date().toLocaleString(),
        };

        // Add comment to state
        const updatedComments = [newComment, ...comments];
        setComments(updatedComments);

        // Save to localStorage
        localStorage.setItem(`comments-${pageSlug}`, JSON.stringify(updatedComments));

        // Clear form
        setAuthor('');
        setEmail('');
        setContent('');

        // Optionally post to WordPress (if backend supports it)
        // await postComment(author, email, content, pageSlug);
    };

    return (
        <div className="comments-section">
            <h3>Comments</h3>

            <form className="comment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="author">Name</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Your name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Comment</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your comment here..."
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Post Comment</button>
            </form>

            <div className="comments-list">
                {loading ? (
                    <p>Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p>No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <div className="comment-author">{comment.author}</div>
                            <div className="comment-date">{comment.date}</div>
                            <div className="comment-text">{comment.content}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Main App Component
function App() {
    const [currentPage, setCurrentPage] = useState('home');

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'portfolio':
                return <PortfolioPage />;
            case 'design':
                return <DesignPage />;
            case 'about':
                return <AboutPage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <>
            <header>
                <nav>
                    <div className="logo" onClick={() => setCurrentPage('home')}>Newton Blake</div>
                    <ul>
                        <li><a onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>Home</a></li>
                        <li><a onClick={() => setCurrentPage('portfolio')} className={currentPage === 'portfolio' ? 'active' : ''}>Portfolio</a></li>
                        <li><a onClick={() => setCurrentPage('design')} className={currentPage === 'design' ? 'active' : ''}>Design</a></li>
                        <li><a onClick={() => setCurrentPage('about')} className={currentPage === 'about' ? 'active' : ''}>About</a></li>
                    </ul>
                </nav>
            </header>

            <main>
                {renderPage()}
            </main>

            <footer>
                <p>&copy; 2026 Newton Blake. All rights reserved.</p>
                <p>Designed and created with passion.</p>
            </footer>
        </>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
