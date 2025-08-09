const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")

// Add review routes
router.get("/add/:inv_id", utilities.checkLogin, reviewController.buildAddReview)
router.post("/add", utilities.checkLogin, reviewController.addReview)
router.get("/my-reviews", utilities.checkLogin, reviewController.buildUserReviews)
router.get("/delete/:review_id", utilities.checkLogin, reviewController.deleteReview)

module.exports = router