import { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../utils/axiosinstance"
import { API_PATHS } from "../utils/apiPaths"

export const useUserAuth = () => {
    const {user, updateUser, clearUser, loading} = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(()=>{
        // Wait for loading to complete
        if (loading) return;

        const token = localStorage.getItem("token");
        
        // If no token, redirect to login
        if (!token) {
            navigate("/login");
            return;
        }

        // If user already exists, no need to fetch again
        if (user) return;

        let isMounted = true;

        const fetchUserInfo = async () =>{
            try{
                const response = await axiosInstance.get(API_PATHS.AUTH.GET.USER_INFO);
                if (isMounted && response.data){
                    updateUser(response.data);
                }
            }catch(error){
                console.error("Error fetching user info:", error);
                if (isMounted){
                    clearUser();
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            }

        }
        fetchUserInfo();
        return () => {
            isMounted = false;
        }
    }, [user, loading, updateUser, clearUser, navigate])
}