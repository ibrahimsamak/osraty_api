const moment = require('moment')
const boom = require('boom')
const fs = require('fs');
const async = require('async')

const { News } = require('../models/news')
const { NewsAttend } = require('../models/newsAttend')
const { getCurrentDateTime } = require('../models/Constant')

const cloudinary = require('cloudinary');


cloudinary.config({
    cloud_name: 'dztwo3qso',
    api_key: '761391876145368',
    api_secret: 'Sqfov5ua8c3514TJtzj27gpU9CY'
});

async function uploadImages(img) {
    return new Promise(function (resolve, reject) {
        cloudinary.v2.uploader.upload('./uploads/' + img,
            function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    console.log(result, error)
                    img = result['url']
                    resolve(img);
                }
            });
    });

}

exports.getNews = async (req, reply) => {
    try {
        var user_id = req.query.user_id
        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)

        var newResult = []
        var counter = 0;

        const total = await News.find({ type: req.params.type }).count();
        await News.find({ type: req.params.type })
            .sort({ _id: -1 })
            .skip((page) * limit)
            .limit(limit)
            .exec(function (err, result) {
                if (req.params.type == 2) {
                    result.forEach(async (element) => {
                        var attend = await NewsAttend.findOne({ user_id: user_id, news_id: element._id }).lean()
                        console.log(attend)
                        var obj = {
                            _id: element._id,
                            title: element.title,
                            details: element.details,
                            image: element.image,
                            createAt: element.createAt,
                            type: element.type,
                            place: element.place
                        }
                        if (attend) {
                            obj.isAttend = true
                        } else {
                            obj.isAttend = false
                        }

                        newResult.push(obj)
                        counter++;
                        if (counter === result.length) {
                            console.log('finish')
                            count = 0
                            const response = {
                                items: newResult,
                                status:true,
                                status_code: 200,
                                message: 'returned successfully',
                                pagenation: {
                                    size: result.length,
                                    totalElements: total,
                                    totalPages: Math.floor(total / limit),
                                    pageNumber: page
                                }
                            }
                            reply.send(response)
                        }
                    });
                } else {
                    const response = {
                        items: result,
                        status:true,
                        status_code: 200,
                        message: 'returned successfully',
                        pagenation: {
                            size: result.length,
                            totalElements: total,
                            totalPages: Math.floor(total / limit),
                            pageNumber: page
                        }
                    }
                    reply.send(response)
                }
            });
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getSingleNews = async (req, reply) => {
    try {
        const rs = await News.findById(req.params.id).sort({ _id: -1 })
        const response = {
            status_code: 200,
            status: true,
            message: 'تمت العملية بنجاح',
            items: rs
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.addNews = async (req, reply) => {
    try {
        if (req.raw.files) {
            const files = req.raw.files
            let fileArr = []
            for (let key in files) {
                fileArr.push({
                    name: files[key].name,
                    mimetype: files[key].mimetype
                })
            }
            console.log(files.filename.data)
            var data = new Buffer(files.filename.data);
            fs.writeFile('./uploads/' + files.filename.name, data, 'binary', function (err) {
                if (err) {
                    console.log("There was an error writing the image")
                }
                else {
                    console.log("The sheel file was written")
                }
            });

            let img = '';
            await uploadImages(files.filename.name).then((x) => {
                img = x;
            });
            console.log(img)


            let Advs = new News({

                title: req.raw.body.title,
                details: req.raw.body.details,
                image: img,
                createAt: getCurrentDateTime(),
                type: req.raw.body.type,
                place: req.raw.body.place
            });

            let rs = await Advs.save();
            // await updateCacheWithAdd('Advs', rs)
            const response = {
                status_code: 200,
                status: true,
                message: 'return succssfully',
                items: rs
            }

            reply.send(response);

        }

    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.updateNews = async (req, reply) => {
    try {
        if (req.raw.files) {
            const files = req.raw.files
            let fileArr = []
            for (let key in files) {
                fileArr.push({
                    name: files[key].name,
                    mimetype: files[key].mimetype
                })
            }
            var data = new Buffer(files.image.data);
            fs.writeFile('./uploads/' + files.image.name, data, 'binary', function (err) {
                if (err) {
                    console.log("There was an error writing the image")
                }
                else {
                    console.log("The sheel file was written")
                }
            });

            let img = '';
            await uploadImages(files.image.name).then((x) => {
                img = x;
            });

            const Advs = await News.findByIdAndUpdate((req.params.id), {
                title: req.raw.body.title,
                details: req.raw.body.details,
                image: img,
                createAt: getCurrentDateTime(),
                type: req.raw.body.type,
                place: req.raw.body.place
            }, { new: true })
            // await updateCacheWithUpdate('Advs', Advs, req.params.id)

            const response = {
                status_code: 200,
                status: true,
                message: 'return succssfully',
                items: Advs
            }
            return response

        } else {
            const Advs = await News.findByIdAndUpdate((req.params.id), {
                title: req.raw.body.title,
                details: req.raw.body.details,
                createAt: getCurrentDateTime(),
                type: req.raw.body.type,
                place: req.raw.body.place
            }, { new: true })
            // await updateCacheWithUpdate('Advs', Advs, req.params.id)

            const response = {
                status_code: 200,
                status: true,
                message: 'return succssfully',
                items: Advs
            }
            return response
        }
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.deleteNews = async (req, reply) => {
    try {
        await News.findByIdAndRemove(req.params.id);
        const response = {
            status_code: 200,
            status: true,
            message: 'return succssfully',
            items: []
        }
        return response
    } catch (err) {
        throw boom.boomify(err)
    }
}

//post going event
exports.updateGoing = async (req, reply) => {
    try {
        const checkrecord = await NewsAttend.findOne({ $and: [{ user_id: req.body.user_id }, { news_id: req.body.news_id }] })
        if (checkrecord) {
            //update
            const _NewssAttend = await NewsAttend.findByIdAndUpdate((req.body.news_id), {
                isGoing: req.body.isGoing
            }, { new: true })
            const response = {
                status_code: 200,
                status: true,
                message: 'return succssfully',
                items: _NewssAttend
            }
            return response

        } else {
            let _Newss = new NewsAttend({
                user_id: req.body.user_id,
                news_id: req.body.news_id,
                createAt: getCurrentDateTime(),
                isGoing: req.body.isGoing
            });

            let rs = await _Newss.save();
            const response = {
                status_code: 200,
                status: true,
                message: 'تمت العملية بنجاح',
                items: rs
            }
            return response
        }
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getAttend = async (req, reply) => {
    try {
        var page = parseInt(req.query.page, 10)
        var limit = parseInt(req.query.limit, 10)

        const total = await NewsAttend.find({ news_id: req.params.news_id }).count();
        await NewsAttend.find({ news_id: req.params.news_id })
            .populate('news_id')
            .populate('user_id')
            .sort({ _id: -1 })
            .skip((page) * limit)
            .limit(limit)
            .exec(function (err, result) {
                const response = {
                    items: result,
                    status:true,
                    status_code: 200,
                    message: 'returned successfully',
                    pagenation: {
                        size: result.length,
                        totalElements: total,
                        totalPages: Math.floor(total / limit),
                        pageNumber: page
                    }
                }
                reply.send(response)
            });
    } catch (err) {
        throw boom.boomify(err)
    }
}
