const router = require('express').Router()
const ctrls = require('../controllers/book')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/create', [verifyAccessToken, isAdmin], ctrls.createBook)
router.get('/', ctrls.getAllBook)
router.put('/ratings', verifyAccessToken, ctrls.ratings)
router.put('/update/:id', [verifyAccessToken, isAdmin], ctrls.updateBook)
router.delete('/delete/:id', [verifyAccessToken, isAdmin], ctrls.deleteBook)
router.get('/:id', ctrls.getBook)

module.exports = router