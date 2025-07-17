const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  
  // Check if data exists and has at least one item
  if (!data || data.length === 0) {
    // Handle case where no inventory found for this classification
    let nav = await utilities.getNav()
    res.render("./inventory/classification", {
      title: "No vehicles found",
      nav,
      grid: "<p>Sorry, no matching vehicles could be found.</p>",
    })
    return
  }
  
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont