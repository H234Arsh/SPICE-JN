// careers.js — Handles form validation and Firestore submission

// ── HELPER: show/clear inline error ──────────────────────
function setError(id, message) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = message;
  }
}

function clearError(id) {
  setError(id, '');
}

function markField(inputId, hasError) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (hasError) {
    input.classList.add('input-error');
  } else {
    input.classList.remove('input-error');
  }
}

// ── FORM SUBMIT HANDLER ───────────────────────────────────
document.getElementById('applicationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Clear all previous errors
  ['fullName', 'email', 'phone', 'position', 'experience', 'whyHire'].forEach(id => {
    clearError(id + 'Error');
    markField(id, false);
  });

  document.getElementById('successMsg').style.display = 'none';
  document.getElementById('errorMsg').style.display   = 'none';

  // Collect values
  const fullName   = document.getElementById('fullName').value.trim();
  const email      = document.getElementById('email').value.trim();
  const phone      = document.getElementById('phone').value.trim();
  const position   = document.getElementById('position').value;
  const experience = document.getElementById('experience').value;
  const whyHire    = document.getElementById('whyHire').value.trim();

  // ── CLIENT-SIDE VALIDATION ──────────────────────────────
  let isValid = true;

  if (!fullName) {
    setError('fullNameError', 'Name is required.');
    markField('fullName', true);
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    setError('emailError', 'Please enter a valid email address.');
    markField('email', true);
    isValid = false;
  }

  const phoneRegex = /^\d{10}$/;
  if (!phone || !phoneRegex.test(phone)) {
    setError('phoneError', 'Please enter a valid 10-digit phone number.');
    markField('phone', true);
    isValid = false;
  }

  if (!position) {
    setError('positionError', 'Please select a position.');
    markField('position', true);
    isValid = false;
  }

  const expNum = parseInt(experience, 10);
  if (experience === '' || isNaN(expNum) || expNum < 0) {
    setError('experienceError', 'Please enter valid experience (0 or more years).');
    markField('experience', true);
    isValid = false;
  }

  if (!whyHire || whyHire.length < 20) {
    setError('whyHireError', `Minimum 20 characters required (currently ${whyHire.length}).`);
    markField('whyHire', true);
    isValid = false;
  }

  if (!isValid) return; // stop here if any field failed

  // ── FIRESTORE WRITE ─────────────────────────────────────
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';

  try {
    await db.collection('applications').add({
      fullName,
      email,
      phone,
      position,
      experience: expNum,
      whyHire,
      submittedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Success: clear form and show banner
    document.getElementById('applicationForm').reset();
    document.getElementById('successMsg').style.display = 'block';

  } catch (err) {
    // Show Firebase error on page (no alert)
    const errBanner = document.getElementById('errorMsg');
    errBanner.textContent = 'Submission failed: ' + err.message + '. Please try again.';
    errBanner.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application';
  }
});