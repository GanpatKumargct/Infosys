import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUnreadCountsPerContact, markMessagesAsRead } from '../services/api';
import { ArrowLeft, Send, User } from 'lucide-react';

const Messages = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token) {
            navigate('/login');
            return;
        }
        setUserRole(role);
        fetchProfile();
        fetchContacts(role);
        fetchUnreadCounts();
    }, [navigate]);

    useEffect(() => {
        let interval;
        if (selectedContact) {
            handleContactSelect(selectedContact);
            interval = setInterval(() => {
                fetchMessages(selectedContact.id);
                fetchUnreadCounts();
            }, 5000); // Polling every 5s
        } else {
            interval = setInterval(() => fetchUnreadCounts(), 5000);
        }
        return () => clearInterval(interval);
    }, [selectedContact]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            // Hack to get ID if it's not in profile, wait we can get it from decoding token or by fetching full profile if id is there.
            // If ID isn't returned in DTO, we might rely on messages to tell senderId.
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const fetchContacts = async (role) => {
        setLoading(true);
        try {
            const res = await api.get(role === 'PATIENT' ? '/users/doctors' : '/users/patients');
            setContacts(res.data);
        } catch (error) {
            console.error('Error fetching contacts', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (contactId) => {
        try {
            const res = await api.get(`/messages/${contactId}`);
            setMessages(res.data);
            if (res.data.length > 0 && !currentUserId) {
                // Infer current user ID from a message where we are sender or receiver
                const firstMsg = res.data[0];
                if (firstMsg.receiverId === contactId) {
                    setCurrentUserId(firstMsg.senderId);
                } else {
                    setCurrentUserId(firstMsg.receiverId);
                }
            }
        } catch (error) {
            console.error('Error fetching messages', error);
        }
    };

    const fetchUnreadCounts = async () => {
        try {
            const res = await getUnreadCountsPerContact();
            setUnreadCounts(res.data || {});
        } catch (error) {
            console.error('Error fetching unread counts', error);
        }
    };

    const handleContactSelect = async (contact) => {
        fetchMessages(contact.id);
        if (unreadCounts[contact.id] > 0) {
            try {
                await markMessagesAsRead(contact.id);
                setUnreadCounts(prev => ({ ...prev, [contact.id]: 0 }));
            } catch (err) {
                console.error('Failed to mark messages as read', err);
            }
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        try {
            const res = await api.post('/messages', {
                receiverId: selectedContact.id,
                content: newMessage,
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
            if (!currentUserId) setCurrentUserId(res.data.senderId);
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem', height: 'calc(100vh - 4rem)' }}>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-alt)' }}>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ padding: '0.4rem', marginRight: '1rem', border: 'none' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Messages</h2>
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Sidebar / Contacts */}
                    <div style={{ width: '300px', borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg)', overflowY: 'auto' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>
                            {userRole === 'PATIENT' ? 'Doctors' : 'Patients'}
                        </div>
                        {loading && <div style={{ padding: '1rem', textAlign: 'center' }}>Loading...</div>}
                        {!loading && contacts.length === 0 && <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No contacts found</div>}
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    background: selectedContact?.id === contact.id ? 'var(--bg-alt)' : 'transparent',
                                    transition: 'background 0.2s',
                                }}
                            >
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {contact.fullName?.charAt(0) || 'U'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500' }}>{contact.fullName}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{contact.email}</div>
                                </div>
                                {unreadCounts[contact.id] > 0 && (
                                    <div style={{
                                        background: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                    }}>
                                        {unreadCounts[contact.id] > 99 ? '99+' : unreadCounts[contact.id]}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Chat Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-alt)' }}>
                        {!selectedContact ? (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <User size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p>Select a contact to start messaging</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div style={{ padding: '1rem 1.5rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                                        {selectedContact.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <div style={{ fontWeight: '600' }}>{selectedContact.fullName}</div>
                                </div>

                                {/* Messages View */}
                                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {messages.length === 0 ? (
                                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No messages yet. Say hi!</div>
                                    ) : (
                                        messages.map((msg, index) => {
                                            const isMe = msg.senderId === currentUserId || msg.senderName === localStorage.getItem('fullName'); // fallback
                                            return (
                                                <div key={msg.id || index} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                                                    <div style={{
                                                        maxWidth: '70%',
                                                        padding: '0.8rem 1.2rem',
                                                        borderRadius: '1rem',
                                                        borderBottomRightRadius: isMe ? '0.25rem' : '1rem',
                                                        borderBottomLeftRadius: isMe ? '1rem' : '0.25rem',
                                                        background: isMe ? 'var(--primary)' : 'white',
                                                        color: isMe ? 'white' : 'var(--text)',
                                                        boxShadow: 'var(--shadow-sm)',
                                                        wordBreak: 'break-word',
                                                    }}>
                                                        <div style={{ marginBottom: '0.25rem' }}>{msg.content}</div>
                                                        <div style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'right' }}>
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <form onSubmit={handleSend} style={{ padding: '1rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', outline: 'none' }}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className="btn btn-primary" 
                                        style={{ width: '45px', height: '45px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
