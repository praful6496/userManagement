import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

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
        <>
            <h2>
                Admin Login
            </h2>
            {error && <p style={{color:"red"}}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>email :</label>
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
                </div>
                <div>
                    <label>Password :</label>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default AdminLogin;