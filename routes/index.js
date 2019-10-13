// Import our Controllers
const userController = require('../controllers/userController')
const notificationController = require('../controllers/notificationController')
const constantController = require('../controllers/constantController')
const adminController = require('../controllers/adminController')
const superAdminController = require('../controllers/superAdminController')
const newsController = require('../controllers/newsController')
const paymentController = require('../controllers/paymentController')
const auth = require('../controllers/auth')

const fastify = require('fastify')({
  logger: true
})

// Import Swagger documentation
// const documentation = require('./documentation/carApi')

const routes = [
  //admin

  {
    method: 'GET',
    url: '/api/getAttend/:news_id',
    handler: newsController.getAttend
  },
  {
    method: 'POST',
    url: '/api/loginsuperAdmin',
    handler: superAdminController.login
  },
  {
    method: 'POST',
    url: '/api/refreshtokenAdmin',
    handler: superAdminController.refreshToken
  },
  {
    method: 'GET',
    url: '/api/superadmin',
    handler: superAdminController.getAdmins
  },
  {
    method: 'GET',
    url: '/api/superadmin/:id',
    handler: superAdminController.getSingleAdmin
  },
  {
    method: 'POST',
    url: '/api/superadmin',
    handler: superAdminController.addAdmin
  },
  {
    method: 'PUT',
    url: '/api/superadmin/:id',
    handler: superAdminController.updateAdmin
  },
  {
    method: 'POST',
    url: '/api/superadmin/:id',
    handler: superAdminController.deleteAdmin
  },


  {
    method: 'GET',
    url: '/api/BankFile',
    handler: constantController.getFiles
  },
  {
    method: 'GET',
    url: '/api/BankFile/:id',
    handler: constantController.getSingleFiles
  },
  {
    method: 'POST',
    url: '/api/BankFile',
    handler: constantController.addFile
  },
  {
    method: 'POST',
    url: '/api/BankFile/:id',
    handler: constantController.updateFile
  },

  {
    method: 'GET',
    url: '/api/paymentmethod',
    handler: constantController.getpaymentMethods
  },
  {
    method: 'POST',
    url: '/api/paymentmethod',
    handler: constantController.addpaymentMethod
  },
  {
    method: 'PUT',
    url: '/api/paymentmethod/:id',
    handler: constantController.updatepaymentMethod
  },
  {
    method: 'POST',
    url: '/api/paymentmethod/:id',
    handler: constantController.deletepaymentMethods
  },

  {
    method: 'GET',
    url: '/api/category',
    handler: constantController.getcategories
  },
  {
    method: 'POST',
    url: '/api/category',
    handler: constantController.addcategories
  },
  {
    method: 'PUT',
    url: '/api/category/:id',
    handler: constantController.updatecategories
  },
  {
    method: 'POST',
    url: '/api/category/:id',
    handler: constantController.deletecategories
  },


  {
    method: 'GET',
    url: '/api/paymentfor',
    handler: constantController.getpaymentfor
  },
  {
    method: 'POST',
    url: '/api/paymentfor',
    handler: constantController.addpaymentfor
  },
  {
    method: 'PUT',
    url: '/api/paymentfor/:id',
    handler: constantController.updatepaymentFors
  },
  {
    method: 'POST',
    url: '/api/paymentfor/:id',
    handler: constantController.deletepaymentFors
  },


  {
    method: 'GET',
    url: '/api/loans',
    handler: constantController.getloans
  },
  {
    method: 'POST',
    url: '/api/loans',
    handler: constantController.addloans
  },
  {
    method: 'PUT',
    url: '/api/loans/:id',
    handler: constantController.updateloans
  },
  {
    method: 'POST',
    url: '/api/loans/:id',
    handler: constantController.deleteloans
  },

  {
    method: 'GET',
    url: '/api/jobs',
    handler: constantController.getJobs
  },
  {
    method: 'POST',
    url: '/api/jobs',
    handler: constantController.addJobs
  },
  {
    method: 'PUT',
    url: '/api/jobs/:id',
    handler: constantController.updateJobs
  },
  {
    method: 'POST',
    url: '/api/jobs/:id',
    handler: constantController.deleteJobs
  },


  {
    method: 'GET',
    url: '/api/constant',
    handler: constantController.getAllConstants
  },
  {
    method: 'GET',
    url: '/api/staticpage',
    handler: constantController.getStaticPage
  },
  {
    method: 'GET',
    url: '/api/staticpage/:id',
    handler: constantController.getSingleStatic
  },
  {
    method: 'POST',
    url: '/api/staticpage',
    handler: constantController.addStatic
  },
  {
    method: 'PUT',
    url: '/api/staticpage/:id',
    handler: constantController.updateStatic
  },
  {
    method: 'POST',
    url: '/api/staticpage/:id',
    handler: constantController.deleteStatic
  },


  {
    method: 'GET',
    url: '/api/contact',
    handler: constantController.getContact
  },
  {
    method: 'POST',
    url: '/api/contactSearch',
    handler: constantController.contactSearch
  },
  {
    method: 'POST',
    url: '/api/contact',
    handler: constantController.addContact
  },
  {
    method: 'POST',
    url: '/api/contact/:id',
    handler: constantController.deleteContact
  },


  {
    method: 'GET',
    url: '/api/news/:type',
    handler: newsController.getNews
  },
  {
    method: 'GET',
    url: '/api/singlenews/:id',
    handler: newsController.getSingleNews
  },
  {
    method: 'PUT',
    url: '/api/news/:id',
    handler: newsController.updateNews
  },
  {
    method: 'POST',
    url: '/api/news',
    handler: newsController.addNews
  },
  {
    method: 'POST',
    url: '/api/news/:id',
    handler: newsController.deleteNews
  },
  {
    method: 'POST',
    url: '/api/attendnews',
    handler: newsController.updateGoing
  },



  {
    method: 'GET',
    url: '/api/users',
    handler: userController.getUsers
  },
  {
    method: 'POST',
    url: '/api/usersSearch',
    handler: userController.getUsersSearch
  },
  {
    method: 'GET',
    url: '/api/users/:id',
    handler: userController.getSingleUser
  },
  {
    method: 'POST',
    url: '/api/user',
    handler: userController.addUser
  },
  {
    method: 'POST',
    url: '/api/user_block/:id',
    handler: userController.BlockeUser
  },
  {
    method: 'POST',
    url: '/api/user_activate/:id',
    beforeHandler: [auth.getToken],
    handler: userController.activateUser
  },
  {
    method: 'POST',
    url: '/api/user/:id',
    beforeHandler: [auth.getToken],
    handler: userController.updateUser
  },
  {
    method: 'POST',
    url: '/api/user_login',
    handler: userController.loginUser
  },
  {
    method: 'POST',
    url: '/api/user_forget',
    handler: userController.forgetPassword
  },
  {
    method: 'POST',
    url: '/api/user_reset_password/:id',
    beforeHandler: [auth.getToken],
    handler: userController.resetPasswordUsers
  },
  {
    method: 'POST',
    url: '/api/user_reset_email/:id',
    beforeHandler: [auth.getToken],
    handler: userController.resetEmailUsers
  },



  {
    method: 'GET',
    url: '/api/admin',
    handler: adminController.getAdmins
  },
  {
    method: 'POST',
    url: '/api/adminsSearch',
    handler: adminController.getUsersSearch
  },
  {
    method: 'GET',
    url: '/api/admin/:id',
    handler: adminController.getSingleAdmins
  },
  {
    method: 'POST',
    url: '/api/admin',
    handler: adminController.addAdmins
  },
  {
    method: 'POST',
    url: '/api/admin_block/:id',
    handler: adminController.BlockeAdmins
  },
  {
    method: 'POST',
    url: '/api/admin_activate/:id',
    beforeHandler: [auth.getToken],
    handler: adminController.activateAdmins
  },
  {
    method: 'POST',
    url: '/api/admin/:id',
    beforeHandler: [auth.getToken],
    handler: adminController.updateAdmins
  },
  {
    method: 'POST',
    url: '/api/admin_forget',
    handler: adminController.forgetPasswordAdmins
  },
  {
    method: 'POST',
    url: '/api/admin_reset_password/:id',
    beforeHandler: [auth.getToken],
    handler: adminController.resetPasswordAdmins
  },
  {
    method: 'POST',
    url: '/api/admin_reset_email/:id',
    beforeHandler: [auth.getToken],
    handler: adminController.resetEmailAdmins
  },


  {
    method: 'GET',
    url: '/api/getNotfications/:id',
    beforeHandler: [auth.getToken],
    handler: notificationController.getNotfications
  },
  {
    method: 'POST',
    url: '/api/readNotifications/:id',
    beforeHandler: [auth.getToken],
    handler: notificationController.readNotifications
  },
  {
    method: 'POST',
    url: '/api/updateNotifications/:id',
    beforeHandler: [auth.getToken],
    handler: notificationController.updateNotifications
  },


  {
    method: 'GET',
    url: '/api/BankDetails/:id',
    handler: paymentController.getBankDetails
  },
  {
    method: 'POST',
    url: '/api/BankDetails',
    handler: paymentController.addBankDetails
  },
  {
    method: 'POST',
    url: '/api/Payment',
    handler: paymentController.addPayment
  },
  {
    method: 'POST',
    url: '/api/PaymentToUser',
    handler: paymentController.addPaymentToUser
  },
  {
    method: 'POST',
    url: '/api/deActivate',
    handler: paymentController.deActivate
  },
  {
    method: 'GET',
    url: '/api/Payment/:id',
    handler: paymentController.getSinglePayment
  },
  {
    method: 'GET',
    url: '/api/PaymentBySuperAdmin',
    handler: paymentController.getPaymentAllForAdmin
  },
  {
    method: 'GET',
    url: '/api/PaymentByAdmin/:id',
    handler: paymentController.getPaymentAdmin
  },
  {
    method: 'POST',
    url: '/api/getlast20PaymentForUser',
    handler: paymentController.getlast20PaymentForUser
  },



  {
    method: 'POST',
    url: '/api/Request',
    beforeHandler: [auth.getToken],
    handler: paymentController.addRequest
  },
  {
    method: 'POST',
    url: '/api/updateRequest',
    handler: paymentController.updateRequest
  },
  {
    method: 'POST',
    url: '/api/updateRequestByAdmin',
    handler: paymentController.updateRequestByAdmin
  },
  {
    method: 'GET',
    url: '/api/Request/:id',
    handler: paymentController.getSingleRequest
  },
  {
    method: 'GET',
    url: '/api/LastRequest/:id',
    handler: paymentController.getLastRequest
  },

  {
    method: 'GET',
    url: '/api/RequestBySuperAdmin',
    handler: paymentController.getRequestAllForAdmin
  },
  {
    method: 'GET',
    url: '/api/RequestByUser/:id',
    handler: paymentController.getRequestUser
  },
  {
    method: 'GET',
    url: '/api/getActiveRequestUser/:id',
    handler: paymentController.getActiveRequestUser
  },
  {
    method: 'POST',
    url: '/api/requestSearch',
    handler: paymentController.getRequsetSearch
  },


  {
    method: 'POST',
    url: '/api/rpt_history',
    handler: paymentController.rpt_history
  },
  {
    method: 'POST',
    url: '/api/rpt_funder',
    handler: paymentController.rpt_funder
  },
  {
    method: 'POST',
    url: '/api/rpt_beneficiary',
    handler: paymentController.rpt_beneficiary
  },
  {
    method: 'POST',
    url: '/api/rpt_request',
    handler: paymentController.rpt_request
  },


  {
    method: 'GET',
    url: '/api/getMethodFor',
    handler: paymentController.getMotstMethodFor
  },
  {
    method: 'GET',
    url: '/api/getMotstMethodType',
    handler: paymentController.getMotstMethodType
  },
  {
    method: 'GET',
    url: '/api/getUsersPerYear',
    handler: paymentController.getUsersPerYear
  },
  {
    method: 'GET',
    url: '/api/getAdminsPerYear',
    handler: paymentController.getAdminsPerYear
  },
  {
    method: 'GET',
    url: '/api/PaymentPerYear',
    handler: paymentController.PaymentPerYear
  },
  {
    method: 'GET',
    url: '/api/PaymentPerYear2',
    handler: paymentController.PaymentPerYear2
  },

]

module.exports = routes
