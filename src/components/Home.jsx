import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, CardMedia, Typography, Button, Container } from "@mui/material";

const Home = ({fetchCartCount})=>{
    const [products, setProducts] = useState([])

    useEffect(()=> {
        fetch("http://localhost:5000/products")
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err=>console.error(err))
        
    },[])

    const addToCart = async (product) => {
        const res = await fetch("http://localhost:5000/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });

        if (res.ok) {
            alert(`${product.name} added to cart!`);
            fetchCartCount();
        }
    };

    return (
        <Container>
        <Typography variant="h3" sx={{textAlign:"center", marginY:"20px"}} >Products</Typography>
        <Grid container spacing={3} justifyContent="center">
            {
                products.map((item)=>{
                    return(
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                        <Card sx={{ maxWidth: 300, m: 2, p: 1 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.image}
                                alt={item.name}
                            />
                            <CardContent>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    ${item.price}
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{backgroundColor:"#000", color:"white", mt:1}}
                                    fullWidth
                                    onClick={() => addToCart(item)}
                                >
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    )

                })
            }
        </Grid>
        </Container>
    )
}

export default Home;