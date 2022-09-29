import React, { useEffect, useState } from 'react'
import {
    collection,
    getDocs,
    updateDoc,
    getDoc,
    setDoc,
    deleteDoc,
    doc as docFirebase,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore'
import { AlertTitle, Alert } from '@mui/material'

import { db, storage } from '../firebase/db'
import Product from '../components/Product'

const productsRef = collection(db, 'products')
const products = () => {
    const [products, setProducts] = useState([])
    useEffect(() => {
        const q = query(
            collection(db, 'products'),
            where('inCart', '==', false)
        )

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

    const addProductToCart = async (id) => {
        try {
            console.log(id)
            await updateDoc(docFirebase(db, 'products', id), {
                inCart: true,
            })
            setProducts((pre) => pre.filter((product) => product.id != id))
        } catch (error) {
            console.log(error)
        }
    }

    const deleteProduct = async (id) => {
        try {
            await deleteDoc(docFirebase(db, 'products', id))
            setProducts((pre) => pre.filter((product) => product.id != id))
            console.log('deleted:' + id)
        } catch (error) {
            console.log(error)
        }
    }

    const editProduct = async (id) => {}

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
                            addHandler={addProductToCart}
                            deleteHandler={deleteProduct}
                            editHandler={editProduct}
                        />
                    ))
                ) : (
                    <Alert severity='info' style={{ width: '100%' }}>
                        <AlertTitle>Info</AlertTitle>
                        No products found!
                    </Alert>
                )}
            </div>
        </div>
    )
}

export default products
