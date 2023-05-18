const router = require('express').Router()
const ctrls = require('../controllers/bookContent')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/create', [verifyAccessToken, isAdmin], ctrls.createBookContent)
router.get('/', ctrls.getAllBookContent)
router.put('/update/:id', [verifyAccessToken, isAdmin], ctrls.updateBookContent)
router.delete('/delete/:id', [verifyAccessToken, isAdmin], ctrls.deleteBookContent)
router.get('/:id', ctrls.getBookContent)
router.get('/books/:id/download', ctrls.downloadBook)

module.exports = router
