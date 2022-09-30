import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const EditNote = ({ open, handleClose, handleSave, noteVal }) => {
    const [note, setNote] = useState('')

    useEffect(() => {
        setNote(noteVal)
    }, [noteVal])

    const handleChange = (e) => {
        setNote(e.target.value)
    }

    const saveNote = () => {
        handleSave(note.trim())
        setNote('')
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Edit Note</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email
                        address here. We will send updates occasionally.
                    </DialogContentText> */}
                    <TextField
                        id='outlined-multiline-flexible'
                        multiline
                        type='text'
                        minRows={4}
                        fullWidth
                        value={note}
                        onChange={handleChange}
                        style={{ direction: 'rtl' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveNote}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default EditNote
