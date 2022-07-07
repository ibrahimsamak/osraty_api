const moment = require("moment");
const boom = require("boom");
const fs = require("fs");
const async = require("async");

const { News,Articles ,Comments } = require("../models/news");
const { NewsAttend } = require("../models/newsAttend");
const { getCurrentDateTime } = require("../models/Constant");

const cloudinary = require("cloudinary");
const { Favorite } = require("../models/Favorite");

cloudinary.config({
  cloud_name: "dztwo3qso",
  api_key: "761391876145368",
  api_secret: "Sqfov5ua8c3514TJtzj27gpU9CY"
});

async function uploadImages(img) {
  return new Promise(function(resolve, reject) {
    cloudinary.v2.uploader.upload("./uploads/" + img, function(error, result) {
      if (error) {
        reject(error);
      } else {
        console.log(result, error);
        img = result["url"];
        resolve(img);
      }
    });
  });
}

exports.getNews = async (req, reply) => {
  try {
    var newResult = [];
    var counter = 0;
    var user_id = req.query.user_id;
    var page = parseInt(req.query.page, 10);
    var limit = parseInt(req.query.limit, 10);

    const total = await News.find({ type: req.params.type }).count();
    var result = await News.find({ type: req.params.type })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      if (req.params.type == 2) {
        if (result) {
          result.forEach(async element => {
            var attend = await NewsAttend.findOne({
              user_id: user_id,
              news_id: element._id
            }).lean();
            console.log(attend);
            var obj = {
              _id: element._id,
              title: element.title,
              details: element.details,
              image: element.image,
              createAt: element.createAt,
              type: element.type,
              place: element.place
            };
            if (attend) {
              obj.isAttend = true;
            } else {
              obj.isAttend = false;
            }

            newResult.push(obj);
            counter++;
            if (counter === result.length) {
              console.log("finish");
              count = 0;
              const response = {
                items: newResult,
                status: true,
                status_code: 200,
                message: "returned successfully",
                pagenation: {
                  size: result.length,
                  totalElements: total,
                  totalPages: Math.floor(total / limit),
                  pageNumber: page
                }
              };
              reply.send(response);
            }
          });
        } else {
          const response = {
            items: [],
            status: true,
            status_code: 200,
            message: "returned successfully"
          };
          reply.send(response);
        }
      } else {
        const response = {
          items: result,
          status: true,
          status_code: 200,
          message: "returned successfully",
          pagenation: {
            size: result.length,
            totalElements: total,
            totalPages: Math.floor(total / limit),
            pageNumber: page
          }
        };
        reply.send(response);
      }
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getArticles = async (req, reply) => {
  try {
    var newResult = [];
    var counter = 0;
    var user_id = req.user._id;
    var page = parseInt(req.query.page, 10);
    var limit = parseInt(req.query.limit, 10);
    console.log(user_id)

    var arr = []
    const total = await Articles.find({}).count();
    let result = await Articles.find({})
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
        for await(const item of result){
          let newItem = item.toObject()
          let fav = await Favorite.findOne({$and:[{news_id:item._id},{user_id:user_id}]})
          if(fav){
            newItem.isFav = true
          }else{
            newItem.isFav = false
          }
          arr.push(newItem)
        }
        const response = {
          items: arr,
          status: true,
          status_code: 200,
          message: "returned successfully",
          pagenation: {
            size: result.length,
            totalElements: total,
            totalPages: Math.floor(total / limit),
            pageNumber: page
          }
        };
        reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getSingleNews = async (req, reply) => {
  try {
    const rs = await News.findById(req.params.id).sort({ _id: -1 });
    let _comment = await Comments.find({news_id:req.params.id})
    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: rs,
      comments:_comment
    };
    reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.addNews = async (req, reply) => {
  try {
    if (req.raw.files) {
      const files = req.raw.files;
      let fileArr = [];
      for (let key in files) {
        fileArr.push({
          name: files[key].name,
          mimetype: files[key].mimetype
        });
      }
      console.log(files.filename.data);
      var data = new Buffer(files.filename.data);
      fs.writeFile("./uploads/" + files.filename.name, data, "binary", function(
        err
      ) {
        if (err) {
          console.log("There was an error writing the image");
        } else {
          console.log("The sheel file was written");
        }
      });

      let img = "";
      await uploadImages(files.filename.name).then(x => {
        img = x;
      });
      console.log(img);

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
        message: "return succssfully",
        items: rs
      };

      reply.send(response);
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.updateNews = async (req, reply) => {
  try {
    if (req.raw.files) {
      const files = req.raw.files;
      let fileArr = [];
      for (let key in files) {
        fileArr.push({
          name: files[key].name,
          mimetype: files[key].mimetype
        });
      }
      console.log(files.filename);
      var data = new Buffer(files.filename.data);
      fs.writeFile("./uploads/" + files.filename.name, data, "binary", function(
        err
      ) {
        if (err) {
          console.log("There was an error writing the image");
        } else {
          console.log("The sheel file was written");
        }
      });

      let img = "";
      await uploadImages(files.filename.name).then(x => {
        img = x;
      });

      const Advs = await News.findByIdAndUpdate(
        req.params.id,
        {
          title: req.raw.body.title,
          details: req.raw.body.details,
          image: img,
          createAt: getCurrentDateTime(),
          type: req.raw.body.type,
          place: req.raw.body.place
        },
        { new: true }
      );
      // await updateCacheWithUpdate('Advs', Advs, req.params.id)

      const response = {
        status_code: 200,
        status: true,
        message: "return succssfully",
        items: Advs
      };
      reply.send(response)
;
    } else {
      const Advs = await News.findByIdAndUpdate(
        req.params.id,
        {
          title: req.raw.body.title,
          details: req.raw.body.details,
          createAt: getCurrentDateTime(),
          type: req.raw.body.type,
          place: req.raw.body.place
        },
        { new: true }
      );
      // await updateCacheWithUpdate('Advs', Advs, req.params.id)

      const response = {
        status_code: 200,
        status: true,
        message: "return succssfully",
        items: Advs
      };
      reply.send(response)
;
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.deleteNews = async (req, reply) => {
  try {
    console.log(req);
    await News.findByIdAndRemove(req.params.id);
    const response = {
      status_code: 200,
      status: true,
      message: "return succssfully",
      items: []
    };
    reply.send(response)
;
  } catch (err) {
    throw boom.boomify(err);
  }
};

//post going event
exports.updateGoing = async (req, reply) => {
  try {
    const checkrecord = await NewsAttend.findOne({
      $and: [{ user_id: req.body.user_id }, { news_id: req.body.news_id }]
    });
    if (checkrecord) {
      //update
      const _NewssAttend = await NewsAttend.findByIdAndUpdate(
        req.body.news_id,
        {
          isGoing: req.body.isGoing
        },
        { new: true }
      );
      const response = {
        status_code: 200,
        status: true,
        message: "return succssfully",
        items: _NewssAttend
      };
      reply.send(response)
      return
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
        message: "تمت العملية بنجاح",
        items: rs
      };
      reply.send(response)
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getAttend = async (req, reply) => {
  try {
    var page = parseInt(req.query.page, 10);
    var limit = parseInt(req.query.limit, 10);

    const total = await NewsAttend.find({
      news_id: req.params.news_id
    }).count();
    var result = await NewsAttend.find({ news_id: req.params.news_id })
      .populate("news_id")
      .populate("user_id")
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
     
      const response = {
        items: result,
        status: true,
        status_code: 200,
        message: "returned successfully",
        pagenation: {
          size: result.length,
          totalElements: total,
          totalPages: Math.floor(total / limit),
          pageNumber: page
        }
      };
      reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};




exports.addComment = async (req, reply) => {
  try {

       console.log(req.body)
      let _Comment = new Comments({
        user_name: req.body.user_name,
        news_id: req.body.news_id,
        comment: req.body.comment,
        createAt: getCurrentDateTime(),
      });

      let rs = await _Comment.save();
      const response = {
        status_code: 200,
        status: true,
        message: "تمت اضافة التعليق بنجاح",
        items: rs
      };

      reply.send(response);
  
  } catch (err) {
    throw boom.boomify(err);
  }
};
exports.getComment = async (req, reply) => {
  try {
    let _comment = await Comments.find({news_id:req.query.news_id}).populate("user_id")
    var arr = []
    _comment.forEach(element => {
      let item = element.toObject()
      let obj={
        id: item._id,
        user_name: item.user_name ,
        comment: item.comment,
      }
      arr.push(obj)
    });
    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: arr,
    };
    reply.send(response);
  } catch (err) {
    throw boom.boomify(err);
  }
};