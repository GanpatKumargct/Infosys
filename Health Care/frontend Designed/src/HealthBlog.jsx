import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './index.css';

const HealthBlog = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Nutrition', 'Fitness', 'Wellness', 'Mental Health'];

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/blogs');
                const data = await res.json();
                setBlogs(data);
            } catch (err) {
                console.error('Failed to fetch blogs:', err);
            }
            setLoading(false);
        };
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                             b.content.toLowerCase().includes(search.toLowerCase());
        const matchesCat = category === 'All' || b.category === category;
        return matchesSearch && matchesCat;
    });

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="hb-container">
            <header className="hb-header">
                <div>
                    {user?.role !== 'admin' && (
                        <button className="bd-back-btn" style={{marginBottom:10}} onClick={() => navigate(user?.role === 'trainer' ? '/trainer-dashboard' : '/dashboard')}>
                            ← Back
                        </button>
                    )}
                    <h1 className="hb-title">Health Insights 📚</h1>
                    <p className="hb-subtitle">Expert advice on nutrition, fitness, and mental wellness.</p>
                </div>
                {user && (
                    <button className="hb-create-btn" onClick={() => navigate('/blog/new')}>
                        ✍️ Write Article
                    </button>
                )}
            </header>

            <div className="hb-controls">
                <div className="hb-search-wrap">
                    <input 
                        type="text" 
                        placeholder="Search articles..." 
                        className="hb-search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="hb-search-icon">🔍</span>
                </div>
                <div className="hb-categories">
                    {categories.map(c => (
                        <button 
                            key={c} 
                            className={`hb-cat-btn ${category === c ? 'active' : ''}`}
                            onClick={() => setCategory(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="hb-loading">Discovering insights...</div>
            ) : (
                <div className="hb-grid">
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map(blog => (
                            <div key={blog.id} className="hb-card" onClick={() => navigate(`/blog/${blog.id}`)}>
                                <div className="hb-card-category">{blog.category}</div>
                                <h2 className="hb-card-title">{blog.title}</h2>
                                <p className="hb-card-snippet">{blog.content.substring(0, 120)}...</p>
                                <div className="hb-card-footer">
                                    <div className="hb-card-author">
                                        <div className="hb-author-avatar">
                                            {blog.authorName[0]}
                                        </div>
                                        <div>
                                            <div className="hb-author-name">{blog.authorName}</div>
                                            <div className="hb-date">{formatDate(blog.createdAt)}</div>
                                        </div>
                                    </div>
                                    <div className="hb-card-stats">
                                        <span>❤️ {blog.likes.length}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="hb-no-results">No articles found matching your criteria.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HealthBlog;
