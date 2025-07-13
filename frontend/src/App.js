import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const apiUrl = "http://localhost:5000/contacts";

function App() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", address: "", email: "", phone: "", id: null });
  const [sortKey, setSortKey] = useState("firstName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchContacts = async () => {
    const res = await axios.get(apiUrl);
    setContacts(res.data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: form.address,
    };
    if (form.id) {
      await axios.put(`${apiUrl}/${form.id}`, { ...data, id: form.id });
    } else {
      await axios.post(apiUrl, data);
    }
    setForm({ firstName: "", lastName: "", address: "", email: "", phone: "", id: null });
    fetchContacts();
  };

  const handleEdit = (contact) => {
    setForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      id: contact.id,
    });
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleDelete = async () => {
    if (confirmDeleteId !== null) {
      await axios.delete(`${apiUrl}/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      fetchContacts();
    }
  };

  const filteredContacts = contacts
    .filter((c) => (c.firstName + " " + c.lastName).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aKey = sortKey === "name" ? (a.firstName + " " + a.lastName) : a[sortKey];
      const bKey = sortKey === "name" ? (b.firstName + " " + b.lastName) : b[sortKey];
      if (aKey < bKey) return sortOrder === "asc" ? -1 : 1;
      if (aKey > bKey) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container">
      <h2>Contact Manager</h2>
      <div className="grid">
        <form className="form" onSubmit={handleSubmit}>
          <h3>Add Contact</h3>
          <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          <input type="text" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <button type="submit">{form.id ? "Update" : "Add"}</button>
        </form>

        <div className="list">
          <h3>Contact List</h3>
          <input type="text" placeholder="Search Contact" value={search} onChange={(e) => setSearch(e.target.value)} />
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort("name")}>Name</th>
                <th onClick={() => toggleSort("phone")}>Phone</th>
                <th onClick={() => toggleSort("email")}>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((c) => (
                <tr key={c.id}>
                  <td>{c.firstName} {c.lastName}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>{c.address}</td>
                  <td>
                    <button className="edit" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="delete" onClick={() => confirmDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr><td colSpan="5">No contacts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirmDeleteId !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this contact?</p>
            <div className="modal-buttons">
              <button className="delete" onClick={handleDelete}>Yes, Delete</button>
              <button onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
