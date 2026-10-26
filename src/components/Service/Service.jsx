import { Outlet } from 'react-router-dom'
import { useHandleTitle } from '../../utils/handleTitle'

export const Service = () => {
    useHandleTitle()
    return (
        <>
            <Outlet />
        </>
    )
}
