const userRouter = require('./user')
const categoryRouter = require('./category')
const bookRouter = require('./book')
const bookContentRouter = require('./bookcontent')

const { notFound, errHandler } = require('../middlewares/errHandler');


const initRouters = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/category', categoryRouter)
    app.use('/api/book', bookRouter)
    app.use('/api/bookcontent', bookContentRouter)


    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRouters