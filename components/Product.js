import React from 'react'
import { IconButton, FormControlLabel, Checkbox, Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'
import EditIcon from '@mui/icons-material/Edit'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

const Product = (props) => {
    const {
        name,
        price,
        image,
        id,
        addHandler,
        deleteHandler,
        editHandler,
        checkHandler,
        checked,
        amount,
        cart,
        changeAmountHandler,
    } = props

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
                    <div className='ms-4'>
                        <h3 className='name'>{name}</h3>
                        <p className='price m-0'>price: {price} €</p>
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
                        {editHandler && (
                            <IconButton
                                color='success'
                                aria-label='upload picture'
                                component='label'
                                onClick={() => editHandler(id)}
                            >
                                <EditIcon />
                            </IconButton>
                        )}
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
                        {amount && <Chip label={`amount: ${amount}`} />}
                        {changeAmountHandler && (
                            <IconButton
                                color='default'
                                aria-label='upload picture'
                                component='label'
                                onClick={() => changeAmountHandler(id, false)}
                                disabled={amount === 1}
                            >
                                <RemoveCircleIcon />
                            </IconButton>
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
                                <AddIcon />
                            </IconButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product
