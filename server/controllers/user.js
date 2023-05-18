const User = require('../models/user')
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')

const register = asyncHandler(async (req, res) => {
    const { username, password, name, address } = req.body
    if (!username || !password || !name || !address)
        return res.status(400).json({
            sucess: false,
            mes: "Missing Inputs"
        })

    const user = await User.findOne({ username })
    if (user) throw new Error("User has exsited!")
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            succes: newUser ? true : false,
            mes: newUser ? 'Register is successfully. Please go login' : 'something went wrong'
        })
    }
})

// Refresh token => cấp mới access token
// Access token => xác thực người dùng, phân quyền người dùng
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        return res.status(400).json({
            sucess: false,
            mes: "Msssing Inputs"
        })
    const response = await User.findOne({ username })
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, refreshToken, ...userData } = response.toObject()
        const accessToken = generateAccessToken(response._id, role)
        const newRefreshToken = generateRefreshToken(response._id)
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            sucess: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid crendentials!')
    }

})
const getUserById = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : "User not found"
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("No refresh token in cookies");
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, refreshToken: refreshToken });
    if (!user) throw new Error('Refresh token not matched');
    const accessToken = generateAccessToken(user._id, user.role);
    return res.status(200).json({ success: true, accessToken: accessToken });
});

const logOut = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(400).json({ success: false, message: "No refresh token found in cookies." });
        return;
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: null });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    res.status(200).json({ success: true, message: "User logged out successfully." });
});



const getAllUsers = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error('Mising inputs')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response ? `user with email ${response.email} deleted` : "No user delete"
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Mising inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Some thing went wrong"
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { _id } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Mising inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Some thing went wrong"
    })
})

module.exports = {
    register,
    login,
    getUserById,
    refreshAccessToken,
    logOut,
    getAllUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin
}