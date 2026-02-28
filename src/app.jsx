const { useState, useEffect } = React;

// WordPress API endpoint
const WORDPRESS_URL = 'http://localhost/wordpress';
const WP_API_ENDPOINT = `${WORDPRESS_URL}/wp-json/wp/v2/pages`;
const pageCache = {};
// Posts cache keyed by slug (e.g. 'blog')
const postCache = {};

// WordPress posts endpoint
const WP_POSTS_ENDPOINT = `${WORDPRESS_URL}/wp-json/wp/v2/posts`;
const IMAGE_PLACEHOLDER = 'https://via.placeholder.com/600x400?text=No+Image';

// Helper: Convert date to relative time string
function getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

// Component to render a list of blog posts (used on the "Blog" page)
function BlogList({ posts }) {
    return (
        <section className="nb-blog-list">
            {posts.map(post => {
                const featured = post._embedded?.['wp:featuredmedia']?.[0];
                const imageUrl = featured
                    ? (featured.media_details?.sizes?.medium?.source_url || featured.source_url)
                    : IMAGE_PLACEHOLDER;

                return (
                    <article key={post.id} className="nb-blog-post">
                        <a href={post.link} target="_blank" rel="noopener noreferrer" className="nb-blog-link">
                            <figure className="nb-blog-image">
                                <img src={imageUrl} alt={post.title.rendered || 'Post image'} />
                            </figure>
                            <h2 className="nb-blog-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                            <div className="nb-blog-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                        </a>
                    </article>
                );
            })}
        </section>
    );
}

// Comments Section Component
function CommentsSection({ pageData }) {
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        if (pageData?.id) {
            loadComments(pageData.id);
        }
    }, [pageData?.id]);

    const loadComments = async (postId) => {
        try {
            const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/comments?post=${postId}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (err) {
            console.error('Failed to load comments:', err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsPosting(true);
        try {
            const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    post: pageData.id,
                    author_name: 'Anonymous',
                    author_email: 'guest@example.local',
                    content: commentText
                })
            });

            if (response.ok) {
                setCommentText('');
                await loadComments(pageData.id);
                alert('Comment posted successfully!');
            } else {
                alert('Failed to post comment');
            }
        } catch (err) {
            console.error('Error posting comment:', err);
            alert('Error posting comment');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <>
            <button 
                className="nb-comments-btn"
                onClick={() => setShowComments(!showComments)}
                aria-expanded={showComments}
            >
                <span className="nb-comments-count">{comments.length}</span> comments
            </button>
            {showComments && (
                <section className="nb-comments">
                    <ul className="nb-comments-list">
                        {comments.map(comment => (
                            <li key={comment.id} className="nb-comment">
                                <strong className="nb-comment-author">{comment.author_name}</strong>
                                <span className="nb-comment-time">{getTimeAgo(new Date(comment.date))}</span>
                                <p className="nb-comment-text" dangerouslySetInnerHTML={{__html: comment.content.rendered}} />
                            </li>
                        ))}
                    </ul>
                    <form className="nb-comment-form" onSubmit={handleCommentSubmit}>
                        <label className="nb-label" htmlFor="commentInput">Add a comment</label>
                        <textarea 
                            id="commentInput"
                            className="nb-input" 
                            rows="3" 
                            placeholder="Write your comment…"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            required
                        />
                        <button type="submit" className="nb-btn" disabled={isPosting}>
                            {isPosting ? 'Posting...' : 'Post'}
                        </button>
                    </form>
                </section>
            )}
        </>
    );
}

