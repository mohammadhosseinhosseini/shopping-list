import { Button, TextField, Snackbar, IconButton, Alert } from '@mui/material'
import React, { useRef, useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import LoadingButton from '@mui/lab/LoadingButton'
import CloseIcon from '@mui/icons-material/Close'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone'
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage'
import { v4 } from 'uuid'
import Compressor from 'compressorjs'
import imageCompression from 'browser-image-compression'

import { db, storage } from '../firebase/db'
import Product from '../components/Product'

const add = ({ setAlert }) => {
    const [loading, setLoading] = useState(false)
    const [canUpload, setCanUpload] = useState(true)
    const [previewImage, setPreviewImage] = useState(null)

    const [imageUpload, setImageUpload] = useState(null)
    const [image, setImage] = useState(null)

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [note, setNote] = useState('')

    const addProduct = async (toProducts = true) => {
        if (name == '' || price == '' || imageUpload == null) {
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
                image: await handleUpload(),
                inCart: !toProducts,
                checked: false,
                amount: 1,
                note,
                date: new Date(),
            })
            console.log(newProduct)
            setAlert({
                open: true,
                message: 'Product added successfully',
                severity: 'success',
            })
            setName('')
            setPrice('')
            setNote('')
            setImage(null)
            setImageUpload(null)
            setPreviewImage(null)
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

        if (image != null) {
            const imageRef = ref(storage, image)
            await deleteObject(imageRef)
        }

        try {
            const compressedFile = await imageCompression(imageUpload, {
                maxSizeMB: 0.1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            })

            console.log(`OriginalFile size ${imageUpload.size / 1024} KB`)
            console.log(`compressedFile size ${compressedFile.size / 1024} KB`)

            const imageRef = ref(
                storage,
                `images/${v4() + '_' + compressedFile.name}`
            )
            const snapshot = await uploadBytes(imageRef, compressedFile)
            setCanUpload(false)

            setAlert({
                open: true,
                message: 'Image uploaded successfully',
                severity: 'success',
            })

            return getDownloadURL(snapshot.ref).then((url) => {
                setImage(url)
                console.log(url)
                return url
            })
        } catch (error) {
            console.log(error)
            setAlert({
                open: true,
                message: 'Error uploading image',
                severity: 'error',
            })
        }
    }

    const onChangeInputText = (e) => {
        if (e.target.name == 'name') {
            setName(e.target.value)
        } else if (e.target.name == 'price') {
            setPrice(e.target.value)
        }
    }

    const onChangeInputFile = async (event) => {
        setImageUpload(event.target.files[0])
        setCanUpload(true)
        const source = URL.createObjectURL(event.target.files[0])
        setPreviewImage(source)
    }

    const canAdd = name != '' && price != '' && imageUpload != null

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
                        loading={loading}
                        endIcon={<AddPhotoAlternateTwoToneIcon />}
                    >
                        Choose File
                        <input
                            type='file'
                            accept='image/*'
                            hidden
                            onChange={onChangeInputFile}
                        />
                    </LoadingButton>
                    {/* <LoadingButton
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
                    </LoadingButton> */}
                </div>
                <div className='d-flex mt-3'>
                    <LoadingButton
                        variant='outlined'
                        onClick={addProduct}
                        loading={loading}
                        disabled={!canAdd}
                        fullWidth
                        endIcon={<Inventory2TwoToneIcon />}
                    >
                        Add to Products
                    </LoadingButton>
                    <div className='mx-2'></div>
                    <LoadingButton
                        variant='outlined'
                        onClick={() => {
                            addProduct(false)
                        }}
                        loading={loading}
                        disabled={!canAdd}
                        fullWidth
                        endIcon={<AddShoppingCartIcon />}
                    >
                        Add to Cart
                    </LoadingButton>
                </div>

                <Product
                    className='mt-4'
                    name={name}
                    price={price}
                    image={previewImage}
                    editNoteHandler={(note) => {
                        setNote(note)
                    }}
                    note={note}
                    inEdit
                />
            </div>
        </div>
    )
}

export default add
