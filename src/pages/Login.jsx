import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/useAuth';
import { login, register } from '../api/authApi';

export default function Login() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const validateLoginForm = () => {
    const e = {};
    if (!loginForm.email) e.email = 'Email is required';
    else if (!validateEmail(loginForm.email)) e.email = 'Invalid email format';
    if (!loginForm.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegisterForm = () => {
    const e = {};
    if (!registerForm.firstName.trim()) e.firstName = 'First name is required';
    if (!registerForm.lastName.trim()) e.lastName = 'Last name is required';
    if (!registerForm.email) e.email = 'Email is required';
    else if (!validateEmail(registerForm.email)) e.email = 'Invalid email format';
    if (!registerForm.password) e.password = 'Password is required';
    else if (!validatePassword(registerForm.password))
      e.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    if (!registerForm.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (registerForm.password !== registerForm.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    setLoading(true);
    try {
      const res = await login(loginForm);
      authLogin(res.data.data);
      toast.success('✨ Logged in successfully!', {
        position: 'bottom-right',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;
    setLoading(true);
    try {
      const res = await register({
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
      });
      authLogin(res.data.data);
      toast.success('🎉 Account created successfully!', {
        position: 'bottom-right',
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafb' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '16px' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#003f7f', marginBottom: '8px' }}>
            Library Management
          </h1>
          <p style={{ fontSize: '14px', color: '#6c757d' }}>
            Sign in to manage your library
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 63, 127, 0.12)',
          overflow: 'hidden'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '2px solid #e8eaed' }}>
            <button
              onClick={() => {
                setActiveTab('login');
                setErrors({});
              }}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                backgroundColor: activeTab === 'login' ? '#ffffff' : '#f8fafb',
                color: activeTab === 'login' ? '#003f7f' : '#6c757d',
                fontWeight: activeTab === 'login' ? '700' : '600',
                borderBottom: activeTab === 'login' ? '3px solid #003f7f' : 'none',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'all 0.3s',
                marginBottom: '-2px'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrors({});
              }}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                backgroundColor: activeTab === 'register' ? '#ffffff' : '#f8fafb',
                color: activeTab === 'register' ? '#003f7f' : '#6c757d',
                fontWeight: activeTab === 'register' ? '700' : '600',
                borderBottom: activeTab === 'register' ? '3px solid #003f7f' : 'none',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'all 0.3s',
                marginBottom: '-2px'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '32px 24px' }}>
            {/* Login Tab */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: errors.email ? '1px solid #dc3545' : '1px solid #e8eaed',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      color: '#1a1a1a',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                    onFocus={(e) => !errors.email && (e.target.style.borderColor = '#003f7f')}
                    onBlur={(e) => !errors.email && (e.target.style.borderColor = '#e8eaed')}
                  />
                  {errors.email && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '6px' }}>{errors.email}</div>}
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: errors.password ? '1px solid #dc3545' : '1px solid #e8eaed',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      color: '#1a1a1a',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                    onFocus={(e) => !errors.password && (e.target.style.borderColor = '#003f7f')}
                    onBlur={(e) => !errors.password && (e.target.style.borderColor = '#e8eaed')}
                  />
                  {errors.password && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '6px' }}>{errors.password}</div>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '11px',
                    backgroundColor: '#003f7f',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 8px rgba(0, 63, 127, 0.25)'
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0052a3')}
                  onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#003f7f')}
                >
                  {loading ? '🔄 Signing in...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Register Tab */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: errors.firstName ? '1px solid #dc3545' : '1px solid #e8eaed',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        color: '#1a1a1a',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                    {errors.firstName && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '6px' }}>{errors.firstName}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: errors.lastName ? '1px solid #dc3545' : '1px solid #e8eaed',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        color: '#1a1a1a',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                    {errors.lastName && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '6px' }}>{errors.lastName}</div>}
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: errors.email ? '1px solid #dc3545' : '1px solid #e8eaed',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      color: '#1a1a1a',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                  {errors.email && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '6px' }}>{errors.email}</div>}
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: errors.password ? '1px solid #dc3545' : '1px solid #e8eaed',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      color: '#1a1a1a',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                  {errors.password && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '6px' }}>{errors.password}</div>}
                  <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '6px', display: 'block' }}>
                    8+ chars, uppercase, lowercase, number, special character
                  </small>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: errors.confirmPassword ? '1px solid #dc3545' : '1px solid #e8eaed',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      color: '#1a1a1a',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                  {errors.confirmPassword && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '6px' }}>{errors.confirmPassword}</div>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '11px',
                    backgroundColor: '#003f7f',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 8px rgba(0, 63, 127, 0.25)'
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0052a3')}
                  onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#003f7f')}
                >
                  {loading ? '🔄 Creating account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#6c757d' }}>
          © 2026 Library Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}