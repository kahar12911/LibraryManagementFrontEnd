import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', authors: '', publishers: '' });
  const [newUser, setNewUser] = useState({ name: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBooks = async () => {
    const response = await fetch('/api/library/search?query=' + searchQuery);
    const data = await response.json();
    setBooks(data);
  };

  const addBook = async () => {
    await fetch('/api/library/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    });
    setNewBook({ title: '', authors: '', publishers: '' });
    fetchBooks();
  };

  const addUser = async () => {
    await fetch('/api/library/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    setNewUser({ name: '' });
    fetchUsers();
  };

  const fetchUsers = async () => {
    const response = await fetch('/api/library/user');
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Library Management System</h1>

        <div className="form-section">
          <h2>Add Book</h2>
          <input 
            type="text" 
            placeholder="Title" 
            value={newBook.title} 
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} 
          />
          <input 
            type="text" 
            placeholder="Authors" 
            value={newBook.authors} 
            onChange={(e) => setNewBook({ ...newBook, authors: e.target.value })} 
          />
          <input 
            type="text" 
            placeholder="Publishers" 
            value={newBook.publishers} 
            onChange={(e) => setNewBook({ ...newBook, publishers: e.target.value })} 
          />
          <button onClick={addBook}>Add Book</button>
        </div>

        <div className="form-section">
          <h2>Register User</h2>
          <input 
            type="text" 
            placeholder="User Name" 
            value={newUser.name} 
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
          />
          <button onClick={addUser}>Register User</button>
        </div>

        <div className="search-section">
          <h2>Search Books</h2>
          <input 
            type="text" 
            placeholder="Search by Title, Author, Publisher" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button onClick={fetchBooks}>Search</button>

          <ul>
            {books.map((book) => (
              <li key={book.bookID}>{book.title} by {book.authors}</li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
