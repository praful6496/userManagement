import React, { useEffect, useState } from "react";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, Snackbar } from "@mui/material";

const Cart = ({fetchCartCount}) => {
  const [cart, setCart] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const res = await fetch("http://localhost:5000/cart");
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const handleRemove = async (item) => {
    setDeletedItems([...deletedItems, item]);
    setCart(cart.filter(cartItem => cartItem.id !== item.id));
  
    setOpenSnackbar(true);
  
    setTimeout(async () => {
      if (!deletedItems.find(deleted => deleted.id === item.id)) {
        try {
          await fetch(`http://localhost:5000/cart/${item.id}`, { method: "DELETE" });
          await fetchCartCount();
        } catch (error) {
          console.error("Error removing item:", error);
        }
      }
    }, 2000);
  };  

  const handleUndoRemove = (id) => {
    const restoredItem = deletedItems.find(item => item.id === id);
    if (!restoredItem) return;

    setCart([...cart, restoredItem]);
    setDeletedItems(deletedItems.filter(item => item.id !== id));

    if (deletedItems.length === 1) {
      setOpenSnackbar(false);
    }
  };

  const handleQuantityChange = async (id, delta) => {
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item
    );

    const updatedItem = updatedCart.find(item => item.id === id);
    if (!updatedItem) return;

    try {
      await fetch(`http://localhost:5000/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: updatedItem.quantity })
      });
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const totalPrice = cart.reduce((acc, item) => acc + (Number(item.price) * (Number(item.quantity) || 1)), 0);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>Shopping Cart</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleQuantityChange(item.id, -1)}>-</Button>
                  {item.quantity || 1}
                  <Button onClick={() => handleQuantityChange(item.id, 1)}>+</Button>
                </TableCell>
                <TableCell>${(Number(item.price) * (Number(item.quantity) || 1)).toFixed(2)}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleRemove(item)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" sx={{ mt: 2 }}>Total Price: ${totalPrice.toFixed(2)}</Typography>
      <Snackbar
        open={openSnackbar}
        message="Item removed"
        action={
          <div>
            {deletedItems.map(item => (
              <Button key={item.id} color="secondary" size="small" onClick={() => handleUndoRemove(item.id)}>
                Undo {item.name}
              </Button>
            ))}
          </div>
        }
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      />
    </Container>
  );
};

export default Cart;
