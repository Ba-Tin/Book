const Book = require('../models/book')
const asyncHandler = require('express-async-handler');

const createBook = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error("Missing inputs")
    const newBook = await Book.create(req.body)
    return res.status(200).json({
        success: newBook ? true : false,
        createdBook: newBook ? newBook : "Cannot create new book"
    })
})

const getBook = asyncHandler(async (req, res) => {
    const { id } = req.params
    const book = await Book.findById(id)
    return res.status(200).json({
        success: book ? true : false,
        bookData: book ? book : "Cannot get book"
    })
})
//Filtering, sorting && pagination
const getAllBook = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    //Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(item => delete queries[item])

    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedItem => `$${macthedItem}`)
    const formatedQuires = JSON.parse(queryString)
    //Filtering
    if (queries?.title) formatedQuires.title = { $regex: queries.title, $options: 'i' }
    let queryCommand = Book.find(formatedQuires)
    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(" ")
        queryCommand = queryCommand.sort(sortBy)

    }

    //Fiels limiting
    if (req.query.fields) {
        console.log(req.query.fields);
        const fields = req.query.fields.split(',').join(" ")
        queryCommand = queryCommand.select(fields)
    }

    //Pagination
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_BOOK
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    //Execute query
    // số lượng sản phẩm thõa mãn điều kiện !== số lượng sp trả về
    queryCommand.exec().then(async response => {
        const counts = await Book.find(formatedQuires).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            counts,
            books: response ? response : "Cannot get book",
        });
    }).catch(err => {
        throw new Error(err.message);
    });
})

const updateBook = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updateBook = await Book.findByIdAndUpdate(id, req.body, { new: true })
    return res.status(200).json({
        success: updateBook ? true : false,
        updateBook: updateBook ? updateBook : "Cannot update book"
    })
})


const deleteBook = asyncHandler(async (req, res) => {
    const { id } = req.params
    const deleteBook = await Book.findByIdAndDelete(id)
    return res.status(200).json({
        success: deleteBook ? true : false,
        deleteBook: deleteBook ? deleteBook : "Cannot delete book"
    })
})


//đánh giá
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, bid } = req.body
    if (!star || !bid) throw new Error("Missing inputs")
    const ratingBook = await Book.findById(bid)
    const alreadyRating = ratingBook?.ratings?.find(el => el.postedBy.toString() === _id)
    console.log({ alreadyRating });
    if (alreadyRating) {
        //update start & comment
        await Book.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: {
                "ratings.$.star": star,
                "ratings.$.comment": comment
            }
        }, { new: true })
    } else {
        //add star & comment
        const response = await Book.findByIdAndUpdate(bid, {
            $push: { ratings: { star, comment, postedBy: _id } }
        }, { new: true })
    }

    // sum rating
    const updatedBook = await Book.findById(bid)
    const ratingCount = updatedBook.ratings.length
    const sumRatings = updatedBook.ratings.reduce((sum, item) => sum + +item.star, 0)
    updatedBook.totalsRatings = Math.round(sumRatings * 10 / ratingCount) / 10

    await updatedBook.save()

    return res.status(200).json({
        status: true,
        updatedBook
    })
})


module.exports = {
    createBook,
    getBook,
    getAllBook,
    updateBook,
    deleteBook,
    ratings
}