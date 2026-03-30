import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './index.css';

const BlogDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
            const data = await res.json();
            if (data.success !== false) setBlog(data);
        } catch (err) {
            console.error('Failed to fetch blog:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const handleLike = async () => {
        if (!user) return;
        try {
            const res = await fetch(`http://localhost:5000/api/blogs/${id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            });
            const data = await res.json();
            if (data.success) {
                setBlog({ ...blog, likes: data.likes });
            }
        } catch (err) {
            console.error('Failed to like:', err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim() || !user) return;
        setSubmitting(true);
        try {
            const res = await fetch(`http://localhost:5000/api/blogs/${id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: comment,
                    authorName: user.name,
                    authorEmail: user.email
                })
            });
            const data = await res.json();
            if (data.success) {
                setBlog({ ...blog, comments: [...(blog.comments || []), data.comment] });
                setComment('');
            }
        } catch (err) {
            console.error('Failed to comment:', err);
        }
        setSubmitting(true);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ authorEmail: user.email })
            });
            const data = await res.json();
            if (data.success) navigate('/blog');
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const handleBack = () => {
        if (user?.role === 'trainer') navigate('/trainer-dashboard');
        else navigate('/dashboard');
    };

    if (loading) return <div className="hb-loading">Loading article...</div>;
    if (!blog) return <div className="hb-no-results">Article not found.</div>;

    const isAuthor = user?.email === blog.authorEmail;
    const isAdmin = user?.role === 'admin';

    return (
        <div className="bd-container">
            {!isAdmin && (
                <button className="bd-back-btn" onClick={handleBack}>
                    ← Back to Dashboard
                </button>
            )}

            <article className="bd-article">
                <div className="bd-meta">
                    <span className="bd-category">{blog.category}</span>
                    <span className="bd-date">{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <h1 className="bd-title">{blog.title}</h1>
                <div className="bd-author-row">
                    <div className="bd-author-avatar">{blog.authorName[0]}</div>
                    <div className="bd-author-info">
                        <div className="bd-author-name">{blog.authorName}</div>
                        <div className="bd-author-role">{blog.authorRole === 'trainer' ? 'Certified Trainer' : 'Expert contributor'}</div>
                    </div>
                    {(isAuthor || isAdmin) && (
                        <div className="bd-author-actions">
                            {isAuthor && (
                                <button className="bd-edit-btn" onClick={() => navigate(`/blog/edit/${id}`)}>Edit</button>
                            )}
                            <button className="bd-delete-btn" onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>

                <div className="bd-content">
                    {blog.content.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>

                <div className="bd-actions">
                    <button className={`bd-like-btn ${blog.likes?.includes(user?.email) ? 'active' : ''}`} onClick={handleLike}>
                        ❤️ {blog.likes?.length || 0} Likes
                    </button>
                    <button className="bd-share-btn" onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                    }}>
                        🔗 Share Link
                    </button>
                </div>
            </article>

            <section className="bd-comments-section">
                <h3>Comments ({blog.comments?.length || 0})</h3>
                <form className="bd-comment-form" onSubmit={handleComment}>
                    <textarea 
                        placeholder="Join the discussion..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={submitting}>Post Comment</button>
                </form>

                <div className="bd-comments-list">
                    {blog.comments?.map(c => (
                        <div key={c.id} className="bd-comment">
                            <div className="bd-comment-header">
                                <span className="bd-comment-author">{c.authorName}</span>
                                <span className="bd-comment-date">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="bd-comment-content">{c.content}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BlogDetail;
