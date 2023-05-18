const BookContent = require('../models/book_content')
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs')
const asyncHandler = require('express-async-handler');


const createBookContent = asyncHandler(async (req, res) => {
    const { book_id, content } = req.body
    if (!book_id, !content)
        return res.status(400).json({
            success: false,
            mes: "Missing Inputs"
        })
    const bookContent = await BookContent.findOne({ book_id })
    if (bookContent) throw new Error("Book has content")
    else {
        const newContent = await BookContent.create(req.body)
        return res.status(200).json({
            sucess: newContent ? true : false,
            mess: newContent ? "Add Content Book succes" : "Faild"
        })
    }
})

const updateBookContent = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updateBookContent = await BookContent.findByIdAndUpdate(id, req.body, { new: true })
    return res.status(200).json({
        success: updateBookContent ? true : false,
        updateBookContent: updateBookContent ? updateBookContent : "Cannot update content"
    })
})
const deleteBookContent = asyncHandler(async (req, res) => {
    const { id } = req.params
    const deleteBook = await BookContent.findByIdAndDelete(id)
    return res.status(200).json({
        success: deleteBook ? true : false,
        deleteBook: deleteBook ? deleteBook : "Cannot delete book content"
    })
})

const getBookContent = asyncHandler(async (req, res) => {
    const { id } = req.params
    const bookContent = await BookContent.findById(id)
    return res.status(200).json({
        success: bookContent ? true : false,
        bookContentData: bookContent ? bookContent.content : "Book content not found"
    })
})
const getAllBookContent = asyncHandler(async (req, res) => {
    const response = await BookContent.find()
    return res.status(200).json({
        success: response ? true : false,
        bookcontents: response
    })
})
const downloadBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const bookContent = await BookContent.findById(bookId).populate('book_id');
        if (!bookContent) {
            return res.status(404).json({ error: 'Book content not found' });
        }
        const pdfDoc = new PDFDocument();
        const buffers = [];

        pdfDoc.on('data', (buffer) => buffers.push(buffer));
        pdfDoc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${bookContent.book_id.title}.pdf"`);
            res.attachment(`${bookContent.book_id.title}.pdf`);
            res.send(pdfData);
        });

        pdfDoc.text(bookContent.content);
        pdfDoc.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
module.exports = {
    createBookContent,
    updateBookContent,
    getBookContent,
    getAllBookContent,
    deleteBookContent,
    downloadBook
};