// admin.js — Firebase Auth login + Firestore applications dashboard

// ── DOM REFERENCES ─────────────────────────────────────────
const loginSection     = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginError       = document.getElementById('loginError');
const loginBtn         = document.getElementById('loginBtn');
const logoutBtn        = document.getElementById('logoutBtn');
const welcomeMsg       = document.getElementById('welcomeMsg');
const loadingMsg       = document.getElementById('loadingMsg');
const emptyMsg         = document.getElementById('emptyMsg');
const fetchErrMsg      = document.getElementById('fetchErrMsg');
const tableWrapper     = document.getElementById('tableWrapper');
const tableBody        = document.getElementById('tableBody');

// ── SHOW / HIDE SECTIONS ──────────────────────────────────
function showDashboard(user) {
  loginSection.style.display     = 'none';
  dashboardSection.style.display = 'block';
  welcomeMsg.textContent         = 'Logged in as: ' + user.email;
  fetchApplications();
}

function showLogin() {
  dashboardSection.style.display = 'none';
  loginSection.style.display     = 'flex';
  document.getElementById('adminEmail').value    = '';
  document.getElementById('adminPassword').value = '';
  loginError.style.display = 'none';
}

// ── AUTH STATE OBSERVER ───────────────────────────────────
auth.onAuthStateChanged(function(user) {
  if (user) {
    showDashboard(user);
  } else {
    showLogin();
  }
});

// ── LOGIN HANDLER ─────────────────────────────────────────
loginBtn.addEventListener('click', async function() {
  var email    = document.getElementById('adminEmail').value.trim();
  var password = document.getElementById('adminPassword').value;

  loginError.style.display = 'none';

  if (!email || !password) {
    loginError.textContent   = 'Please enter both email and password.';
    loginError.style.display = 'block';
    return;
  }

  loginBtn.disabled    = true;
  loginBtn.textContent = 'Logging in...';

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    loginError.textContent   = 'Invalid email or password. Please try again.';
    loginError.style.display = 'block';
  } finally {
    loginBtn.disabled    = false;
    loginBtn.textContent = 'Login';
  }
});

// ── LOGOUT HANDLER ────────────────────────────────────────
logoutBtn.addEventListener('click', async function() {
  await auth.signOut();
});

// ── FETCH APPLICATIONS ────────────────────────────────────
async function fetchApplications() {
  loadingMsg.style.display   = 'block';
  emptyMsg.style.display     = 'none';
  fetchErrMsg.style.display  = 'none';
  tableWrapper.style.display = 'none';
  tableBody.innerHTML        = '';

  try {
    var snapshot = await db.collection('applications')
      .orderBy('submittedAt', 'desc')
      .get();

    loadingMsg.style.display = 'none';

    if (snapshot.empty) {
      emptyMsg.style.display = 'block';
      return;
    }

    // Use a plain counter for serial number
    var counter = 1;

    snapshot.forEach(function(doc) {
      var d   = doc.data();
      var row = document.createElement('tr');

      // Format timestamp
      var submittedAt = '—';
      if (d.submittedAt && d.submittedAt.toDate) {
        var date = d.submittedAt.toDate();
        submittedAt = date.toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      }

      row.innerHTML =
        '<td>' + counter + '</td>' +
        '<td>' + (d.fullName   || '—') + '</td>' +
        '<td>' + (d.email      || '—') + '</td>' +
        '<td>' + (d.phone      || '—') + '</td>' +
        '<td>' + (d.position   || '—') + '</td>' +
        '<td>' + (d.experience !== undefined ? d.experience : '—') + '</td>' +
        '<td class="reason-cell">' + (d.whyHire || '—') + '</td>' +
        '<td style="white-space:nowrap">' + submittedAt + '</td>';

      tableBody.appendChild(row);
      counter = counter + 1;
    });

    tableWrapper.style.display = 'block';

  } catch (err) {
    loadingMsg.style.display  = 'none';
    fetchErrMsg.textContent   = 'Error loading applications: ' + err.message;
    fetchErrMsg.style.display = 'block';
  }
}
