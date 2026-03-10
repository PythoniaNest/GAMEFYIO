document.addEventListener('DOMContentLoaded', () => {
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    const authContainer = document.querySelector('.auth-container');

    // Toggle between Login and Register Forms
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add fade out animation
        loginFormContainer.classList.add('animate-fade-out');
        
        setTimeout(() => {
            loginFormContainer.classList.add('hidden');
            loginFormContainer.classList.remove('animate-fade-out');
            
            registerFormContainer.classList.remove('hidden');
            registerFormContainer.classList.add('animate-fade-in');
            
            // Re-trigger animation logic
            authContainer.classList.remove('animate-fade-in');
            void authContainer.offsetWidth; // trigger reflow
            authContainer.classList.add('animate-fade-in');
        }, 300);
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        
        registerFormContainer.classList.add('animate-fade-out');
        
        setTimeout(() => {
            registerFormContainer.classList.add('hidden');
            registerFormContainer.classList.remove('animate-fade-out');
            
            loginFormContainer.classList.remove('hidden');
            loginFormContainer.classList.add('animate-fade-in');
            
            authContainer.classList.remove('animate-fade-in');
            void authContainer.offsetWidth;
            authContainer.classList.add('animate-fade-in');
        }, 300);
    });

    // Password Visibility Toggle
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const input = icon.previousElementSibling;
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                icon.style.color = 'var(--primary-color)';
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                icon.style.color = 'var(--text-dim)';
            }
        });
    });

    // Basic Input Feedback (Visual only)
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.parentElement.style.transform = 'translateX(5px)';
            input.parentElement.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', () => {
            input.parentElement.parentElement.style.transform = 'translateX(0)';
        });
    });

    // Submit Animation (Mockup)
    const forms = [document.getElementById('login-form'), document.getElementById('register-form')];
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const btn = form.querySelector('.submit-btn');
            const span = btn.querySelector('span');
            const originalText = span.textContent;
            
            // Only preventing default for demo if not connecting to PHP yet
            // If you want to connect to PHP, remove the next 2 lines
            // e.preventDefault();
            // console.log("Form submitted to " + form.getAttribute('action'));
            
            span.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';

            // Reset after 2 seconds for demo (PHP will normally redirect)
            setTimeout(() => {
                span.textContent = originalText;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }, 2000);
        });
    });
});
