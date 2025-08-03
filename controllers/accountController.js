const utilities = require("../utilities/")
const accountModel = require("../models/account-models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const pool = require('../database/') // Add this for database updates
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing it
  let hashedPassword
  try {
    // Explicitly hash the password here
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    console.log("Password hashed successfully for registration") // Debug log
  } catch (error) {
    console.error("Error hashing password:", error) // Debug log
    req.flash("notice", "Sorry, there was an error processing the registration.")
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword // Pass the hashed password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request - FIXED FLEXIBLE VERSION
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  
  console.log("=== FLEXIBLE LOGIN ATTEMPT ===")
  console.log("Email:", account_email)
  console.log("Password entered:", account_password)
  
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    console.log("❌ No account found for email:", account_email)
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  
  console.log("✅ Account found for:", account_email)
  console.log("Stored password in DB:", accountData.account_password)
  
  try {
    let passwordMatch = false;
    
    // Check if stored password looks like a bcrypt hash
    if (accountData.account_password.startsWith('$2a$') || accountData.account_password.startsWith('$2b$')) {
      // It's a bcrypt hash, use bcrypt comparison
      console.log("🔐 Detected bcrypt hash, using bcrypt comparison...")
      passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
      console.log("🔐 Bcrypt comparison result:", passwordMatch);
    } else {
      // It's plain text, use direct comparison
      console.log("📝 Detected plain text password, using direct comparison...")
      passwordMatch = account_password === accountData.account_password;
      console.log("📝 Plain text comparison result:", passwordMatch);
      
      // If plain text match is successful, hash the password and update database
      if (passwordMatch) {
        console.log("🔄 Plain text password matched! Updating to hashed password...");
        const hashedPassword = await bcrypt.hashSync(account_password, 10);
        await pool.query(
          'UPDATE account SET account_password = $1 WHERE account_email = $2',
          [hashedPassword, account_email]
        );
        console.log("✅ Password updated to hash in database");
      }
    }
    
    if (passwordMatch) {
      console.log("✅ Login successful - creating JWT token")
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      
      console.log("🔑 JWT Token created successfully")
      
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        console.log("🍪 Cookie set for development")
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        console.log("🍪 Cookie set for production")
      }
      
      console.log("🔄 Redirecting to /account/")
      return res.redirect("/account/")
    } else {
      console.log("❌ Password comparison failed")
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error("💥 Login error:", error)
    req.flash("notice", "There was an error processing your login.")
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}
/* ****************************************
*  Deliver account management view
* *************************************** */
async function accountManagement(req, res, next) {
  try {
    console.log("📄 Loading account management view")
    console.log("User logged in?", res.locals.loggedin)
    console.log("User data:", res.locals.accountData)
    
    let nav = await utilities.getNav();
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null
    });
  } catch (error) {
    console.error('Error loading account management:', error);
    req.flash("error", "Sorry, there was an error loading the account management page.");
    res.redirect("/");
  }
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount,
  accountLogin, 
  accountManagement
  // Remove checkJWTToken and checkLogin - they're in utilities
}