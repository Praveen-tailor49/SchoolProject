import React, { useState } from 'react'

export default function AuthPage({navigate}) {
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: ''})
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (isSignup) {
      if (!form.name.trim()) e.name = 'Name is required.'
      if (!form.email.trim()) e.email = 'Email is required.'
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.'
      if (form.password.length < 6) e.password = 'Password must be at least 6 characters.'
      if (form.password !== form.confirm) e.confirm = "Passwords don't match."
    } else {
      if (!form.email.trim()) e.email = 'Email is required.'
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.'
      if (!form.password) e.password = 'Password is required.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function update(field) {
    return (e) => setForm((s) => ({ ...s, [field]: e.target.value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left illustration / marketing */}
        <div className="hidden lg:flex flex-col items-start justify-center space-y-6 px-6">
          <div className="bg-white/40 backdrop-blur rounded-2xl p-6 shadow-md border border-white/30">
            <h2 className="text-3xl font-semibold">Welcome{isSignup ? ' — Create account' : ' back'}!</h2>
            <p className="mt-2 text-slate-600">Fast, secure, and easy to integrate. Use your email or social sign-in.</p>
          </div>

          <div className="mt-6">
            <div className="w-64 h-40 rounded-2xl bg-gradient-to-tr from-indigo-200 to-pink-200 shadow-inner flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15 8H9L12 2Z" fill="#7c3aed" />
                <path d="M12 22L9 16H15L12 22Z" fill="#ec4899" />
                <circle cx="12" cy="12" r="3" fill="#60a5fa" />
              </svg>
            </div>
            <p className="mt-4 text-sm text-slate-600">Example promo area — put your feature bullets here: secure auth, social login, validations, responsive layout.</p>
          </div>
        </div>

        {/* Right: Card with forms */}
        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{isSignup ? 'Create an account' : 'Sign in to your account'}</h1>
                <p className="text-sm text-slate-500 mt-1">{isSignup ? 'Start your free journey.' : 'Welcome back — enter your details.'}</p>
              </div>
              <div>
                <button
                  onClick={() => setIsSignup((s) => !s)}
                  className="text-sm px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
                >
                  {isSignup ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </div>

            <form className="mt-6 space-y-4">
              {errors.form && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{errors.form}</div>
              )}

              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    value={form.name}
                    onChange={update('name')}
                    className={`mt-1 block w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
                    placeholder="Your full name"
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  value={form.email}
                  onChange={update('email')}
                  className={`mt-1 block w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
                  placeholder="you@example.com"
                  type="email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-1 relative">
                  <input
                    value={form.password}
                    onChange={update('password')}
                    className={`block w-full rounded-md border p-2 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.password ? 'border-red-300' : 'border-slate-200'}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Choose a strong password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">Confirm password</label>
                  <input
                    value={form.confirm}
                    onChange={update('confirm')}
                    className={`mt-1 block w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.confirm ? 'border-red-300' : 'border-slate-200'}`}
                    type="password"
                    placeholder="Repeat your password"
                    aria-invalid={errors.confirm ? 'true' : 'false'}
                  />
                  {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-slate-600">Remember me</span>
                </label>

                {!isSignup && (
                  <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 transition"
                >
                  {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
                </button>
              </div>

              <div className="mt-2 text-center text-sm text-slate-500">or continue with</div>

              <p className="mt-4 text-xs text-slate-500 text-center">By continuing, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.</p>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsSignup((s) => !s)} className="text-indigo-600 hover:underline">{isSignup ? 'Sign in' : 'Create one'}</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
