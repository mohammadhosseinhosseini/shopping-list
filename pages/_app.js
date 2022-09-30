import Naviagtion from '../components/Navigation'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import PopupAlert from '../components/PopupAlert'
import React, { useRef, useState, useEffect } from 'react'
import { updateDoc, doc as docFirebase } from 'firebase/firestore'
import { db } from '../firebase/db'

function MyApp({ Component, pageProps }) {
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    })

    const handleClose = () => {
        setAlert((pre) => ({ ...pre, open: false }))
    }

    const editNote = async (id, note) => {
        try {
            await updateDoc(docFirebase(db, 'products', id), {
                note: note,
                date: new Date(),
            })
        } catch (error) {
            console.log(error)
            setAlert({
                open: true,
                severity: 'error',
                message: 'Error updating note',
            })
        }
    }

    return (
        <div className='mt-5' style={{ paddingBottom: 55 }}>
            <Component {...pageProps} setAlert={setAlert} editNote={editNote} />
            <Naviagtion />
            <PopupAlert handleClose={handleClose} alert={alert} />
        </div>
    )
}

export default MyApp
