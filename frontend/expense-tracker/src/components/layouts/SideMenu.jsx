import React, { useContext } from 'react'
import { SIDE_MENU_DATA } from '../../utils/data.js';
import { UserContext } from '../../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const SideMenu = ({activeMenu}) => {
    const { user, clearUser } = useContext(UserContext);

    const navigate = useNavigate();
    
    const [imageError, setImageError] = React.useState(false);

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    }

    const handleClick = (route) => {
        if (route === "logout") {
            handleLogout();
            return
        }
        navigate(route);
    }

    // Get profile image URL - handle different possible property names
    const profileImageUrl = user?.profileImageUrl || user?.profileImage || user?.imageUrl || user?.profilePic;
    const fullName = user?.fullName || user?.name || user?.username || "User";
    
    const showImage = profileImageUrl && !imageError;

  return (
    <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-15.25 z-20'>
        <div className='flex flex-col items-center justify-center gap-3 mt-3 mb-7'>
            {showImage ? (
                <img 
                  src={profileImageUrl} 
                  alt="Profile" 
                  className='w-20 h-20 bg-slate-400 rounded-full object-cover' 
                  onError={() => setImageError(true)}
                />
            ) : (
                <div className='w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full'>
                    <span className='text-2xl font-semibold text-primary'>{fullName.charAt(0).toUpperCase()}</span>
                </div>
            )}
           <h5 className='text-gray-950 font-medium leading-6 text-center'>
               {fullName}
           </h5>
        </div>

        {SIDE_MENU_DATA.map((item, index) => {
            const isLogout = item.label === "Logout";
            const normalClasses = activeMenu == item.label ? "text-white bg-primary" : "hover:bg-purple-50 hover:text-primary";
            const logoutClasses = "text-red-500 hover:bg-red-50 hover:text-red-600 active:bg-red-500 active:text-white";

            return (
                <button 
                    key={`menu_${index}`} 
                    className={`w-full flex items-center gap-4 text-[15px] ${isLogout ? logoutClasses : normalClasses} py-3 px-6 rounded-lg mb-3 cursor-pointer`} 
                    onClick={() => handleClick(item.path)}
                >
                    <item.icon className='text-xl'/>
                    {item.label}
                </button>
            );
        })}
    </div>
  )
}

export default SideMenu
