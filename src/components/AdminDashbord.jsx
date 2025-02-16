import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Paper,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const AdminDashboard = ({ isAuthenticated }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "User"
  });
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(
    () => {
      if (!isAuthenticated) navigate("/login");
      fetch("http://localhost:5000/users")
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.log(err));
    },
    [isAuthenticated, navigate]
  );

  const handleAddUser = e => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newUser, id: Date.now() })
    })
      .then(res => res.json())
      .then(data => setUsers([...users, data]))
      .catch(err => console.error(err));
    setNewUser({ name: "", email: "", password: "", role: "User" });
  };

  const handleEditUser = item => {
    setEditingUser(item);
    setNewUser(item);
  };

  const handleUpdateUser = e => {
    e.preventDefault();
    fetch(`http://localhost:5000/users/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    }).then(() => {
      setUsers(
        users.map(user => (user.id === editingUser.id ? newUser : user))
      );
      setEditingUser(null);
      setNewUser({ name: "", email: "", password: "", role: "User" });
    });
  };

  const handleDeleteUser = id => {
    fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" })
      .then(() => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      })
      .catch(err => console.error(err));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        Admin Dashboard - User Management
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {editingUser ? "Edit User" : "Add New User"}
        </Typography>
        <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
          <TextField
            fullWidth
            label="Name"
            value={newUser.name}
            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
          <Button variant="contained" sx={{backgroundColor:"#000", color:"white"}} type="submit" fullWidth>
            {editingUser ? "Update User" : "Add User"}
          </Button>
        </form>
      </Paper>
      <Typography variant="h6" sx={{ mb: 2 }}>
        User List
      </Typography>
      <TextField
        fullWidth
        label="Search by Name or Email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Role</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter(
                user =>
                  user.name.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase())
              )
              .map(item =>
                <TableRow key={item.id}>
                  <TableCell>
                    {item.name}
                  </TableCell>
                  <TableCell>
                    {item.email}
                  </TableCell>
                  <TableCell>
                    {item.role}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEditUser(item)}>
                      <IconButton aria-label="delete" size="large">
                        <EditIcon />
                      </IconButton>
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(item.id)}
                    >
                      <IconButton aria-label="delete" size="large">
                        <DeleteIcon />
                      </IconButton>
                    </Button>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard;
