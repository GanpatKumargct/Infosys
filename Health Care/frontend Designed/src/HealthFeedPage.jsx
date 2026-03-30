import { useNavigate } from 'react-router-dom';
import HealthFeed from './HealthFeed';
import './index.css';

const HealthFeedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="hf-page">
            <header className="hf-page-header">
                <button className="hf-back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <div className="hf-header-title">
                    <h1>Health & Wellness Feed</h1>
                    <p>Connect, Share, and Inspire</p>
                </div>
                <div className="hf-header-spacer"></div>
            </header>

            <main className="hf-page-main">
                <HealthFeed />
            </main>
        </div>
    );
};

export default HealthFeedPage;
