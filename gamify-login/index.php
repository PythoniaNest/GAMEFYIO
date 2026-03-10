<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Secure and modern login page for Gamify. Connect your PHP backend easily.">
    <title>Gamify - Login & Registration</title>
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Main Style -->
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Background Animated Orbs -->
    <div class="bg-blobs">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
    </div>

    <div class="auth-container animate-fade-in">
        <div class="glass-box">
            
            <!-- Login Form Section -->
            <div id="login-form-container">
                <header class="auth-header">
                    <h1 class="logo">GAMIFY</h1>
                    <p>Welcome back! Please login to continue.</p>
                </header>

                <form id="login-form" action="login.php" method="POST">
                    <div class="form-group">
                        <div class="label-group">
                            <label for="login-email">Email Address</label>
                        </div>
                        <div class="input-container">
                            <input type="email" id="login-email" name="email" placeholder="example@gmail.com" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="label-group">
                            <label for="login-password">Password</label>
                            <a href="#" class="forgot-link">Forgot Password?</a>
                        </div>
                        <div class="input-container">
                            <input type="password" id="login-password" name="password" placeholder="••••••••" required>
                            <i class="fa-solid fa-eye-slash toggle-password"></i>
                        </div>
                    </div>

                    <button type="submit" name="login" class="submit-btn">
                        <span>Sign In</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    
                    <div class="divider">or continue with</div>
                    
                    <div class="social-btns">
                        <button type="button" class="social-btn">
                            <i class="fa-brands fa-google"></i>
                            Google
                        </button>
                        <button type="button" class="social-btn">
                            <i class="fa-brands fa-github"></i>
                            Github
                        </button>
                    </div>
                </header>

                <div class="auth-footer">
                    <span>Don't have an account?</span>
                    <a href="javascript:void(0)" class="toggle-form" id="show-register">Join now</a>
                </div>
            </div>

            <!-- Register Form Section (Hidden by Default) -->
            <div id="register-form-container" class="hidden">
                <header class="auth-header">
                    <h1 class="logo">GAMIFY</h1>
                    <p>Create your account and start playing!</p>
                </header>

                <form id="register-form" action="register.php" method="POST">
                    <div class="form-group">
                        <div class="label-group">
                            <label for="reg-name">Full Name</label>
                        </div>
                        <div class="input-container">
                            <input type="text" id="reg-name" name="fullname" placeholder="John Doe" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="label-group">
                            <label for="reg-email">Email Address</label>
                        </div>
                        <div class="input-container">
                            <input type="email" id="reg-email" name="email" placeholder="example@gmail.com" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="label-group">
                            <label for="reg-password">Password</label>
                        </div>
                        <div class="input-container">
                            <input type="password" id="reg-password" name="password" placeholder="••••••••" required minlength="8">
                            <i class="fa-solid fa-eye-slash toggle-password"></i>
                        </div>
                    </div>

                    <button type="submit" name="register" class="submit-btn">
                        <span>Get Started</span>
                        <i class="fa-solid fa-user-plus"></i>
                    </button>
                </form>

                <div class="auth-footer">
                    <span>Already a member?</span>
                    <a href="javascript:void(0)" class="toggle-form" id="show-login">Login here</a>
                </div>
            </div>

        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
