import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashbord = ({ isAuthenticated }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "User"
  });
  const navigate = useNavigate();
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err));
  }, []);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;
    fetch("http://localhost:5000/users", {
      method: "Post",
      header: { "Content-type": "application/json" },
      body: JSON.stringify({ ...newUser, id: Date.now() })
    })
      .then(res => res.json())
      .then(data => setUsers([...users, data]))
      .catch(err => console.error(err));
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "User"
    });
  };

  const handleEditUser = item => {
    setEditingUser(item);
    setNewUser(item);
  };

  const handleUpdateUser = e => {
    e.preventDefault();
    fetch(`http://localhost:5000/users/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newUser)
    }).then(() => {
      setUsers(
        users.map(user => (user.id === editingUser.id ? newUser : user))
      );
      setEditingUser(null);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "User"
      });
    });
  };

  const handleDeleteUser = id => {
    console.log(id);
    fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" })
      .then(() => setNewUser(users.filter(user => user.id !== id)))
      .catch(err => console.error(err));
  };
  return (
    <div>
      <h2>Admin Dashbord - User Management</h2>
      <input
        type="text"
        placeholder="Seach by Name or Email"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <h3>Add New User</h3>
      <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={newUser.name}
            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="name"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="email"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="password"
          />
        </div>
        <div>
          <label>Role</label>
          <select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit">
          {editingUser ? "Update User" : "Add User"}
        </button>
      </form>

      <h3>User List</h3>
      <div className="user-list">
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(
                user =>
                  user.name.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase())
              )
              .map(item => {
                return (
                  <tr key={item.id}>
                    <td>
                      {item.name}
                    </td>
                    <td>
                      {item.email}
                    </td>
                    <td>
                      {item.role}
                    </td>
                    <td>
                      <button onClick={() => handleEditUser(item)}>Edit</button>
                      <button onClick={() => handleDeleteUser(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashbord;
