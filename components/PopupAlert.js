import { Snackbar, Alert } from '@mui/material'
import React, { useRef, useState, useEffect } from 'react'

const PopupAlert = ({ alert, handleClose }) => {
    // useEffect(() => {
    //     if (alert.open) {
    //         setTimeout(() => {
    //             handleClose()
    //         }, 1000)
    //     }
    // }, [alert])

    return (
        <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                onClose={handleClose}
                severity={alert.severity}
                sx={{ width: '100%' }}
            >
                {alert.message}
            </Alert>
        </Snackbar>
    )
}

export default PopupAlert
