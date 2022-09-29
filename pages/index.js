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
import { AlertTitle, Alert, Divider, Skeleton } from '@mui/material'

import { db, storage } from '../firebase/db'
import Product from '../components/Product'

const productsRef = collection(db, 'products')

const index = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    useEffect(() => {
        const q = query(collection(db, 'products'), where('inCart', '==', true))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const temp = []
            querySnapshot.forEach((doc) => {
                temp.push({ ...doc.data(), id: doc.id })
            })
            setProducts(temp)
            setLoading(false)
        })

        // const getProducts = async () => {
        //     const docsSnap = await getDocs(q)
        //     setProducts(
        //         docsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        //     )
        // }
        // getProducts()
    }, [])

    const deleteProductFromCart = async (id) => {
        try {
            console.log(id)
            await updateDoc(docFirebase(db, 'products', id), {
                inCart: false,
            })
            setProducts((pre) => pre.filter((product) => product.id != id))
        } catch (error) {
            console.log(error)
        }
    }

    const checkProduct = async (id, isChecked) => {
        try {
            console.log(id)
            await updateDoc(docFirebase(db, 'products', id), {
                checked: !isChecked,
            })
        } catch (error) {
            console.log(error)
        }
    }

    const changeAmount = async (id, increase) => {
        try {
            console.log(id)
            const docSnap = await getDoc(docFirebase(db, 'products', id))
            const { amount } = docSnap.data()
            if (amount === undefined) amount = 0
            if (amount == 1 && !increase) return
            await updateDoc(docFirebase(db, 'products', id), {
                amount: increase ? amount + 1 : amount - 1,
            })
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return (
            <div className='container'>
                <div className='row row-cols-1 row-cols-lg-2'>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div className='col'>
                            <div className='py-3'>
                                <Skeleton
                                    style={{
                                        borderRadius: 20,
                                        width: '100%',
                                    }}
                                    variant='rectangular'
                                    height={150}
                                    key={i}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='container'>
            {products.length > 0 ? (
                <>
                    {products.filter(({ checked }) => !checked).length > 0 ? (
                        <div className='row row-cols-1 row-cols-lg-2'>
                            {products
                                .filter(({ checked }) => !checked)
                                .map((product, index) => (
                                    <Product
                                        key={index}
                                        name={product.name}
                                        price={product.price}
                                        image={product.image}
                                        checked={product.checked}
                                        amount={product.amount}
                                        id={product.id}
                                        className='col'
                                        deleteHandler={deleteProductFromCart}
                                        checkHandler={checkProduct}
                                        cart
                                        chandleChangeAmount={changeAmount}
                                    />
                                ))}
                        </div>
                    ) : (
                        <Alert severity='info' className=''>
                            <AlertTitle>Info</AlertTitle>
                            You purchased all the products in your cart!
                        </Alert>
                    )}
                    <Divider className='w-100 my-4' />
                    <h2>Checked</h2>
                    <div className='row row-cols-1 row-cols-lg-2'>
                        {products
                            .filter(({ checked }) => checked)
                            .map((product, index) => (
                                <Product
                                    key={index}
                                    name={product.name}
                                    price={product.price}
                                    image={product.image}
                                    checked={product.checked}
                                    amount={product.amount}
                                    id={product.id}
                                    className='col'
                                    deleteHandler={deleteProductFromCart}
                                    checkHandler={checkProduct}
                                    cart
                                    changeAmountHandler={changeAmount}
                                />
                            ))}
                    </div>
                </>
            ) : (
                <Alert severity='info' style={{ width: '100%' }}>
                    <AlertTitle>Info</AlertTitle>
                    Cart is empty!
                </Alert>
            )}
        </div>
    )
}

export default index
