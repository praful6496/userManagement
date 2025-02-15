import React, { useEffect, useState } from "react";

const Home = ()=>{
    const [products, setProducts] = useState([])

    useEffect(()=> {
        fetch("http://localhost:5000/products")
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err=>console.error(err))
    },[])

    return (
        <>
        <h1>Products</h1>
        <div>
            {
                products.map((item)=>{
                    <div key={item.id}>
                        <img src={item.img} />
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>{item.price}</p>
                    </div>
                })
            }
        </div>
        </>
    )
}

export default Home;