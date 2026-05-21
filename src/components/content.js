import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DB_URL = 'https://todo-28281-default-rtdb.firebaseio.com';

const Content = () => {

    const [value, setvalue] = useState('');
    const [result, setresult] = useState([]);
    const [edit, edititem] = useState('');
    const [changevalue, changedvalue] = useState('');

    function addvalue(e) {
        setvalue(e.target.value);
    }

    // Normalizes a stored item into { text, done }.
    // Supports old data saved as a plain string AND new data saved as an object.
    function normalize(raw) {
        if (raw && typeof raw === 'object') {
            return { text: raw.text ?? '', done: !!raw.done };
        }
        return { text: raw, done: false };
    }

    function submitvalue() {
        if (!value.trim()) return;
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        const payload = { text: value, done: false };
        axios.post(`${DB_URL}/todo.json`, JSON.stringify(payload), options).then(() => {
            console.log("success");
            setvalue('');
            fetchvalue();
        });
    }

    function fetchvalue() {
        axios.get(`${DB_URL}/todo.json`)
            .then((response) => {
                var arr = [];
                const fetchedData = response.data;
                for (const key in fetchedData) {
                    const item = normalize(fetchedData[key]);
                    arr.push({ key: key, text: item.text, done: item.done });
                }
                setresult(arr);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    function deletevalue(event, key) {
        event.preventDefault();
        axios.delete(`${DB_URL}/todo/${key}.json`).then(() => {
            console.log("delete successfully");
            const updatedResult = result.filter(item => item.key !== key);
            setresult(updatedResult);
        });
    }

    function toggleDone(event, key) {
        event.preventDefault();
        const target = result.find(item => item.key === key);
        if (!target) return;
        const newDone = !target.done;
        const payload = { text: target.text, done: newDone };
        axios.put(`${DB_URL}/todo/${key}.json`, JSON.stringify(payload))
            .then(() => {
                const updatedResult = result.map((item) =>
                    item.key === key ? { ...item, done: newDone } : item
                );
                setresult(updatedResult);
            })
            .catch((error) => {
                console.error("Error toggling task:", error);
            });
    }

    function editvalue(event, key) {
        event.preventDefault();
        let itemvalue = result.find(item => item.key === key);
        edititem(itemvalue);
        changedvalue(itemvalue.text);
    }

    function savechange(e) {
        changedvalue(e.target.value);
    }

    function savevalue(event, key) {
        event.preventDefault();
        const target = result.find(item => item.key === key);
        const payload = { text: changevalue, done: target ? target.done : false };
        axios.put(`${DB_URL}/todo/${key}.json`, JSON.stringify(payload))
            .then(() => {
                const updatedResult = result.map((item) =>
                    item.key === key ? { ...item, text: changevalue } : item
                );
                setresult(updatedResult);
                edititem('');
                changedvalue('');
            })
            .catch((error) => {
                console.error("Error updating value:", error);
            });
    }

    useEffect(() => {
        fetchvalue();
    }, []);

    const completedCount = result.filter(item => item.done).length;

    return (
        <div className="todo-page">
            <style>{`
                .todo-page {
                    min-height: 100vh;
                    background-color: #f4f6fa;
                    padding: 50px 15px;
                }
                .todo-container {
                    max-width: 760px;
                    margin: 0 auto;
                    background: #ffffff;
                    border: 1px solid #e6e9ef;
                    border-radius: 12px;
                    box-shadow: 0 4px 24px rgba(20, 30, 60, 0.06);
                    overflow: hidden;
                }
                .todo-head {
                    background: #1f3a5f;
                    color: #fff;
                    padding: 28px 32px;
                }
                .todo-head h1 {
                    margin: 0;
                    font-size: 26px;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                }
                .todo-head p {
                    margin: 4px 0 0;
                    font-size: 14px;
                    color: #b9c6da;
                }
                .todo-body { padding: 28px 32px 32px; }
                .todo-input-group {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 26px;
                }
                .todo-input-group .form-control {
                    height: 46px;
                    border-radius: 8px;
                    border: 1px solid #cfd6e2;
                    padding: 0 14px;
                    font-size: 15px;
                }
                .todo-input-group .form-control:focus {
                    border-color: #1f3a5f;
                    box-shadow: 0 0 0 3px rgba(31, 58, 95, 0.12);
                }
                .todo-add-btn {
                    height: 46px;
                    padding: 0 24px;
                    border-radius: 8px;
                    white-space: nowrap;
                    font-weight: 500;
                }
                .todo-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin: 0;
                }
                .todo-table thead th {
                    background: #f4f6fa;
                    color: #5a6b85;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    padding: 12px 14px;
                    border-bottom: 1px solid #e6e9ef;
                }
                .todo-table tbody td {
                    padding: 14px;
                    border-bottom: 1px solid #eef1f6;
                    vertical-align: middle;
                    font-size: 15px;
                    color: #2c3a52;
                }
                .todo-table tbody tr:last-child td { border-bottom: none; }
                .todo-table tbody tr:hover { background: #fafbfd; }
                .col-status { width: 56px; text-align: center; }
                .col-num { width: 64px; text-align: center; color: #8a97ac !important; font-weight: 600; }
                .col-action { width: 230px; }
                .action-cell { display: flex; gap: 8px; justify-content: flex-start; }
                .action-cell .btn { min-width: 78px; font-size: 14px; font-weight: 500; }
                .edit-input {
                    height: 40px;
                    border-radius: 8px;
                    border: 1px solid #1f3a5f;
                    padding: 0 12px;
                    width: 100%;
                    font-size: 15px;
                    box-shadow: 0 0 0 3px rgba(31, 58, 95, 0.1);
                }
                .empty-state {
                    text-align: center;
                    padding: 40px 14px;
                    color: #8a97ac;
                    font-size: 15px;
                }
                .task-check {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    accent-color: #2e9e6b;
                }
                .task-done .task-text {
                    text-decoration: line-through;
                    color: #9aa6ba;
                }
                .badge-done {
                    display: inline-block;
                    background: #e6f6ee;
                    color: #2e9e6b;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 3px 9px;
                    border-radius: 20px;
                    margin-left: 8px;
                    vertical-align: middle;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                }
            `}</style>

            <div className="todo-container">
                <div className="todo-head">
                    <h1>To-Do List</h1>
                    <p>
                        {result.length === 0
                            ? 'No tasks yet'
                            : `${completedCount} of ${result.length} completed`}
                    </p>
                </div>

                <div className="todo-body">
                    <div className="todo-input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={value}
                            onChange={addvalue}
                            onKeyDown={(e) => e.key === 'Enter' && submitvalue()}
                            placeholder="Enter a new task"
                        />
                        <button className="btn btn-primary todo-add-btn" onClick={submitvalue}>Add Task</button>
                    </div>

                    <table className="todo-table">
                        <thead>
                            <tr>
                                <th className="col-status">Done</th>
                                <th className="col-num">Si No.</th>
                                <th>Task</th>
                                <th className="col-action">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="empty-state">Your task list is empty. Add a task to get started.</td>
                                </tr>
                            ) : (
                                result.map((item, index) => (
                                    <tr key={item.key} className={item.done ? 'task-done' : ''}>
                                        <td className="col-status">
                                            <input
                                                type="checkbox"
                                                className="task-check"
                                                checked={item.done}
                                                onChange={(e) => toggleDone(e, item.key)}
                                            />
                                        </td>
                                        <td className="col-num">{index + 1}</td>
                                        {edit.key === item.key ? (
                                            <td>
                                                <input
                                                    type="text"
                                                    className="edit-input"
                                                    value={changevalue}
                                                    onChange={savechange}
                                                    autoFocus
                                                />
                                            </td>
                                        ) : (
                                            <td>
                                                <span className="task-text">{item.text}</span>
                                                {item.done && <span className="badge-done">Completed</span>}
                                            </td>
                                        )}
                                        <td className="col-action">
                                            <div className="action-cell">
                                                {edit.key === item.key ? (
                                                    <button className="btn btn-success" onClick={(e) => savevalue(e, item.key)}>Save</button>
                                                ) : (
                                                    <button className="btn btn-warning" onClick={(e) => editvalue(e, item.key)}>Edit</button>
                                                )}
                                                <button className="btn btn-danger" onClick={(e) => deletevalue(e, item.key)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Content;