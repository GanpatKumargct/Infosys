import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './index.css';

const BlogEditor = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(!!id);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Nutrition',
        tags: ''
    });

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
                    const data = await res.json();
                    if (data.success !== false) {
                        setFormData({
                            title: data.title,
                            content: data.content,
                            category: data.category,
                            tags: data.tags?.join(', ') || ''
                        });
                    }
                } catch (err) {
                    console.error('Failed to fetch blog for edit:', err);
                }
                setLoading(false);
            };
            fetchBlog();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:5000/api/blogs/${id}` : 'http://localhost:5000/api/blogs';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
                    authorName: user.name,
                    authorEmail: user.email,
                    authorRole: user.role
                })
            });
            const data = await res.json();
            if (data.success) {
                navigate(id ? `/blog/${id}` : '/blog');
            }
        } catch (err) {
            console.error('Failed to save blog:', err);
        }
        setSubmitting(false);
    };

    if (loading) return <div className="hb-loading">Loading editor...</div>;

    return (
        <div className="be-container">
            <header className="be-header">
                <button className="be-back-btn" onClick={() => navigate(-1)}>← Back</button>
                <h1 className="be-title">{id ? 'Edit Article' : 'Write a New Article'}</h1>
            </header>

            <form className="be-form" onSubmit={handleSubmit}>
                <div className="be-form-group">
                    <label>Title</label>
                    <input 
                        type="text" 
                        placeholder="Give your article a catchy title..." 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>

                <div className="be-row">
                    <div className="be-form-group">
                        <label>Category</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option>Nutrition</option>
                            <option>Fitness</option>
                            <option>Wellness</option>
                            <option>Mental Health</option>
                        </select>
                    </div>
                    <div className="be-form-group">
                        <label>Tags (comma separated)</label>
                        <input 
                            type="text" 
                            placeholder="yoga, nutrition, weight-loss" 
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        />
                    </div>
                </div>

                <div className="be-form-group">
                    <label>Content</label>
                    <textarea 
                        placeholder="Write your article here..." 
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        required
                    />
                </div>

                <div className="be-form-actions">
                    <button type="button" className="be-cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
                    <button type="submit" className="be-save-btn" disabled={submitting}>
                        {submitting ? 'Saving...' : id ? 'Update Article' : 'Publish Article'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogEditor;
