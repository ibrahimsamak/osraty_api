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
// beforeHandler: [auth.getToken],

const routes = [
  //admin
  {
    method: 'GET',
    url: '/api/getAttend/:news_id',
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
    handler: superAdminController.getAdmins
  },
  {
    method: 'GET',
    url: '/api/superadmin/:id',
    beforeHandler: [auth.getToken],
    handler: superAdminController.getSingleAdmin
  },
  {
    method: 'POST',
    url: '/api/superadmin',
    beforeHandler: [auth.getToken],
    handler: superAdminController.addAdmin
  },
  {
    method: 'PUT',
    url: '/api/superadmin/:id',
    beforeHandler: [auth.getToken],
    handler: superAdminController.updateAdmin
  },
  {
    method: 'POST',
    url: '/api/superadmin/:id',
    beforeHandler: [auth.getToken],
    handler: superAdminController.deleteAdmin
  },


  {
    method: 'GET',
    url: '/api/BankFile',
    beforeHandler: [auth.getToken],
    handler: constantController.getFiles
  },
  {
    method: 'GET',
    url: '/api/BankFile/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.getSingleFiles
  },
  {
    method: 'POST',
    url: '/api/BankFile',
    beforeHandler: [auth.getToken],
    handler: constantController.addFile
  },
  {
    method: 'POST',
    url: '/api/BankFile/:id',
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
    handler: constantController.addpaymentMethod
  },
  {
    method: 'PUT',
    url: '/api/paymentmethod/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.updatepaymentMethod
  },
  {
    method: 'POST',
    url: '/api/paymentmethod/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.deletepaymentMethods
  },

  {
    method: 'GET',
    url: '/api/category',
    beforeHandler: [auth.getToken],
    handler: constantController.getcategories
  },
  {
    method: 'POST',
    url: '/api/category',
    beforeHandler: [auth.getToken],
    handler: constantController.addcategories
  },
  {
    method: 'PUT',
    url: '/api/category/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.updatecategories
  },
  {
    method: 'POST',
    url: '/api/category/:id',
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
    handler: constantController.addpaymentfor
  },
  {
    method: 'PUT',
    url: '/api/paymentfor/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.updatepaymentFors
  },
  {
    method: 'POST',
    url: '/api/paymentfor/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.deletepaymentFors
  },


  {
    method: 'GET',
    url: '/api/loans',
    beforeHandler: [auth.getToken],
    handler: constantController.getloans
  },
  {
    method: 'POST',
    url: '/api/loans',
    beforeHandler: [auth.getToken],
    handler: constantController.addloans
  },
  {
    method: 'PUT',
    url: '/api/loans/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.updateloans
  },
  {
    method: 'POST',
    url: '/api/loans/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.deleteloans
  },

  {
    method: 'GET',
    url: '/api/jobs',
    beforeHandler: [auth.getToken],
    handler: constantController.getJobs
  },
  {
    method: 'POST',
    url: '/api/jobs',
    beforeHandler: [auth.getToken],
    handler: constantController.addJobs
  },
  {
    method: 'PUT',
    url: '/api/jobs/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.updateJobs
  },
  {
    method: 'POST',
    url: '/api/jobs/:id',
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
    handler: constantController.addStatic
  },
  {
    method: 'PUT',
    url: '/api/staticpage/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.updateStatic
  },
  {
    method: 'POST',
    url: '/api/staticpage/:id',
    beforeHandler: [auth.getToken],
    handler: constantController.deleteStatic
  },


  {
    method: 'GET',
    url: '/api/contact',
    beforeHandler: [auth.getToken],
    handler: constantController.getContact
  },
  {
    method: 'POST',
    url: '/api/contactSearch',
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
    handler: newsController.updateNews
  },
  {
    method: 'POST',
    url: '/api/news',
    beforeHandler: [auth.getToken],
    handler: newsController.addNews
  },
  {
    method: 'POST',
    url: '/api/news/:id',
    beforeHandler: [auth.getToken],
    handler: newsController.deleteNews
  },
  {
    method: 'POST',
    url: '/api/attendnews',
    beforeHandler: [auth.getToken],
    handler: newsController.updateGoing
  },



  {
    method: 'GET',
    url: '/api/users',
    beforeHandler: [auth.getToken],
    handler: userController.getUsers
  },
  {
    method: 'POST',
    url: '/api/usersSearch',
    beforeHandler: [auth.getToken],
    handler: userController.getUsersSearch
  },
  {
    method: 'GET',
    url: '/api/users/:id',
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
    handler: adminController.getAdmins
  },
  {
    method: 'POST',
    url: '/api/adminsSearch',
    beforeHandler: [auth.getToken],
    handler: adminController.getUsersSearch
  },
  {
    method: 'GET',
    url: '/api/admin/:id',
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
    handler: paymentController.getBankDetails
  },
  {
    method: 'POST',
    url: '/api/BankDetails',
    beforeHandler: [auth.getToken],
    handler: paymentController.addBankDetails
  },
  {
    method: 'POST',
    url: '/api/Payment',
    beforeHandler: [auth.getToken],
    handler: paymentController.addPayment
  },
  {
    method: 'POST',
    url: '/api/verfiyPayment',
    beforeHandler: [auth.getToken],
    handler: paymentController.verfiyPayment
  },
  {
    method: 'POST',
    url: '/api/PaymentToUser',
    beforeHandler: [auth.getToken],
    handler: paymentController.addPaymentToUser
  },
  {
    method: 'POST',
    url: '/api/deActivate',
    beforeHandler: [auth.getToken],
    handler: paymentController.deActivate
  },
  {
    method: 'GET',
    url: '/api/Payment/:id',
    beforeHandler: [auth.getToken],
    handler: paymentController.getSinglePayment
  },
  {
    method: 'GET',
    url: '/api/PaymentBySuperAdmin',
    beforeHandler: [auth.getToken],
    handler: paymentController.getPaymentAllForAdmin
  },
  {
    method: 'GET',
    url: '/api/PaymentByAdmin/:id',
    beforeHandler: [auth.getToken],
    handler: paymentController.getPaymentAdmin
  },
  {
    method: 'POST',
    url: '/api/getlast20PaymentForUser',
    beforeHandler: [auth.getToken],
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
    beforeHandler: [auth.getToken],
    handler: paymentController.updateRequest
  },
  {
    method: 'POST',
    url: '/api/updateRequestByAdmin',
    beforeHandler: [auth.getToken],
    handler: paymentController.updateRequestByAdmin
  },
  {
    method: 'GET',
    url: '/api/Request/:id',
    beforeHandler: [auth.getToken],
    handler: paymentController.getSingleRequest
  },
  {
    method: 'GET',
    url: '/api/LastRequest/:id',
    beforeHandler: [auth.getToken],
    handler: paymentController.getLastRequest
  },

  {
    method: 'GET',
    url: '/api/RequestBySuperAdmin',
    beforeHandler: [auth.getToken],
    handler: paymentController.getRequestAllForAdmin
  },
  {
    method: 'GET',
    url: '/api/RequestByUser/:id',
    beforeHandler: [auth.getToken],
    handler: paymentController.getRequestUser
  },
  {
    method: 'GET',
    url: '/api/getActiveRequestUser/:id',
    beforeHandler: [auth.getToken],
    handler: paymentController.getActiveRequestUser
  },
  {
    method: 'POST',
    url: '/api/requestSearch',
    beforeHandler: [auth.getToken],
    handler: paymentController.getRequsetSearch
  },


  {
    method: 'POST',
    url: '/api/rpt_history',
    beforeHandler: [auth.getToken],
    handler: paymentController.rpt_history
  },
  {
    method: 'POST',
    url: '/api/rpt_funder',
    beforeHandler: [auth.getToken],
    handler: paymentController.rpt_funder
  },
  {
    method: 'POST',
    url: '/api/rpt_beneficiary',
    beforeHandler: [auth.getToken],
    handler: paymentController.rpt_beneficiary
  },
  {
    method: 'POST',
    url: '/api/rpt_request',
    beforeHandler: [auth.getToken],
    handler: paymentController.rpt_request
  },


  {
    method: 'GET',
    url: '/api/getMethodFor',
    beforeHandler: [auth.getToken],
    handler: paymentController.getMotstMethodFor
  },
  {
    method: 'GET',
    url: '/api/getMotstMethodType',
    beforeHandler: [auth.getToken],
    handler: paymentController.getMotstMethodType
  },
  {
    method: 'GET',
    url: '/api/getUsersPerYear',
    beforeHandler: [auth.getToken],
    handler: paymentController.getUsersPerYear
  },
  {
    method: 'GET',
    url: '/api/getAdminsPerYear',
    beforeHandler: [auth.getToken],
    handler: paymentController.getAdminsPerYear
  },
  {
    method: 'GET',
    url: '/api/PaymentPerYear',
    beforeHandler: [auth.getToken],
    handler: paymentController.PaymentPerYear
  },
  {
    method: 'GET',
    url: '/api/PaymentPerYear2',
    beforeHandler: [auth.getToken],
    handler: paymentController.PaymentPerYear2
  },

]

module.exports = routes
