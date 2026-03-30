import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './index.css';

const HealthFeed = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/posts');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim() || !user) return;

        setPosting(true);
        try {
            const res = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newPost,
                    authorName: user.name,
                    authorEmail: user.email,
                    authorRole: user.role
                })
            });
            const data = await res.json();
            if (data.success) {
                setPosts([data.post, ...posts]);
                setNewPost('');
            }
        } catch (err) {
            console.error('Failed to post:', err);
        }
        setPosting(false);
    };

    const handleLike = async (postId) => {
        if (!user) return;
        try {
            const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            });
            const data = await res.json();
            if (data.success) {
                setPosts(posts.map(p => p.id === postId ? { ...p, likes: data.likes } : p));
            }
        } catch (err) {
            console.error('Failed to like:', err);
        }
    };

    const handleShare = (post) => {
        const text = `Check out this health update from ${post.authorName} on WellNest: "${post.content}"`;
        navigator.clipboard.writeText(text);
        alert('Post content copied to clipboard! Share it with your friends.');
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const timeAgo = (dateStr) => {
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return interval + " years ago";
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + " months ago";
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return interval + " days ago";
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return interval + " hours ago";
        interval = Math.floor(seconds / 60);
        if (interval > 1) return interval + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="hf-container">
            <h2 className="hf-title">Community Feed 🌟</h2>
            <p className="hf-subtitle">Share your health achievements and inspire others!</p>

            {/* Create Post */}
            <div className="hf-create-card">
                <form onSubmit={handlePost}>
                    <textarea
                        className="hf-textarea"
                        placeholder="Share your workout, healthy meal, or wellness tip..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        maxLength={280}
                    />
                    <div className="hf-create-footer">
                        <span className="hf-char-count">{newPost.length}/280</span>
                        <button 
                            type="submit" 
                            className="hf-post-btn" 
                            disabled={posting || !newPost.trim()}
                        >
                            {posting ? 'Posting...' : 'Post update'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Posts List */}
            {loading ? (
                <div className="hf-loading">Loading feed...</div>
            ) : (
                <div className="hf-posts-list">
                    {posts.map(post => (
                        <div key={post.id} className="hf-post-card">
                            <div className="hf-post-header">
                                <div className="hf-avatar">
                                    {getInitials(post.authorName)}
                                </div>
                                <div className="hf-author-info">
                                    <div className="hf-author-name">
                                        {post.authorName}
                                        {post.authorRole === 'trainer' && <span className="hf-role-badge">Trainer</span>}
                                    </div>
                                    <div className="hf-post-meta">{timeAgo(post.createdAt)}</div>
                                </div>
                            </div>
                            <div className="hf-post-content">
                                {post.content}
                            </div>
                            <div className="hf-post-actions">
                                <button 
                                    className={`hf-action-btn ${post.likes.includes(user?.email) ? 'liked' : ''}`}
                                    onClick={() => handleLike(post.id)}
                                >
                                    ❤️ {post.likes.length}
                                </button>
                                <button 
                                    className="hf-action-btn"
                                    onClick={() => handleShare(post)}
                                >
                                    🔗 Share
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HealthFeed;
