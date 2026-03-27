import { FALLBACK_CONFIG, resolveType } from '../../config/fallback-config';

//props
interface FallbackPageProps {
    type?: string; //raw type from route param - needs resolution to config key
}

export default function FallbackPage({ type }: FallbackPageProps) {
    //ersolve the raw prop == guaranteed fallback type = typed config entry
    const configKey = resolveType(type);
    const config = FALLBACK_CONFIG[configKey]; //fallback entry - always defined

    return (
        <div className="max-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
            {/* visual indicator - svg or emoji */}
            <span className="text-8xl select-none" role="img" aria-label={config.title}>
                {config.accent}
            </span>

            {/* title */}
            <h1 className="mt-8 text-3xl font-bold tracking-tight">
                {config.title}
            </h1>

            {/* message */}
            <p className="mt-3 text-sm tracking-tight">
                {config.message}
            </p>
        </div>
    )
    
}