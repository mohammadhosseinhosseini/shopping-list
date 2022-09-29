import React, { useEffect, useState } from 'react'
import {
    collection,
    getDocs,
    updateDoc,
    getDoc,
    setDoc,
    doc as docFirebase,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore'
import { AlertTitle, Alert } from '@mui/material'

import { db, storage } from '../firebase/db'
import Product from '../components/Product'

const productsRef = collection(db, 'products')
const Products = ({ cart }) => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const q = query(collection(db, 'products'), where('inCart', '==', cart))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const temp = []
            querySnapshot.forEach((doc) => {
                temp.push({ ...doc.data(), id: doc.id })
            })
            setProducts(temp)
        })

        // const getProducts = async () => {
        //     const docsSnap = await getDocs(q)
        //     setProducts(
        //         docsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        //     )
        // }
        // getProducts()
    }, [])

    const changeProductCart = async (id) => {
        try {
            console.log(id)
            await updateDoc(docFirebase(db, 'products', id), {
                inCart: !cart,
            })
            setProducts((pre) => pre.filter((product) => product.id != id))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='container'>
            <div className='row row-cols-1 row-cols-lg-2'>
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <Product
                            key={index}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            id={product.id}
                            className='col'
                            changeProductCart={changeProductCart}
                            cart={cart}
                        />
                    ))
                ) : (
                    <Alert severity='info' style={{ width: '100%' }}>
                        <AlertTitle>Info</AlertTitle>
                        {cart ? 'Cart is empty!' : 'No products found!'}
                    </Alert>
                )}
            </div>
        </div>
    )
}

export default Products
