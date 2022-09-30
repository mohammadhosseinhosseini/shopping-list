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
    orderBy,
    limit,
} from 'firebase/firestore'
import { AlertTitle, Alert, Divider, Skeleton, Button } from '@mui/material'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox'

import { db, storage } from '../firebase/db'
import Product from '../components/Product'

const productsRef = collection(db, 'products')

const index = ({ setAlert, editNote }) => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    useEffect(() => {
        const q = query(collection(db, 'products'), where('inCart', '==', true))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const temp = []
            querySnapshot.forEach((doc) => {
                temp.push({ ...doc.data(), id: doc.id })
            })
            temp.sort((a, b) => b.date - a.date)
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
            await updateDoc(docFirebase(db, 'products', id), {
                inCart: false,
                amount: 1,
                checked: false,
                date: new Date(),
            })
            setAlert({
                open: true,
                severity: 'info',
                message: 'Product removed from cart',
            })
        } catch (error) {
            console.log(error)
        }
    }

    const checkProduct = async (id, isChecked) => {
        try {
            console.log(id)
            await updateDoc(docFirebase(db, 'products', id), {
                checked: !isChecked,
                date: new Date(),
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

    const resetAmount = async (id) => {
        try {
            await updateDoc(docFirebase(db, 'products', id), {
                amount: 1,
            })
        } catch (error) {
            console.log(error)
        }
    }

    const checkedProducts = products.filter((product) => product.checked)
    const uncheckedProducts = products.filter((product) => !product.checked)

    const toggleCheckAllProducts = async (checked) => {
        try {
            const q = query(
                collection(db, 'products'),
                where('checked', '==', !checked),
                where('inCart', '==', true)
            )
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(async (doc) => {
                await updateDoc(docFirebase(db, 'products', doc.id), {
                    checked,
                    date: new Date(),
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return (
            <div className='container'>
                <Skeleton
                    style={{
                        borderRadius: 10,
                    }}
                    variant='rectangular mb-3'
                    height={50}
                    width={220}
                />
                <div className='row row-cols-1 row-cols-lg-2'>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div className='col' key={i}>
                            <div className='py-3'>
                                <Skeleton
                                    style={{
                                        borderRadius: 20,
                                        width: '100%',
                                    }}
                                    variant='rectangular'
                                    height={150}
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
            <div className='d-flex align-items-center mb-3'>
                <h2 className='my-0 me-4'>
                    total:{' '}
                    {products
                        .map((p) => parseInt(p.amount) * parseFloat(p.price))
                        .reduce((accumulator, value) => {
                            return accumulator + value
                        }, 0)
                        .toFixed(2)}{' '}
                    €
                </h2>
                {uncheckedProducts.length > 0 && (
                    <Button
                        variant='outlined'
                        endIcon={<IndeterminateCheckBoxIcon />}
                        onClick={() => {
                            toggleCheckAllProducts(true)
                        }}
                    >
                        Check all
                    </Button>
                )}
            </div>

            {products.length > 0 ? (
                <>
                    {uncheckedProducts.length > 0 ? (
                        <div className='row row-cols-1 row-cols-lg-2'>
                            {uncheckedProducts.map((product, index) => (
                                <Product
                                    key={product.id}
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
                                    editNoteHandler={editNote}
                                    note={product.note}
                                    resetAmountHandler={resetAmount}
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
                    <div className='d-flex align-items-center'>
                        <h2 className='my-0 me-4'>Checked</h2>
                        {checkedProducts.length > 0 && (
                            <Button
                                variant='outlined'
                                endIcon={<IndeterminateCheckBoxIcon />}
                                onClick={() => {
                                    toggleCheckAllProducts(false)
                                }}
                            >
                                Uncheck all
                            </Button>
                        )}
                    </div>
                    <div className='row row-cols-1 row-cols-lg-2'>
                        {checkedProducts.map((product, index) => (
                            <Product
                                key={product.id}
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
                                editNoteHandler={editNote}
                                note={product.note}
                                resetAmountHandler={resetAmount}
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
