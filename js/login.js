document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const userCredentials = {
                email: 'user@weardose.com',
                password: '123'
            };
            const adminCredentials = {
                email: 'admin@weardose.com',
                password: '123'
            };

            if (email === userCredentials.email && password === userCredentials.password) {
                // SIMPAN STATUS LOGIN SEBELUM PINDAH HALAMAN
                sessionStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'profile.html';
            }
            else if (email === adminCredentials.email && password === adminCredentials.password) {
                // SIMPAN STATUS LOGIN SEBELUM PINDAH HALAMAN
                sessionStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'admin/admin.html';
            }
            else {
                errorMessage.classList.remove('d-none');
            }
        });
    }
});