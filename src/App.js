import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_URL = 'http://localhost:8082/api/library';

function App() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', authors: '', publishers: '' });
  const [newUser, setNewUser] = useState({ name: '' });
  const [newBookCopy, setNewBookCopy] = useState({ bookId: '', rackNumber: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [borrowInfo, setBorrowInfo] = useState({ userId: '', bookId: '' });
  const [returnBookId, setReturnBookId] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleNetworkError = (error) => {
    setError(`Network error: ${error.message}`);
    console.error('Network error:', error);
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/search?query=${searchQuery}`);
      if (!response.ok) throw new Error(`Failed to fetch books: ${response.status}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const addBook = async () => {
    try {
      await fetch(`${BASE_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });
      setNewBook({ title: '', authors: '', publishers: '' });
      setSuccessMessage('Book added successfully!');
      fetchBooks();
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const addUser = async () => {
    try {
      await fetch(`${BASE_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      setNewUser({ name: '' });
      setSuccessMessage('User registered successfully!');
      fetchUsers();
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const addBookCopy = async () => {
    try {
      await fetch(`${BASE_URL}/bookcopy?bookId=${newBookCopy.bookId}&rackNumber=${newBookCopy.rackNumber}`, {
        method: 'POST'
      });
      setNewBookCopy({ bookId: '', rackNumber: '' });
      setSuccessMessage('Book copy added successfully!');
      fetchBooks();
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user`);
      if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const borrowBook = async () => {
    try {
      await fetch(`${BASE_URL}/borrow?userId=${borrowInfo.userId}&bookId=${borrowInfo.bookId}`, {
        method: 'POST'
      });
      setBorrowInfo({ userId: '', bookId: '' });
      setSuccessMessage('Book borrowed successfully!');
      fetchBooks();
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const returnBook = async () => {
    try {
      await fetch(`${BASE_URL}/return?bookId=${returnBookId}`, {
        method: 'POST'
      });
      setReturnBookId('');
      setSuccessMessage('Book returned successfully!');
      fetchBooks();
    } catch (error) {
      handleNetworkError(error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Library Management System</h1>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <div className="form-section">
          <h2>Add Book</h2>
          <input type="text" placeholder="Title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
          <input type="text" placeholder="Authors" value={newBook.authors} onChange={(e) => setNewBook({ ...newBook, authors: e.target.value })} />
          <input type="text" placeholder="Publishers" value={newBook.publishers} onChange={(e) => setNewBook({ ...newBook, publishers: e.target.value })} />
          <button onClick={addBook}>Add Book</button>
        </div>

        <div className="form-section">
          <h2>Register User</h2>
          <input type="text" placeholder="User Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
          <button onClick={addUser}>Register User</button>
        </div>

        <div className="form-section">
          <h2>Add Book Copy</h2>
          <input type="text" placeholder="Book ID" value={newBookCopy.bookId} onChange={(e) => setNewBookCopy({ ...newBookCopy, bookId: e.target.value })} />
          <input type="text" placeholder="Rack Number" value={newBookCopy.rackNumber} onChange={(e) => setNewBookCopy({ ...newBookCopy, rackNumber: e.target.value })} />
          <button onClick={addBookCopy}>Add Book Copy</button>
        </div>

        <div className="form-section">
          <h2>Borrow Book</h2>
          <input type="text" placeholder="User ID" value={borrowInfo.userId} onChange={(e) => setBorrowInfo({ ...borrowInfo, userId: e.target.value })} />
          <input type="text" placeholder="Book ID" value={borrowInfo.bookId} onChange={(e) => setBorrowInfo({ ...borrowInfo, bookId: e.target.value })} />
          <button onClick={borrowBook}>Borrow Book</button>
        </div>

        <div className="form-section">
          <h2>Return Book</h2>
          <input type="text" placeholder="Book Copy ID" value={returnBookId} onChange={(e) => setReturnBookId(e.target.value)} />
          <button onClick={returnBook}>Return Book</button>
        </div>

        <div className="search-section">
          <h2>Search Books</h2>
          <input type="text" placeholder="Search by Title, Author, Publisher" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
