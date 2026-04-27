import { useState, useEffect, type JSX } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom" // or your router of choice
import abstractIcon from '@/assets/shapes/abstracticons.svg'

// ── Validation ────────────────────────────────────────────────────────────────

function validate(password: string, confirm: string) {
  const errors: { password?: string; confirm?: string } = {}

  if (!password) {
    errors.password = "Password is required."
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters."
  }

  if (!confirm) {
    errors.confirm = "Please confirm your password."
  } else if (password && confirm !== password) {
    errors.confirm = "Passwords do not match."
  }

  return errors
}

// ── Password strength ─────────────────────────────────────────────────────────

type Strength = "weak" | "fair" | "strong"

function getStrength(password: string): { level: Strength; label: string; bars: number } {
  if (!password) return { level: "weak", label: "", bars: 0 }
  let score = 0
  if (password.length >= 8)  score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password))           score++
  if (/[0-9]/.test(password))           score++
  if (/[^A-Za-z0-9]/.test(password))   score++
  if (score <= 1) return { level: "weak",   label: "Weak",   bars: 1 }
  if (score <= 3) return { level: "fair",   label: "Fair",   bars: 2 }
  return              { level: "strong", label: "Strong", bars: 3 }
}

const strengthColor: Record<Strength, string> = {
  weak:   "bg-danger",
  fair:   "bg-yellow-400",
  strong: "bg-green-500",
}

// ── Background ────────────────────────────────────────────────────────────────

const BackgroundSVG = (): JSX.Element => (
  <img
    src={abstractIcon}
    alt=""
    className="absolute inset-0 w-full h-full object-cover"
  />
)

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResetPasswordPage(): JSX.Element {
  const [searchParams]              = useSearchParams()
  const token                       = searchParams.get("token") ?? ""

  const [password, setPassword]     = useState("")
  const [confirm, setConfirm]       = useState("")
  const [showPass, setShowPass]     = useState(false)
  const [showConf, setShowConf]     = useState(false)
  const [touched, setTouched]       = useState({ password: false, confirm: false })
  const [loading, setLoading]       = useState(false)
  const [apiError, setApiError]     = useState("")
  const [success, setSuccess]       = useState(false)
  const [mounted, setMounted]       = useState(false)

  // Invalid / missing token guard
  const tokenMissing = !token

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const errors  = validate(password, confirm)
  const isValid = Object.keys(errors).length === 0
  const strength = getStrength(password)

  const handleBlur  = (field: "password" | "confirm") =>
    setTouched(prev => ({ ...prev, [field]: true }))

  const clearApiErr = () => setApiError("")

  const handleSubmit = async () => {
    setTouched({ password: true, confirm: true })
    if (!isValid || tokenMissing) return

    setLoading(true)
    setApiError("")

    try {
      const res = await fetch("https://api.msc-nulaguna.org/v1/auth/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setApiError(data?.message || "Something went wrong. Please try again.")
      } else {
        setSuccess(true)
      }
    } catch {
      setApiError("Unable to reach the server. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="font-sans h-screen flex flex-col overflow-hidden">
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">

        <BackgroundSVG />
        <div className="absolute inset-0 backdrop-blur-xs bg-white/10" />

        <div className={`relative z-10 w-full mx-4 max-w-md transition-all duration-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="bg-card shadow-lg border border-border p-9 pb-8">

            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground mb-2">
              Reset Password
            </h2>

            {/* ── Invalid token state ── */}
            {tokenMissing ? (
              <>
                <div className="mb-6">
                  <p className="text-base font-medium text-foreground mt-7 mb-2">Link invalid or expired</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This reset link is missing or has expired. Please request a new one.
                  </p>
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="w-full mt-2 rounded-none bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                >
                  <Link to="/forgot-password">Request New Link</Link>
                </Button>
              </>
            ) : success ? (
              /* ── Success state ── */
              <>
                <div className="mb-6">
                  <p className="text-base font-medium text-foreground mt-7 mb-2">Password updated!</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your password has been reset successfully. You can now sign in with your new password.
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 border border-green-200 mx-auto mb-5">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="w-full rounded-none bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                >
                  <Link to="/login">Back to Login</Link>
                </Button>
              </>
            ) : (
              /* ── Form state ── */
              <>
                <div className="mb-6">
                  <p className="text-base font-medium text-foreground mt-7 mb-2">Choose a new password</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Make it something strong that you haven't used before.
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

                  {/* Password */}
                  <div className="space-y-1">
                    <Label htmlFor="rp-password">New Password</Label>
                    <div className="relative flex items-center">
                      <Input
                        id="rp-password"
                        type={showPass ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="New Password"
                        value={password}
                        className={[
                          "pr-10",
                          touched.password && errors.password
                            ? "border-danger focus-visible:ring-danger/25"
                            : "",
                        ].join(" ")}
                        onChange={e => { setPassword(e.target.value); clearApiErr() }}
                        onBlur={() => handleBlur("password")}
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

                    {/* Strength meter — only show when user has typed */}
                    {password && (
                      <div className="pt-1 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3].map(bar => (
                            <div
                              key={bar}
                              className={[
                                "h-1 flex-1 rounded-full transition-all duration-300",
                                bar <= strength.bars ? strengthColor[strength.level] : "bg-muted",
                              ].join(" ")}
                            />
                          ))}
                        </div>
                        <p className={[
                          "text-xs",
                          strength.level === "weak"   ? "text-danger"      : "",
                          strength.level === "fair"   ? "text-yellow-500"  : "",
                          strength.level === "strong" ? "text-green-600"   : "",
                        ].join(" ")}>
                          {strength.label}
                        </p>
                      </div>
                    )}

                    <div className="h-4">
                      {touched.password && errors.password && (
                        <span className="flex items-center gap-1 text-xs text-danger">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {errors.password}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1">
                    <Label htmlFor="rp-confirm">Confirm Password</Label>
                    <div className="relative flex items-center">
                      <Input
                        id="rp-confirm"
                        type={showConf ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Confirm Password"
                        value={confirm}
                        className={[
                          "pr-10",
                          touched.confirm && errors.confirm
                            ? "border-danger focus-visible:ring-danger/25"
                            : "",
                        ].join(" ")}
                        onChange={e => { setConfirm(e.target.value); clearApiErr() }}
                        onBlur={() => handleBlur("confirm")}
                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        tabIndex={-1}
                        aria-label={showConf ? "Hide password" : "Show password"}
                        className="absolute right-1 text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => setShowConf(p => !p)}
                      >
                        {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="h-4">
                      {touched.confirm && errors.confirm && (
                        <span className="flex items-center gap-1 text-xs text-danger">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {errors.confirm}
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
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</>
                    : "Reset Password"}
                </Button>

                <div className="text-center mt-4">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm font-extralight text-muted-foreground hover:text-primary no-underline hover:no-underline gap-1"
                    asChild
                  >
                    <Link to="/login">
                      <ArrowLeft className="w-3 h-3" />
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}