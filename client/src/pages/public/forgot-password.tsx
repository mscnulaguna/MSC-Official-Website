import { useState, useEffect, type JSX } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom" // or your router of choice
import abstractIcon from '@/assets/shapes/abstracticons.svg'

const NU_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@students\.nu-laguna\.edu\.ph$/

function validate(email: string) {
  const errors: { email?: string } = {}
  if (!email) {
    errors.email = "Email is required."
  } else if (!NU_EMAIL_REGEX.test(email)) {
    errors.email = "Must be a valid @students.nu-laguna.edu.ph address."
  }
  return errors
}

const BackgroundSVG = (): JSX.Element => (
  <img
    src={abstractIcon}
    alt=""
    className="absolute inset-0 w-full h-full object-cover"
  />
)

export default function ForgotPasswordPage(): JSX.Element {
  const [email, setEmail]       = useState("")
  const [touched, setTouched]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState("")
  const [sent, setSent]         = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const errors  = validate(email)
  const isValid = Object.keys(errors).length === 0

  const handleSubmit = async () => {
    setTouched(true)
    if (!isValid) return

    setLoading(true)
    setApiError("")

    try {
      const res = await fetch("https://api.msc-nulaguna.org/v1/auth/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setApiError(data?.message || "Something went wrong. Please try again.")
      } else {
        setSent(true)
      }
    } catch {
      setApiError("Unable to reach the server. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="font-sans h-screen flex flex-col overflow-hidden">
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">

        <BackgroundSVG />
        <div className="absolute inset-0 backdrop-blur-xs bg-white/10" />

        <div className={`relative z-10 w-full mx-4 max-w-md transition-all duration-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="bg-card shadow-lg border border-border p-9 pb-8">

            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground mb-2">
              Forgot Password
            </h2>

            <div className="mb-6">
              <p className="text-base font-medium text-foreground mt-7 mb-2">
                {sent ? "Check your inbox" : "Reset your password"}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {sent
                  ? `We've sent a password reset link to ${email}. It may take a minute to arrive.`
                  : "Enter your student email and we'll send you a link to reset your password."}
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

            {sent ? (
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 border border-green-200">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive it?{" "}
                  <button
                    type="button"
                    className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                    onClick={() => { setSent(false); setTouched(false); setEmail("") }}
                  >
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <div className="space-y-1">
                    <Label htmlFor="fp-email">Email</Label>
                    <Input
                      id="fp-email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
                      value={email}
                      className={touched && errors.email ? "border-danger focus-visible:ring-danger/25" : ""}
                      onChange={e => { setEmail(e.target.value); setApiError("") }}
                      onBlur={() => setTouched(true)}
                      onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    />
                    <div className="h-4">
                      {touched && errors.email && (
                        <span className="flex items-center gap-1 text-xs text-danger">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {errors.email}
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
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                    : "Send Reset Link"}
                </Button>
              </>
            )}

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

          </div>
        </div>

      </div>
    </div>
  )
}