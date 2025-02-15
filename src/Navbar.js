import React from "react";
import { Link } from "react-router-dom";

const Navbar= ({cart})=>{
    const totalItem = cart.reduce((acc, item) => acc + item.quantity, 0);
    return(<>
        <nav>
            <Link to="/" >Home</Link>
            <Link to="/cart" >Cart({totalItem})</Link>
        </nav>
    </>)
}

export default Navbar;