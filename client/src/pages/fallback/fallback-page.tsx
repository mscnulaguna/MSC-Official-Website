import  { useNavigate } from 'react-router-dom';
import { FALLBACK_CONFIG, resolveType } from '../../config/fallback-config';
import FallbackVisual from './fallback-visual';
import { Button } from '../../components/ui/button';


//props
interface FallbackPageProps {
    type?: string; //raw type from route param - needs resolution to config key
}

export default function FallbackPage({ type }: FallbackPageProps) {
    const navigate = useNavigate();

    //resolve the raw type to a config key (with alias support and fallback to "somethingWentWrong")
    const configKey = resolveType(type);
    const config = FALLBACK_CONFIG[configKey];
    //hard errors get a back to home button, while softer ones just show the animation and message
    const isHardError = configKey === "somethingWentWrong";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            {/* Lottie Visual */}
            <FallbackVisual type={configKey} accent={config.accent} />

            {/* Title */}
            <h1 className="mt-8 text-3xl font-bold tracking-tight">
                {config.title}
            </h1>

            {/* Message */}
            <p className="mt-3 text-sm tracking-tight max-w-sm text-muted-foreground">
                {config.message}
            </p>

            <Button
                variant="outline"
                className={`mt-6 ${isHardError ? 'inline-flex' : 'hidden'}`}
                onClick={() => (isHardError ? navigate('/') : navigate(-1))}
            >
                {isHardError ? 'Back to Home' : 'Go Back'}
            </Button>
        </div>
    )
}