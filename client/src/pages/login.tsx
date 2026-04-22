import { useState, useEffect, type JSX } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import abstractIcon from '@/assets/shapes/abstracticons.svg'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const NU_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@students\.nu-laguna\.edu\.ph$/

function validate(email: string, password: string) {
  const errors: { email?: string; password?: string } = {}
  if (!email) {
    errors.email = "Email is required."
  } else if (!NU_EMAIL_REGEX.test(email)) {
    errors.email = "Must be a valid @students.nu-laguna.edu.ph address."
  }
  if (!password) {
    errors.password = "Password is required."
  }
  return errors
}

const BackgroundSVG = (): JSX.Element => (
  <img
    src={abstractIcon}
    alt="Login background"
    className="absolute inset-0 w-full h-full object-cover"
  />
)

export default function LoginPage(): JSX.Element {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [touched, setTouched]   = useState({ email: false, password: false })
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState("")
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Lock body scroll only on login page
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const errors  = validate(email, password)
  const isValid = Object.keys(errors).length === 0

  const handleBlur  = (field: "email" | "password") =>
    setTouched(prev => ({ ...prev, [field]: true }))

  const clearApiErr = () => setApiError("")

  const handleSubmit = async () => {
    setTouched({ email: true, password: true })
    if (!isValid) return

    setLoading(true)
    setApiError("")

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setApiError(data?.message || "Invalid email or password. Please try again.")
      } else {
        localStorage.setItem("msc_token",   data.token)
        localStorage.setItem("msc_refresh", data.refreshToken)
        window.location.href = "/dashboard"
      }
    } catch {
      setApiError("Unable to reach the server. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="font-sans h-screen flex flex-col overflow-hidden">

      {/* ── Main ── */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">

        <BackgroundSVG />
        <div className="absolute inset-0 backdrop-blur-xs bg-white/10" />

        <div className={`relative z-10 w-full mx-4 max-w-md transition-all duration-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="bg-card shadow-lg border border-border p-9 pb-8">

            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground mb-2">
              Login
            </h2>

            <div className="mb-6">
              <p className="text-base font-medium text-foreground mt-7 mb-2">Welcome Back</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Did you miss us? 'Cause we do. Come on and hop in to the young and beautiful you.
              </p>
            </div>

            {apiError && (
              <Alert
                variant="warning"
                className="mb-5 border-danger bg-danger-bg rounded-none [&>svg]:text-danger animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <AlertCircle className="w-4 h-4 text-foreground" />
                <AlertDescription className="text-foreground">
                  {apiError}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-1">

              <div className="space-y-1">
                <Label htmlFor="msc-email">Email</Label>
                <Input
                  id="msc-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  className={touched.email && errors.email ? "border-danger focus-visible:ring-danger/25" : ""}
                  onChange={e => { setEmail(e.target.value); clearApiErr() }}
                  onBlur={() => handleBlur("email")}
                />
                <div className="h-4">
                  {touched.email && errors.email && (
                    <span className="flex items-center gap-1 text-xs text-danger">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="msc-password">Password</Label>
                <div className="relative flex items-center">
                  <Input
                    id="msc-password"
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    className={[
                      "pr-10",
                      touched.password && errors.password
                        ? "border-danger focus-visible:ring-danger/25"
                        : "",
                    ].join(" ")}
                    onChange={e => { setPassword(e.target.value); clearApiErr() }}
                    onBlur={() => handleBlur("password")}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    tabIndex={-1}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="absolute right-1 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    onClick={() => setShowPass(p => !p)}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="h-4">
                  {touched.password && errors.password && (
                    <span className="flex items-center gap-1 text-xs text-danger">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.password}
                    </span>
                  )}
                </div>
              </div>

            </div>

            <Button
              type="button"
              size="lg"
              className="w-full mt-5 disabled:opacity-50 disabled:cursor-not-allowed rounded-none bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
            </Button>

            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                className="text-sm font-extralight text-muted-foreground hover:text-primary no-underline hover:no-underline"
              >
                Forgot password?
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}