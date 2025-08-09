const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 *  Build add review view
 * ************************** */
reviewCont.buildAddReview = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const account_id = res.locals.accountData.account_id
    
    // Check if user already reviewed this vehicle
    const hasReviewed = await reviewModel.checkExistingReview(inv_id, account_id)
    if (hasReviewed) {
      req.flash("notice", "You have already reviewed this vehicle.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }
    
    // Get vehicle data
    const vehicleData = await invModel.getInventoryById(inv_id)
    if (!vehicleData) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/")
    }
    
    let nav = await utilities.getNav()
    res.render("./reviews/add-review", {
      title: `Review ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicle: vehicleData,
      errors: null
    })
  } catch (error) {
    console.error('Error loading add review view:', error)
    req.flash("notice", "Sorry, there was an error loading the review form.")
    res.redirect("/")
  }
}

/* ***************************
 *  Process add review
 * ************************** */
reviewCont.addReview = async function (req, res) {
  try {
    const { inv_id, review_title, review_text, review_rating } = req.body
    const account_id = res.locals.accountData.account_id
    
    // Check if user already reviewed this vehicle
    const hasReviewed = await reviewModel.checkExistingReview(inv_id, account_id)
    if (hasReviewed) {
      req.flash("notice", "You have already reviewed this vehicle.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }
    
    const result = await reviewModel.addReview(
      inv_id,
      account_id,
      review_title,
      review_text,
      parseInt(review_rating)
    )
    
    if (result) {
      req.flash("notice", "Your review was successfully added!")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Sorry, adding the review failed.")
      const vehicleData = await invModel.getInventoryById(inv_id)
      let nav = await utilities.getNav()
      
      res.status(501).render("./reviews/add-review", {
        title: `Review ${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
        nav,
        vehicle: vehicleData,
        review_title,
        review_text,
        review_rating,
        errors: null
      })
    }
  } catch (error) {
    console.error('Error adding review:', error)
    req.flash("notice", "Sorry, there was an error processing your review.")
    res.redirect("/")
  }
}

/* ***************************
 *  Build user reviews view
 * ************************** */
reviewCont.buildUserReviews = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const reviews = await reviewModel.getReviewsByUser(account_id)
    
    let nav = await utilities.getNav()
    res.render("./reviews/user-reviews", {
      title: "My Reviews",
      nav,
      reviews,
      errors: null
    })
  } catch (error) {
    console.error('Error loading user reviews:', error)
    req.flash("notice", "Sorry, there was an error loading your reviews.")
    res.redirect("/account/")
  }
}

/* ***************************
 *  Delete review
 * ************************** */
reviewCont.deleteReview = async function (req, res) {
  try {
    const review_id = parseInt(req.params.review_id)
    const account_id = res.locals.accountData.account_id
    
    const result = await reviewModel.deleteReview(review_id, account_id)
    
    if (result) {
      req.flash("notice", "Review successfully deleted.")
    } else {
      req.flash("notice", "Sorry, the review could not be deleted.")
    }
    
    res.redirect("/reviews/my-reviews")
  } catch (error) {
    console.error('Error deleting review:', error)
    req.flash("notice", "Sorry, there was an error deleting the review.")
    res.redirect("/reviews/my-reviews")
  }
}

module.exports = reviewCont