// Page Content Component
function PageContent({ pageData, loading, error, currentPage }) {
    if (loading) {
        return (
            <div className="nb-loading-container">
                <div className="nb-spinner"></div>
                <p className="nb-loading-text">Loading content...</p>
            </div>
        );
    }

    if (error) {
        return <div><h1>Error: {error}</h1></div>;
    }

    // special case: blog or home page, we received { posts: [...] }
    if (currentPage === 'blog' || currentPage === 'home') {
        const posts = pageData?.posts || [];
        if (posts.length === 0) {
            return <h1>No posts available</h1>;
        }
        return <BlogList posts={posts} />;
    }

    if (!pageData) {
        return <h1>404 - Page not found</h1>;
    }

    const title = pageData.title?.rendered || 'Untitled';
    const content = pageData.content?.rendered || '<p>No content available.</p>';
    const featured = pageData._embedded?.['wp:featuredmedia']?.[0];
    const author = pageData._embedded?.author?.[0];

    return (
        <article className="nb-post">
            <h1 className="nb-title">{title}</h1>
            {featured && (
                <figure className="nb-hero">
                    <img 
                        src={featured.media_details?.sizes?.large?.source_url || featured.source_url}
                        alt={featured.alt_text || title}
                    />
                    {author && (
                        <figcaption className="nb-meta-box">
                            <span className="nb-date">
                                {new Date(pageData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="nb-author">By {author.name}</span>
                        </figcaption>
                    )}
                </figure>
            )}
            <div className="nb-content" dangerouslySetInnerHTML={{__html: content}} />
            <CommentsSection pageData={pageData} />
        </article>
    );
}

// Main App Component
function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [pages, setPages] = useState([]); // Store available pages from WordPress

    // Get current page from path
    const getSlugFromPath = () => {
        const path = window.location.pathname;
        const baseUrl = '/NewtonBlakeWebsiteReact/';
        if (path === baseUrl || path === baseUrl + 'home') {
            console.log('[nb] getSlugFromPath', path, '-> home');
            return 'home';
        }
        // Extract slug from path (e.g., /NewtonBlakeWebsiteReact/design -> design)
        const slug = path.replace(baseUrl, '').replace(/\/$/, '') || 'home';
        console.log('[nb] getSlugFromPath', path, '->', slug);
        return slug;
    };

    // Fetch all pages from WordPress to populate navigation
    const fetchAllPages = async () => {
        try {
            const response = await fetch(`${WP_API_ENDPOINT}?per_page=100&orderby=menu_order&order=asc`);
            if (response.ok) {
                const data = await response.json();
                // Extract slug and title from each page
                const pageList = data.map(page => ({
                    slug: page.slug,
                    title: page.title.rendered
                }));
                // ensure there's always a blog entry so users can navigate
                if (!pageList.some(p => p.slug === 'blog')) {
                    pageList.push({ slug: 'blog', title: 'Blog' });
                }
                setPages(pageList);
            }
        } catch (err) {
            console.error('Failed to fetch pages list:', err);
        }
    };

    // Fetch a list of recent posts (used on the blog page)
    const fetchPosts = async () => {
        try {
            const response = await fetch(`${WP_POSTS_ENDPOINT}?per_page=3&_embed=1&orderby=date&order=desc`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const posts = await response.json();
            return posts;
        } catch (err) {
            console.error('Failed to fetch posts:', err);
            return [];
        }
    };

    // Fetch page from WordPress (or posts for blog)
    const fetchPage = async (slug) => {
        console.log('[nb] fetchPage()', slug);
        // Check if slug is valid (exists in pages from WordPress)
        const isValidSlug = pages.length === 0 || pages.some(p => p.slug === slug);
        
        if (!isValidSlug) {
            window.history.pushState(null, '', '/NewtonBlakeWebsiteReact/');
            return;
        }

        // handle blog page (and home) separately
        if (slug === 'blog' || slug === 'home') {
            console.log('[nb] blog/home branch — fetching posts');
            const cacheKey = slug === 'home' ? 'blog' : slug;
            if (postCache[cacheKey]) {
                console.log('[nb] using postCache for', cacheKey);
                setPageData({ posts: postCache[cacheKey] });
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const posts = await fetchPosts();
                postCache[cacheKey] = posts;
                setPageData({ posts });
                setError(null);
            } catch (err) {
                console.error('Failed to fetch blog posts:', err);
                setError(err.message || 'Failed to load posts');
                setPageData({ posts: [] });
            } finally {
                setLoading(false);
            }
            return;
        }

        if (pageCache[slug]) {
            setPageData(pageCache[slug]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${WP_API_ENDPOINT}?slug=${slug}&_embed=1`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const pages = await response.json();
            if (!pages || pages.length === 0) {
                throw new Error(`Page not found: ${slug}`);
            }

            const data = pages[0];
            pageCache[slug] = data;
            setPageData(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch page:', err);
            setError(err.message);
            setPageData(null);
        } finally {
            setLoading(false);
        }
    };

    // Load page when path changes
    useEffect(() => {
        const handlePopState = () => {
            const slug = getSlugFromPath();
            setCurrentPage(slug);
            fetchPage(slug);
        };

        window.addEventListener('popstate', handlePopState);
        
        // Fetch available pages from WordPress on initial load
        fetchAllPages();
        
        // Initial load
        const initialSlug = getSlugFromPath();
        setCurrentPage(initialSlug);
        fetchPage(initialSlug);

        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleNavClick = (page) => {
        console.log('[nb] handleNavClick()', page);
        const newPath = page === 'home' 
            ? '/NewtonBlakeWebsiteReact/' 
            : `/NewtonBlakeWebsiteReact/${page}`;
        
        window.history.pushState(null, '', newPath);
        setCurrentPage(page);
        setMenuOpen(false);
        // if navigating to home we want blog content
        fetchPage(page === 'home' ? 'home' : page);
    };

    return (
        <>
            <header className="nb-header">
                <div className="nb-container nb-header-inner">
                    <a
                        className="nb-brand nav-link"
                        href="./"
                        onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                    >
                        Newton Blake
                    </a>
                    <ul className="nb-nav-inline">
                        {pages.map(page => (
                            <li key={page.slug}>
                                <a
                                    href={page.slug === 'home' ? './' : `./${page.slug}`}
                                    onClick={(e) => { e.preventDefault(); handleNavClick(page.slug); }}
                                    className={currentPage === page.slug ? 'nav-link active' : 'nav-link'}
                                >
                                    {page.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button 
                        className="nb-menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-expanded={menuOpen}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </header>

            {menuOpen && (
                <nav className="nb-nav active">
                    <button className="nb-close-btn" onClick={() => setMenuOpen(false)}>×</button>
                    <ul>
                        {pages.map(page => (
                            <li key={page.slug}>
                                <a
                                    href={page.slug === 'home' ? './' : `./${page.slug}`}
                                    onClick={(e) => { e.preventDefault(); handleNavClick(page.slug); }}
                                    className="nav-link"
                                >
                                    {page.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            <main id="app">
                <PageContent pageData={pageData} loading={loading} error={error} currentPage={currentPage} />
            </main>

            <footer className="nb-footer">
                <div className="nb-container">
                    <p>&copy; {new Date().getFullYear()} Newton Blake. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
