const mongoose = require('mongoose')

const categories = mongoose.Schema({
    category_name: String,
    category_color: String,
    category_image: String,
    special_category: Boolean,
})

module.exports = mongoose.model('categories',categories)