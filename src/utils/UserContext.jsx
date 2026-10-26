import { createContext, useState, useEffect } from 'react'
import { apiTogetAll, apiToPost } from './ApiServices'
import { useMatches, } from 'react-router-dom'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await apiTogetAll('comptes/session/',{ withCredentials: true });
                setUser(userData);
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    const logoutFront = async () => {
        try {
            await apiToPost("comptes/logout/", {});
            setUser(null)
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error)
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, logoutFront, loading }}>
            {!loading && children}
        </UserContext.Provider>
    )
}