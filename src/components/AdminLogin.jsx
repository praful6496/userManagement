import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";

const AdminLogin = ({setIsAuthenticated})=>{
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handleLogin = async (e)=>{
        e.preventDefault();
        setError("")

        try{
            const response = await fetch("http://localhost:5000/users");
            if(!response.ok){
                throw new Error("Failed to fecth users");
            }
            console.log(email,"email");
            console.log(password,"password");
            const users = await response.json();
            console.log(users,"users")
            const adminUser = users.find((user)=>user.email === email && user.password === password && user.role === "Admin");
            if(adminUser){
                setIsAuthenticated(true);
                navigate("/admin");
            }
            else{
                setError("Invalid creadentials");
            }
        }catch (err){
            console.log("Login error:", err)
            setError("Server Error.")
        }
    }
    return(
        <Container maxWidth="sm">
        <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
                Admin Login
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleLogin}>
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                />

                <Button type="submit" variant="contained" fullWidth sx={{backgroundColor:"#000", color:"white", mt:2}}>
                    Login
                </Button>
            </form>
        </Box>
    </Container>
    )
}

export default AdminLogin;