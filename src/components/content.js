import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DB_URL = 'https://todo-28281-default-rtdb.firebaseio.com';

const Content = () => {
    const [value, setvalue] = useState('');
    const [result, setresult] = useState([]);
    const [edit, edititem] = useState('');
    const [changevalue, changedvalue] = useState('');
    const [loading, setLoading] = useState(true);

    function addvalue(e) {
        setvalue(e.target.value);
    }

    function submitvalue() {
        if (!value.trim()) return;
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        axios.post(`${DB_URL}/todo.json`, JSON.stringify(value), options).then(() => {
            setvalue('');
            fetchvalue();
        });
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') submitvalue();
    }

    function fetchvalue() {
        setLoading(true);
        axios.get(`${DB_URL}/todo.json`)
            .then((response) => {
                const arr = [];
                const fetchedData = response.data;
                for (const key in fetchedData) {
                    arr.push({ key: key, value: fetchedData[key] });
                }
                setresult(arr);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }

    function deletevalue(event, key) {
        event.preventDefault();
        axios.delete(`${DB_URL}/todo/${key}.json`).then(() => {
            const updatedResult = result.filter((value) => value.key !== key);
            setresult(updatedResult);
        });
    }

    function editvalue(event, key) {
        event.preventDefault();
        const itemvalue = result.find((item) => item.key === key);
        edititem(itemvalue);
        changedvalue(itemvalue.value);
    }

    function cancelEdit(event) {
        event.preventDefault();
        edititem('');
        changedvalue('');
    }

    function savechange(e) {
        changedvalue(e.target.value);
    }

    function savevalue(event, key) {
        event.preventDefault();
        axios.put(`${DB_URL}/todo/${key}.json`, JSON.stringify(changevalue))
            .then(() => {
                const updatedResult = result.map((item) =>
                    item.key === key ? { ...item, value: changevalue } : item
                );
                setresult(updatedResult);
                edititem('');
                changedvalue('');
            })
            .catch((error) => {
                console.error('Error updating value:', error);
            });
    }

    useEffect(() => {
        fetchvalue();
    }, []);

    return (
        <div className="todo-wrap">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Outfit:wght@300;400;500;600&display=swap');

                .todo-wrap {
                    min-height: 100vh;
                    background:
                        radial-gradient(circle at 15% 20%, rgba(255, 138, 76, 0.12), transparent 40%),
                        radial-gradient(circle at 85% 80%, rgba(108, 99, 255, 0.12), transparent 40%),
                        #14121a;
                    font-family: 'Outfit', sans-serif;
                    padding: 48px 20px 80px;
                    color: #ece9f1;
                    box-sizing: border-box;
                }
                .todo-card {
                    max-width: 640px;
                    margin: 0 auto;
                    background: rgba(31, 28, 40, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    padding: 40px 36px;
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
                }
                .todo-header { margin-bottom: 32px; }
                .todo-eyebrow {
                    font-size: 12px;
                    letter-spacing: 0.32em;
                    text-transform: uppercase;
                    color: #ff8a4c;
                    font-weight: 500;
                    margin: 0 0 6px;
                }
                .todo-title {
                    font-family: 'Fraunces', serif;
                    font-size: 42px;
                    font-weight: 600;
                    line-height: 1;
                    margin: 0;
                    color: #fff;
                }
                .todo-count {
                    font-size: 14px;
                    color: #9a96a8;
                    margin-top: 10px;
                }
                .todo-input-row {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 28px;
                }
                .todo-input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 14px;
                    padding: 15px 18px;
                    font-size: 15px;
                    font-family: 'Outfit', sans-serif;
                    color: #fff;
                    outline: none;
                    transition: border 0.2s, background 0.2s;
                }
                .todo-input::placeholder { color: #76728a; }
                .todo-input:focus {
                    border-color: #ff8a4c;
                    background: rgba(255, 255, 255, 0.08);
                }
                .btn {
                    border: none;
                    border-radius: 14px;
                    padding: 0 22px;
                    font-size: 14px;
                    font-weight: 600;
                    font-family: 'Outfit', sans-serif;
                    cursor: pointer;
                    transition: transform 0.15s, filter 0.2s, opacity 0.2s;
                    white-space: nowrap;
                }
                .btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
                .btn:active { transform: translateY(0); }
                .btn-add {
                    background: linear-gradient(135deg, #ff8a4c, #ff5e7e);
                    color: #fff;
                    box-shadow: 0 8px 20px rgba(255, 94, 126, 0.3);
                }
                .todo-list { display: flex; flex-direction: column; gap: 10px; }
                .todo-item {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.07);
                    border-radius: 16px;
                    padding: 14px 16px;
                    transition: background 0.2s, border 0.2s, transform 0.2s;
                    animation: slideIn 0.35s ease both;
                }
                .todo-item:hover {
                    background: rgba(255, 255, 255, 0.07);
                    border-color: rgba(255, 138, 76, 0.4);
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .todo-num {
                    width: 30px;
                    height: 30px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 138, 76, 0.15);
                    color: #ff8a4c;
                    border-radius: 9px;
                    font-size: 13px;
                    font-weight: 600;
                }
                .todo-text { flex: 1; font-size: 15px; color: #ece9f1; word-break: break-word; }
                .todo-edit-input {
                    flex: 1;
                    background: rgba(0, 0, 0, 0.25);
                    border: 1px solid #ff8a4c;
                    border-radius: 10px;
                    padding: 9px 12px;
                    font-size: 15px;
                    font-family: 'Outfit', sans-serif;
                    color: #fff;
                    outline: none;
                }
                .todo-actions { display: flex; gap: 8px; flex-shrink: 0; }
                .icon-btn {
                    border: none;
                    border-radius: 10px;
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.15s, filter 0.2s;
                    color: #fff;
                }
                .icon-btn:hover { transform: translateY(-2px); filter: brightness(1.12); }
                .icon-btn svg { width: 17px; height: 17px; }
                .ib-edit { background: rgba(108, 99, 255, 0.22); color: #b3aeff; }
                .ib-save { background: linear-gradient(135deg, #2dd4a0, #1faf86); }
                .ib-cancel { background: rgba(255, 255, 255, 0.1); color: #c9c5d6; }
                .ib-delete { background: rgba(255, 94, 126, 0.18); color: #ff7a93; }
                .empty {
                    text-align: center;
                    padding: 48px 0;
                    color: #76728a;
                }
                .empty-emoji { font-size: 38px; margin-bottom: 8px; }
                .loading { text-align: center; padding: 40px 0; color: #9a96a8; }
            `}</style>

            <div className="todo-card">
                <div className="todo-header">
                    <p className="todo-eyebrow">Stay Organized</p>
                    <h1 className="todo-title">My Tasks</h1>
                    <p className="todo-count">
                        {result.length === 0 ? 'No tasks yet' : `${result.length} task${result.length > 1 ? 's' : ''} to go`}
                    </p>
                </div>

                <div className="todo-input-row">
                    <input
                        type="text"
                        className="todo-input"
                        value={value}
                        onChange={addvalue}
                        onKeyDown={handleKeyDown}
                        placeholder="What needs to be done?"
                    />
                    <button className="btn btn-add" onClick={submitvalue}>Add Task</button>
                </div>

                <div className="todo-list">
                    {loading ? (
                        <div className="loading">Loading your tasks…</div>
                    ) : result.length === 0 ? (
                        <div className="empty">
                            <div className="empty-emoji">🌱</div>
                            <div>Your list is empty. Add your first task above!</div>
                        </div>
                    ) : (
                        result.map((item, index) => (
                            <div className="todo-item" key={item.key}>
                                <span className="todo-num">{index + 1}</span>
                                {edit.key === item.key ? (
                                    <input
                                        type="text"
                                        className="todo-edit-input"
                                        value={changevalue}
                                        onChange={savechange}
                                        autoFocus
                                    />
                                ) : (
                                    <span className="todo-text">{item.value}</span>
                                )}
                                <div className="todo-actions">
                                    {edit.key === item.key ? (
                                        <>
                                            <button className="icon-btn ib-save" onClick={(e) => savevalue(e, item.key)} title="Save">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            </button>
                                            <button className="icon-btn ib-cancel" onClick={cancelEdit} title="Cancel">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </>
                                    ) : (
                                        <button className="icon-btn ib-edit" onClick={(e) => editvalue(e, item.key)} title="Edit">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                    )}
                                    <button className="icon-btn ib-delete" onClick={(e) => deletevalue(e, item.key)} title="Delete">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Content;