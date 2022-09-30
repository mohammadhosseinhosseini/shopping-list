import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import RestoreIcon from '@mui/icons-material/Restore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useRouter } from 'next/router'
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone'
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone'
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'

export default function Naviagtion() {
    const [value, setValue] = React.useState('')

    const router = useRouter()

    useEffect(() => {
        setValue(router.asPath)
    }, [router])

    const changeRoute = (event, newValue) => {
        router.push(
            window.location.protocol +
                '//' +
                window.location.hostname +
                (window.location.port ? ':' + window.location.port : '') +
                newValue
        )
        setValue(newValue)
    }

    return (
        <Box
            style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                width: '100%',
                backgroundColor: 'rgb(26, 32, 39)',
            }}
        >
            <BottomNavigation
                showLabels={false}
                value={value}
                onChange={changeRoute}
            >
                <BottomNavigationAction
                    label='Add'
                    value='/add'
                    icon={<AddCircleTwoToneIcon />}
                />
                <BottomNavigationAction
                    label='Home'
                    value='/'
                    icon={<ShoppingCartTwoToneIcon />}
                />
                <BottomNavigationAction
                    label='Products'
                    value='/products'
                    icon={<Inventory2TwoToneIcon />}
                />
                {value.includes('/edit') && (
                    <BottomNavigationAction
                        label='Edit'
                        value={value.includes('/edit') ? value : '/edit'}
                        icon={<EditTwoToneIcon />}
                    />
                )}
            </BottomNavigation>
        </Box>
    )
}
