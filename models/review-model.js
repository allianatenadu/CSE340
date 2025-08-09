const pool = require("../database/")

/* ***************************
 *  Get all reviews for a specific vehicle
 * ************************** */
async function getReviewsByVehicleId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, a.account_firstname, a.account_lastname 
       FROM public.reviews r
       JOIN public.account a ON r.account_id = a.account_id
       WHERE r.inv_id = $1 
       ORDER BY r.review_date DESC`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewsByVehicleId error: " + error)
    return []
  }
}

/* ***************************
 *  Get average rating for a vehicle
 * ************************** */
async function getAverageRating(inv_id) {
  try {
    const data = await pool.query(
      `SELECT AVG(review_rating)::NUMERIC(3,2) as avg_rating, COUNT(*) as review_count
       FROM public.reviews 
       WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getAverageRating error: " + error)
    return { avg_rating: null, review_count: 0 }
  }
}

/* ***************************
 *  Add a new review
 * ************************** */
async function addReview(inv_id, account_id, review_title, review_text, review_rating) {
  try {
    const sql = `INSERT INTO public.reviews 
      (inv_id, account_id, review_title, review_text, review_rating) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`
    
    const result = await pool.query(sql, [
      inv_id,
      account_id,
      review_title,
      review_text,
      review_rating
    ])
    
    return result.rowCount > 0 ? result.rows[0] : false
  } catch (error) {
    console.error("addReview error: " + error)
    return false
  }
}

/* ***************************
 *  Check if user already reviewed this vehicle
 * ************************** */
async function checkExistingReview(inv_id, account_id) {
  try {
    const result = await pool.query(
      "SELECT review_id FROM public.reviews WHERE inv_id = $1 AND account_id = $2",
      [inv_id, account_id]
    )
    return result.rowCount > 0
  } catch (error) {
    console.error("checkExistingReview error: " + error)
    return false
  }
}

/* ***************************
 *  Get reviews by user
 * ************************** */
async function getReviewsByUser(account_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, i.inv_year, i.inv_make, i.inv_model 
       FROM public.reviews r
       JOIN public.inventory i ON r.inv_id = i.inv_id
       WHERE r.account_id = $1 
       ORDER BY r.review_date DESC`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewsByUser error: " + error)
    return []
  }
}

/* ***************************
 *  Delete a review
 * ************************** */
async function deleteReview(review_id, account_id) {
  try {
    const sql = "DELETE FROM public.reviews WHERE review_id = $1 AND account_id = $2 RETURNING *"
    const result = await pool.query(sql, [review_id, account_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("deleteReview error: " + error)
    return false
  }
}

module.exports = {
  getReviewsByVehicleId,
  getAverageRating,
  addReview,
  checkExistingReview,
  getReviewsByUser,
  deleteReview
}