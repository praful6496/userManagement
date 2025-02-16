import { Badge, Box, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Navbar= ({cartCount })=>{
    return(<>
        <Box component={"nav"} sx={{backgroundColor: "black", color: "white", padding: "10px 0"}}>
        <Container>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "& a": {
                    color: "white",
                    textDecoration: "none",
                    padding: "0 10px",
                    fontSize: "20px",
                    "&:hover": {
                        color: "gray"
                    }
                }
            }}>
                <Link to="/" >Home</Link>
                <Link to="/cart" >Cart
                <Badge badgeContent={cartCount} color="error" sx={{ ml: 1 }}>
                            <ShoppingCartIcon />
                        </Badge></Link>
                <Link to="/login" >Login</Link>
            </Box>
        </Container>
        </Box>
    </>)
}

export default Navbar;