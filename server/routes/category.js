const router = require('express').Router()
const ctrls = require('../controllers/category')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/create', [verifyAccessToken, isAdmin], ctrls.createCategory)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getAllCategory)
router.delete('/:_id', [verifyAccessToken, isAdmin], ctrls.deleteCategory)
router.put('/:_id', [verifyAccessToken, isAdmin], ctrls.updateCategory)



module.exports = router