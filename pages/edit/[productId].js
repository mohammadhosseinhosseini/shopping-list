import { useRouter } from 'next/router'

import { Button, TextField } from '@mui/material'
import React, { useRef, useState, useEffect } from 'react'
import {
    collection,
    addDoc,
    doc as docFirebase,
    getDoc,
    updateDoc,
    onSnapshot,
} from 'firebase/firestore'
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
import imageCompression from 'browser-image-compression'

import { db, storage } from '../../firebase/db'
import Product from '../../components/Product'

const editProduct = ({ setAlert, editNote }) => {
    const [loading, setLoading] = useState(false)
    const [canUpload, setCanUpload] = useState(true)
    const [previewImage, setPreviewImage] = useState(null)

    const [imageUpload, setImageUpload] = useState(null)
    const [image, setImage] = useState(null)

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [note, setNote] = useState('')

    const [productExists, setProductExists] = useState(false)

    const router = useRouter()
    const { productId } = router.query

    useEffect(() => {
        const getProduct = async () => {
            console.log(productId)
            if (productId) {
                const docRef = docFirebase(db, 'products', productId)

                const unsub = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        console.log('Document data:', docSnap.data())
                        setName(docSnap.data().name)
                        setPrice(docSnap.data().price)
                        setImage(docSnap.data().image)
                        setNote(docSnap.data().note)
                        setProductExists(true)
                    } else {
                        // doc.data() will be undefined in this case
                        console.log('No such document!')
                        setAlert({
                            open: true,
                            message: 'Product not found',
                            severity: 'error',
                        })
                        return
                    }
                })

                // const docSnap = await getDoc(docRef)
            }
        }
        getProduct()
    }, [productId])

    const editProduct = async (toProducts = true) => {
        if (!productExists) {
            setAlert({
                open: true,
                message: 'Product not found',
                severity: 'error',
            })
            return
        }

        if (name == '' || price == '') {
            setAlert({
                open: true,
                message: 'Please fill all the fields',
                severity: 'error',
            })
            return
        }

        setLoading(true)
        try {
            await updateDoc(docFirebase(db, 'products', productId), {
                name: name,
                price: parseFloat(price),
                image: imageUpload ? await handleUpload() : image,
                inCart: !toProducts,
                date: new Date(),

                // note,
            })

            setAlert({
                open: true,
                message: 'Product updated successfully',
                severity: 'success',
            })
        } catch (error) {
            console.log(error)
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
            console.log('deleted: ' + image)
        }

        const imageRef = ref(storage, `images/${v4() + '_' + imageUpload.name}`)
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

    const canAdd = name != '' && price != ''

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
                        onClick={editProduct}
                        loading={loading}
                        disabled={!canAdd}
                        fullWidth
                        endIcon={<Inventory2TwoToneIcon />}
                    >
                        Edit and Add to Products
                    </LoadingButton>
                    <div className='mx-2'></div>
                    <LoadingButton
                        variant='outlined'
                        onClick={() => {
                            editProduct(false)
                        }}
                        loading={loading}
                        disabled={!canAdd}
                        fullWidth
                        endIcon={<AddShoppingCartIcon />}
                    >
                        Edit and Add to Cart
                    </LoadingButton>
                </div>

                <Product
                    className='mt-4'
                    name={name}
                    price={price}
                    note={note}
                    id={productId}
                    image={previewImage || image}
                    inEdit
                    editNoteHandler={editNote}
                />
            </div>
        </div>
    )
}

export default editProduct
