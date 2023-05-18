const Category = require('../models/category')
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const { category_name } = req.body
    if (!category_name)
        return res.status(400).json({
            sucess: false,
            mes: "Msssing Inputs"
        })

    const category = await Category.findOne({ category_name })
    if (category) throw new Error("User has exsited!")
    else {
        const newCategory = await Category.create(req.body)
        return res.status(200).json({
            succes: newCategory ? true : false,
            mes: newCategory ? 'Success' : 'something went wrong'
        })
    }
});
const getAllCategory = asyncHandler(async (req, res) => {
    const response = await Category.find()
    return res.status(200).json({
        success: response ? true : false,
        category: response
    })
})
// const getCategoryById = async (req, res) => {
//     const { id } = req.params;
//     const category = await Category.findById(id);
//     res.status(200).json({
//         succes: category ? true : false,
//         mess: category ? category : "Not found"
//     });

// }
const updateCategory = asyncHandler(async (req, res) => {
    const { _id } = req.params
    console.log(_id);
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Mising inputs')
    const response = await Category.findByIdAndUpdate(_id, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedCategory: response ? response : "Some thing went wrong"
    })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { _id } = req.params
    if (!_id) throw new Error('Mising inputs')
    const response = await Category.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deleteCategory: response ? `delete success ` : "No category delete"
    })
})



module.exports = {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
    // getCategoryById
}