const util = require("util");
const async = require("async");

const { Favorite } = require("../models/Favorite");

exports.getFavoriteByUserId = async (req, reply) => {
  try {
    var returnArr = [];
    var page = parseFloat(req.query.page, 10);
    var limit = parseFloat(req.query.limit, 10);
    const total = await Favorite.countDocuments({
      user_id: req.user._id,
    });
    var item = await Favorite.find({ user_id: req.user._id })
      .populate(news)
      .skip(page * limit)
      .limit(limit);
    const response = {
      status_code: 200,
      status: true,
      message: "تمت العملية بنجاح",
      items: item,
      pagenation: {
        size: item.length,
        totalElements: total,
        totalPages: Math.floor(total / limit),
        pageNumber: page,
      },
    };
    reply.code(200).send(response);
  } catch (err) {
    //throw boom.boomify(err);
  }
};

exports.addDeleteFavorite = async (req, reply) => {
  try {
    const checkProvider = await Favorite.findOne({news_id:req.body.news_id});
    if (checkProvider) {
        await Favorite.findByIdAndRemove(checkProvider._id)
        const response = {
            status_code: 200,
            status: true,
            message: "تمت العملية بنجاح",
            items: {},
          };
          reply.code(200).send(response);
    }else{
        let fav = new Favorite({
            user_id: req.user._id,
            news_id: req.body.news_id,
            createAt: new Date()
          });
    
          let rs = await fav.save();
          const response = {
            status_code: 200,
            status: true,
            message: "تمت العملية بنجاح",
            items: rs,
          };
          reply.code(200).send(response);
    }
  } catch (err) {
    //throw boom.boomify(err);
  }
};
