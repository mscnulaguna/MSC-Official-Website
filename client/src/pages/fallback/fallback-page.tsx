import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_CONFIG, resolveType } from '../../config/fallback-config';
import FallbackVisual from './fallback-visual';
import { Button } from '../../components/ui/button';


//props
interface FallbackPageProps {
    type?: string; //raw type from route param - needs resolution to config key
}

export default function FallbackPage({ type }: FallbackPageProps) {
    const navigate = useNavigate();

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    //resolve the raw type to a config key (with alias support and fallback to "somethingWentWrong")
    const configKey = resolveType(type);
    const config = FALLBACK_CONFIG[configKey];
    //hard errors get a back to home button, while softer ones just show the animation and message
    const isHardError = configKey === "somethingWentWrong";

    return (
        <div className="h-[calc(100dvh-65px)] flex items-center justify-center px-6 text-center overflow-hidden">
            <div className="flex flex-col items-center -translate-y-6 sm:-translate-y-10">
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

                {isHardError ? (
                    <Button 
                        variant="outline" 
                        className="mt-6" 
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </Button>
                    ) : (
                    <Button 
                        variant="outline" 
                        className="mt-6" 
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                )}
            </div>
        </div>
    )
}