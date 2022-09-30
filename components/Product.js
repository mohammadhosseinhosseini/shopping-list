import React, { useState } from 'react'
import { IconButton, FormControlLabel, Checkbox, Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'
import EditIcon from '@mui/icons-material/Edit'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import NoteAddTwoToneIcon from '@mui/icons-material/NoteAddTwoTone'
import StickyNote2TwoToneIcon from '@mui/icons-material/StickyNote2TwoTone'
import Link from 'next/link'
import PaymentsTwoToneIcon from '@mui/icons-material/PaymentsTwoTone'
import RestartAltTwoToneIcon from '@mui/icons-material/RestartAltTwoTone'
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone'

import EditNote from './EditNote'

const Product = (props) => {
    const {
        name,
        price,
        image,
        id,
        addHandler,
        deleteHandler,
        checkHandler,
        editNoteHandler,
        checked,
        amount,
        cart,
        note,
        changeAmountHandler,
        inEdit,
        resetAmountHandler,
    } = props

    const [openNote, setOpenNote] = useState(false)

    const handleClickOpen = () => {
        setOpenNote(true)
    }

    const handleCloseNote = () => {
        setOpenNote(false)
    }

    const handleEditNote = (note) => {
        if (id != undefined) {
            editNoteHandler(id, note)
        } else {
            editNoteHandler(note)
        }
        setOpenNote(false)
    }

    return (
        <div className={props.className}>
            <div className='py-2 py-lg-3'>
                <div
                    className='d-flex p-3 p-lg-4'
                    style={{
                        backgroundColor: '#eee',
                        borderRadius: 20,
                        position: 'relative',
                    }}
                >
                    <div className=''>
                        {image ? (
                            <img
                                src={image}
                                alt=''
                                style={{
                                    width: 120,
                                    height: 120,
                                    backgroundColor: '#ddd',
                                    borderRadius: 20,
                                    objectFit: 'cover',
                                    boxShadow:
                                        '0px 0px 10px 0px rgba(0,0,0,0.2)',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: 120,
                                    height: 120,
                                    backgroundColor: '#ddd',
                                    borderRadius: 20,
                                }}
                            ></div>
                        )}
                    </div>
                    <div className='ps-4 pe-4 w-100 '>
                        <h3 className='name'>{name}</h3>
                        <div className='price mb-2 d-flex align-items-center'>
                            <p className='my-1'>price: {price} € </p>
                            {amount > 1 && (
                                <>
                                    <Chip
                                        label={(
                                            parseFloat(price) * parseInt(amount)
                                        ).toFixed(2)}
                                        icon={<PaymentsTwoToneIcon />}
                                        variant='outlined'
                                        className='ms-1 ms-lg-3'
                                        color='success'
                                    />
                                </>
                            )}
                        </div>
                        {note != undefined && note.length > 0 && (
                            <div className='note w-100 d-flex mb-5 mb-lg-4'>
                                <StickyNote2TwoToneIcon className='me-2' />
                                <p className='m-0' style={{ direction: 'rtl' }}>
                                    {note}
                                </p>
                            </div>
                        )}
                    </div>

                    <div
                        className='d-flex  justify-content-center'
                        style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                        }}
                    >
                        {inEdit != true && (
                            <IconButton
                                color='success'
                                aria-label='upload picture'
                                component='label'
                            >
                                <Link href={`/edit/${id}`}>
                                    <EditIcon />
                                </Link>
                            </IconButton>
                        )}
                    </div>

                    <div
                        className='d-flex flex-column justify-content-center'
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                        }}
                    >
                        {checkHandler && (
                            <Checkbox
                                checked={checked}
                                onChange={() => {
                                    checkHandler(id, checked)
                                }}
                            />
                        )}
                        <IconButton
                            color='default'
                            aria-label='upload picture'
                            component='label'
                            onClick={handleClickOpen}
                        >
                            <NoteAddTwoToneIcon />
                        </IconButton>
                    </div>
                    <div
                        className={`d-flex  justify-content-center align-items-center ${
                            !cart && 'flex-column'
                        }`}
                        style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                        }}
                    >
                        {resetAmountHandler && (
                            <IconButton
                                color='default'
                                aria-label='upload picture'
                                component='label'
                                onClick={() => {
                                    resetAmountHandler(id)
                                }}
                                disabled={amount === 1}
                            >
                                <RestartAltTwoToneIcon />
                            </IconButton>
                        )}
                        {amount && <Chip label={`${amount}`} />}
                        {changeAmountHandler && (
                            <>
                                <IconButton
                                    color='default'
                                    aria-label='upload picture'
                                    component='label'
                                    onClick={() =>
                                        changeAmountHandler(id, false)
                                    }
                                    disabled={amount === 1}
                                >
                                    <RemoveCircleIcon />
                                </IconButton>
                            </>
                        )}
                        {changeAmountHandler && (
                            <IconButton
                                color='default'
                                aria-label='upload picture'
                                component='label'
                                onClick={() => changeAmountHandler(id, true)}
                            >
                                <AddCircleIcon />
                            </IconButton>
                        )}
                        {deleteHandler && (
                            <IconButton
                                color='error'
                                aria-label='upload picture'
                                component='label'
                                onClick={() => deleteHandler(id)}
                            >
                                {cart ? (
                                    <RemoveShoppingCartIcon />
                                ) : (
                                    <DeleteIcon />
                                )}
                            </IconButton>
                        )}
                        {addHandler && (
                            <IconButton
                                color='primary'
                                aria-label='upload picture'
                                component='label'
                                onClick={() => addHandler(id)}
                            >
                                <AddShoppingCartTwoToneIcon />
                            </IconButton>
                        )}
                    </div>
                </div>
            </div>
            <EditNote
                open={openNote}
                handleClose={handleCloseNote}
                handleSave={handleEditNote}
                noteVal={note}
            />
        </div>
    )
}

export default Product
