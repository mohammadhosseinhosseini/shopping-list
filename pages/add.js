import { Button, TextField, Snackbar, IconButton, Alert } from '@mui/material'
import React, { useRef, useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import LoadingButton from '@mui/lab/LoadingButton'
import CloseIcon from '@mui/icons-material/Close'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage'
import { v4 } from 'uuid'

import { db, storage } from '../firebase/db'
import Product from '../components/Product'

const add = () => {
    const [loading, setLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)
    const [canUpload, setCanUpload] = useState(true)
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    })
    const [imageUpload, setImageUpload] = useState(null)
    const [image, setImage] = useState(null)

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')

    const handleClose = () => {
        setAlert((pre) => ({ ...pre, open: false }))
    }

    const addProduct = async () => {
        if (name == '' || price == '' || image == null) {
            setAlert({
                open: true,
                message: 'Please fill all the fields',
                severity: 'error',
            })
            return
        }

        setLoading(true)
        try {
            const productsRef = collection(db, 'products')
            const newProduct = await addDoc(productsRef, {
                name: name,
                price: parseFloat(price),
                image,
                inCart: false,
                checked: false,
                amount: 1,
            })
            console.log(newProduct)
            setAlert({
                open: true,
                message: 'Product added successfully',
                severity: 'success',
            })
            setName('')
            setPrice('')
            setImage(null)
            setImageUpload(null)
        } catch (error) {
            setAlert({
                open: true,
                message: 'Something went wrong',
                severity: 'error',
            })
        }
        setLoading(false)
    }

    const handleUpload = async () => {
        if (imageUpload == null || !canUpload) {
            setAlert({
                open: true,
                message: 'Please select an image',
                severity: 'error',
            })
            return
        }
        setImageLoading(true)

        if (image != null) {
            const imageRef = ref(storage, image)
            await deleteObject(imageRef)
        }

        const imageRef = ref(storage, `images/${v4() + '_' + imageUpload.name}`)
        try {
            const snapshot = await uploadBytes(imageRef, imageUpload)

            setAlert({
                open: true,
                message: 'Image uploaded successfully',
                severity: 'success',
            })

            getDownloadURL(snapshot.ref).then((url) => {
                setImage(url)
                console.log(url)
            })

            setCanUpload(false)
        } catch (error) {
            console.log(error)
            setAlert({
                open: true,
                message: 'Error uploading image',
                severity: 'error',
            })
        }
        setImageLoading(false)
    }

    const onChangeInputText = (e) => {
        if (e.target.name == 'name') {
            setName(e.target.value)
        } else if (e.target.name == 'price') {
            setPrice(e.target.value)
        }
    }

    return (
        <div className='container' style={{ maxWidth: '576px' }}>
            <div className='d-flex flex-column'>
                <TextField
                    type='text'
                    placeholder='Name'
                    name='name'
                    onChange={onChangeInputText}
                    value={name}
                />
                <TextField
                    type='number'
                    placeholder='Price'
                    className='mt-3'
                    name='price'
                    onChange={onChangeInputText}
                    value={price}
                />
                <div className='d-flex mt-3 '>
                    <LoadingButton
                        className='flex-fill me-2'
                        variant='outlined'
                        component='label'
                        loading={imageLoading}
                    >
                        Choose File
                        <input
                            type='file'
                            accept='image/*'
                            hidden
                            onChange={(event) => {
                                setImageUpload(event.target.files[0])
                                setCanUpload(true)
                            }}
                        />
                    </LoadingButton>
                    <LoadingButton
                        className='flex-fill'
                        size='medium'
                        onClick={handleUpload}
                        endIcon={<DriveFolderUploadIcon />}
                        loading={imageLoading}
                        loadingPosition='end'
                        variant='outlined'
                        disabled={imageUpload == null || !canUpload}
                    >
                        Upload Image
                    </LoadingButton>
                </div>
                <LoadingButton
                    className='mt-3'
                    variant='outlined'
                    onClick={addProduct}
                    loading={loading}
                >
                    Add
                </LoadingButton>

                <Product
                    className='mt-4'
                    name={name}
                    price={price}
                    image={image}
                />

                <Snackbar
                    open={alert.open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity={alert.severity}
                        sx={{ width: '100%' }}
                    >
                        {alert.message}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    )
}

export default add
