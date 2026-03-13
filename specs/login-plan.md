# Login Test Plan — Swag Labs (saucedemo.com)

**URL:** https://www.saucedemo.com/  
**Explored:** 2026-03-12  
**Scope:** All login-related scenarios for the Swag Labs application

---

## Page Overview

The Login page presents:
- A **Username** text field
- A **Password** text field
- A **Login** button
- A visible hint listing all accepted usernames (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`) and the shared password (`secret_sauce`)

On successful login the user lands on `/inventory.html` (Products page).  
On failure an inline error banner appears: `"Epic sadface: <reason>"`.

---

## Test Scenarios

### TC-LOGIN-01 — Successful Login with Standard User

**Priority:** Critical  
**Starting state:** Browser opened on `https://www.saucedemo.com/` (fresh session, no stored credentials)

**Steps:**
1. Verify the page title is `Swag Labs`
2. Verify the **Username** field is visible and empty
3. Verify the **Password** field is visible and empty
4. Verify the **Login** button is visible and enabled
5. Enter `standard_user` into the **Username** field
6. Enter `secret_sauce` into the **Password** field
7. Click the **Login** button

**Expected result:**
- The user is redirected to `https://www.saucedemo.com/inventory.html`
- The page heading **Products** is visible
- The URL contains `/inventory.html`
- No error banner is shown

---

### TC-LOGIN-02 — Login with Locked-Out User

**Priority:** High  
**Starting state:** Fresh login page, no session

**Steps:**
1. Enter `locked_out_user` into the **Username** field
2. Enter `secret_sauce` into the **Password** field
3. Click the **Login** button

**Expected result:**
- The page stays at `https://www.saucedemo.com/`
- An error banner is displayed with the message: `"Epic sadface: Sorry, this user has been locked out."`
- Error icon (✕) appears on both input fields
- The user is NOT redirected to the inventory page

---

### TC-LOGIN-03 — Login with Wrong Password

**Priority:** High  
**Starting state:** Fresh login page, no session

**Steps:**
1. Enter `standard_user` into the **Username** field
2. Enter `wrong_password` (any value that is not `secret_sauce`) into the **Password** field
3. Click the **Login** button

**Expected result:**
- The page stays at `https://www.saucedemo.com/`
- An error banner is displayed with the message: `"Epic sadface: Username and password do not match any user in this service"`
- Error icon (✕) appears on both input fields

---

### TC-LOGIN-04 — Login with Empty Username

**Priority:** High  
**Starting state:** Fresh login page, no session

**Steps:**
1. Leave the **Username** field empty
2. Enter `secret_sauce` into the **Password** field (or leave it empty)
3. Click the **Login** button

**Expected result:**
- The page stays at `https://www.saucedemo.com/`
- An error banner is displayed with the message: `"Epic sadface: Username is required"`
- Error icon (✕) appears on the Username field

---

### TC-LOGIN-05 — Login with Username Only (Password Empty)

**Priority:** High  
**Starting state:** Fresh login page, no session

**Steps:**
1. Enter `standard_user` into the **Username** field
2. Leave the **Password** field empty
3. Click the **Login** button

**Expected result:**
- The page stays at `https://www.saucedemo.com/`
- An error banner is displayed with the message: `"Epic sadface: Password is required"`
- Error icon (✕) appears on the Password field

---

### TC-LOGIN-06 — Login with Both Fields Empty

**Priority:** Medium  
**Starting state:** Fresh login page, no session

**Steps:**
1. Leave both the **Username** and **Password** fields empty
2. Click the **Login** button

**Expected result:**
- The page stays at `https://www.saucedemo.com/`
- An error banner is displayed with the message: `"Epic sadface: Username is required"` (username is validated first)
- No redirect occurs

---

### TC-LOGIN-07 — Login with Non-Existent Username

**Priority:** Medium  
**Starting state:** Fresh login page, no session

**Steps:**
1. Enter `unknown_user` into the **Username** field
2. Enter `secret_sauce` into the **Password** field
3. Click the **Login** button

**Expected result:**
- The page stays at `https://www.saucedemo.com/`
- An error banner is displayed with the message: `"Epic sadface: Username and password do not match any user in this service"`

---

### TC-LOGIN-08 — Dismiss Error Banner

**Priority:** Medium  
**Starting state:** Error banner is visible after a failed login attempt (e.g. after TC-LOGIN-03)

**Steps:**
1. Perform a failed login to make the error banner appear (e.g. wrong password)
2. Click the **✕** (close) button on the error banner

**Expected result:**
- The error banner disappears
- Both input fields are still present and editable
- The error icon on the input fields also disappears

---

### TC-LOGIN-09 — Login with Performance Glitch User

**Priority:** Medium  
**Starting state:** Fresh login page, no session

**Steps:**
1. Enter `performance_glitch_user` into the **Username** field
2. Enter `secret_sauce` into the **Password** field
3. Click the **Login** button
4. Wait up to 10 seconds for navigation to complete

**Expected result:**
- The user is eventually redirected to `https://www.saucedemo.com/inventory.html`
- Login succeeds but may take noticeably longer than with `standard_user`
- The Products page is displayed correctly

---

### TC-LOGIN-10 — Successful Logout

**Priority:** High  
**Starting state:** User is logged in as `standard_user` on `/inventory.html`

**Steps:**
1. Click the **☰ (Open Menu)** button in the top-left corner
2. Verify the sidebar menu appears with items: **All Items**, **About**, **Logout**, **Reset App State**
3. Click the **Logout** link

**Expected result:**
- The user is redirected back to `https://www.saucedemo.com/`
- The login form (Username, Password, Login button) is visible
- The session is cleared — navigating directly to `/inventory.html` should redirect back to the login page

---

### TC-LOGIN-11 — Access Protected Page Without Login (Session Guard)

**Priority:** High  
**Starting state:** No active session (fresh browser / after logout)

**Steps:**
1. Directly navigate to `https://www.saucedemo.com/inventory.html`

**Expected result:**
- The user is redirected back to `https://www.saucedemo.com/`
- The login form is displayed
- The user cannot access the inventory page without authenticating

---

### TC-LOGIN-12 — Login with Username Containing Leading/Trailing Whitespace

**Priority:** Low  
**Starting state:** Fresh login page, no session

**Steps:**
1. Enter `  standard_user  ` (with spaces before and after) into the **Username** field
2. Enter `secret_sauce` into the **Password** field
3. Click the **Login** button

**Expected result:**
- The login fails with the error: `"Epic sadface: Username and password do not match any user in this service"`  
  *(The application does not auto-trim whitespace — the exact username must match)*

---

### TC-LOGIN-13 — Password Field Masks Input

**Priority:** Low  
**Starting state:** Fresh login page, no session

**Steps:**
1. Click on the **Password** field
2. Type any characters

**Expected result:**
- The typed characters are displayed as dots or asterisks (`•••`)
- The actual characters are not visible to the user

---

### TC-LOGIN-14 — Login with problem_user

**Priority:** Low  
**Starting state:** Fresh login page, no session

**Steps:**
1. Enter `problem_user` into the **Username** field
2. Enter `secret_sauce` into the **Password** field
3. Click the **Login** button

**Expected result:**
- The user is redirected to `https://www.saucedemo.com/inventory.html`
- Login succeeds
- Note: product images and interactions on the inventory page may display known visual/functional anomalies — this is expected for this user type

---

## Summary

| ID | Scenario | Priority |
|---|---|---|
| TC-LOGIN-01 | Successful login — standard user | Critical |
| TC-LOGIN-02 | Locked-out user | High |
| TC-LOGIN-03 | Wrong password | High |
| TC-LOGIN-04 | Empty username | High |
| TC-LOGIN-05 | Empty password | High |
| TC-LOGIN-10 | Successful logout | High |
| TC-LOGIN-11 | Session guard — access without login | High |
| TC-LOGIN-06 | Both fields empty | Medium |
| TC-LOGIN-07 | Non-existent username | Medium |
| TC-LOGIN-08 | Dismiss error banner | Medium |
| TC-LOGIN-09 | Performance glitch user | Medium |
| TC-LOGIN-12 | Whitespace in username | Low |
| TC-LOGIN-13 | Password masking | Low |
| TC-LOGIN-14 | Problem user login | Low |
