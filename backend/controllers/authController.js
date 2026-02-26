import User from '../models/User.js'
import jwt  from "jsonwebtoken"


//generate jwt token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//register user
export const registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body || {}

  //validation for missing field
  if (!fullName || !email || !password){
    return res.status(400).json({ message: "All fields are required" });
  }

  try{
    //check if email already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({message: "Email already in use"});
    }

    //create user
    const user = await User.create({
        fullName,
        email,
        password,
        profileImageUrl,
    })
    res.status(201).json({
        id: user._id,
        user,
        token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
}

//login user
export const loginUser = async (req, res) => {
    const {email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message:"All fields are required" });
    } 
    try {
        const user = await User.findOne({ email })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "invaild credentials" });
        }
        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res
          .status(500)
          .json({message: "Error registering user", error: err.message})
    }
}

//get user info
export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
    }
        res.status(200).json(user);

} catch (err) {
    res.status(500).json({ message: "Error fetching user info", error: err.message });
}}