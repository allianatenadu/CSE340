// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view (PUBLIC - no auth needed)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory item detail view (PUBLIC - no auth needed)
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// Route to get inventory by classification (for AJAX) (PUBLIC - no auth needed)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// PROTECTED ROUTES - Require Employee or Admin access
// Route to build management view
router.get("/", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
)

// Route to deliver add classification view
router.get("/add-classification", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to process add classification
router.post("/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to deliver add inventory view
router.get("/add-inventory", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
)

// Route to process add inventory
router.post("/add-inventory", 
  utilities.checkLogin,
  utilities.checkAccountType,
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to build edit inventory view
router.get("/edit/:inv_id", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
)

// Route to process inventory update
router.post("/update", 
  utilities.checkLogin,
  utilities.checkAccountType,
  regValidate.inventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router

