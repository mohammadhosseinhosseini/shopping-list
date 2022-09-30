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
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage'
import {
    AlertTitle,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material'

import { db, storage } from '../firebase/db'
import Product from '../components/Product'

const productsRef = collection(db, 'products')
const products = ({ setAlert, editNote }) => {
    const [products, setProducts] = useState([])
    const [open, setOpen] = useState(false)
    const [deleteProductID, setDeleteProductID] = useState(null)

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
            temp.sort((a, b) => b.date - a.date)
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
            await updateDoc(docFirebase(db, 'products', id), {
                inCart: true,
                date: new Date(),
            })

            setAlert({
                open: true,
                severity: 'info',
                message: 'Product added to cart',
            })
        } catch (error) {
            console.log(error)
        }
    }

    const deleteProduct = async () => {
        if (deleteProductID == null) return
        try {
            if (
                products.find((p) => p.id == deleteProductID).image != undefined
            ) {
                const imageRef = ref(
                    storage,
                    products.find((p) => p.id == deleteProductID).image
                )
                try {
                    await deleteObject(imageRef)
                } catch (error) {
                    console.log(error)
                }
            }

            await deleteDoc(docFirebase(db, 'products', deleteProductID))
            setProducts((pre) =>
                pre.filter((product) => product.id != deleteProductID)
            )
            console.log('deleted:' + deleteProductID)
            setAlert({
                open: true,
                severity: 'success',
                message: 'Product deleted successfully',
            })
        } catch (error) {
            console.log(error)
        }
        setOpen(false)
    }

    const editProduct = async (id) => {}

    const handleClickOpen = (id) => {
        setOpen(true)
        setDeleteProductID(id)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div className='container'>
            {products.length > 0 ? (
                <div className='row row-cols-1 row-cols-lg-2'>
                    {products.map((product, index) => (
                        <Product
                            key={index}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            note={product.note}
                            id={product.id}
                            className='col'
                            addHandler={addProductToCart}
                            deleteHandler={handleClickOpen}
                            editHandler={editProduct}
                            editNoteHandler={editNote}
                        />
                    ))}
                </div>
            ) : (
                <Alert severity='info' style={{ width: '100%' }}>
                    <AlertTitle>Info</AlertTitle>
                    No products found!
                </Alert>
            )}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Are you sure you want to delete this product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={deleteProduct} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default products
