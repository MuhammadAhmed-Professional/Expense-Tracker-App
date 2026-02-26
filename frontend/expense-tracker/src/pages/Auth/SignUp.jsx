import React, {useContext, useState} from 'react'
import AuthLayout from "../../components/layouts/AuthLayout"
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();

  //handle signup form submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your name");
      return
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address")
      return
    }
    if (!password) {
      setError("please enter the password")
      return;
    }

    setError("");

    // SignUp API call
      try {

        // Upload profile picture if selected
        if(profilePic) {
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || ""
        }

        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          fullName,
          email,
          password,
          profileImageUrl
        })

        const {token, user} = response.data;
        
        console.log("SignUp response:", response.data);
        console.log("User data:", user);

        if(token) {
          localStorage.setItem("token", token);
          updateUser(user);
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/dashboard");
        } 
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred during registration. Please try again.");
        }
      }
  }
  return (
    <div>
      <AuthLayout>
        <div className='lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
          <h3 className="text-xl font-semibold text-black">Create an Account</h3>
          <p className="text-xs text-slate-700 mt-1.25 mb-6">Please enter your details to create an account</p>

          <form onSubmit={handleSignUp}>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={({target}) => setFullName(target.value)}
            />
             <Input
              label="Email Address"
              type="text"
              placeholder="Enter your email address"
              value={email}
              onChange={({target}) => setEmail(target.value)}
            />

            <div className='col-span-2'>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={({target}) => setPassword(target.value)}
              />
            </div>
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">SIGN UP</button>
          <p className=" text-[13px] text-slate-800 mt-3">Already have an account? <Link className="font-medium text-primary underline" to="/login">LogIn</Link></p>
          </form>
        </div>
      </AuthLayout>
    </div>
  )
}

export default SignUp
