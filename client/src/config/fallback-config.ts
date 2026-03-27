// central config for allfallback pages type — fully typed
// add new fallback types by:
// 1. adding the key to 'FallbackType'
// 2. adding the entry to 'FALLBACK_CONFIG'
// 3. adding its aliases to 'TYPE_ALIASES'
// no changes needed anywhere else

// TYPES
export type FallbackType = 
    | "404"
    | "coming-soon"
    | "maintenance"
    | "access-restricted"
    | "no-announcements"
    | "something-went-wrong";

// CONFIG ENTRY
export interface FallbackEntry {
    label: string; // human-readable label for the fallback type
    title: string; // title to display on the fallback page
    message: string; // message to display on the fallback page
    accent: string;
}

// CONFIGS
export const FALLBACK_CONFIG: Record<FallbackType, FallbackEntry> = {
    "404": {
        label: "404 Not Found",
        title: "Page not found",
        message: "Looks like this page took a field trip without telling us.",
        accent: "",
        
    },
    "coming-soon": {
        label: "Coming Soon",
        title: "We're cooking something...",
        message: "This page is currently in development. Our team is probably arguing over variable names right now.",
       accent: "",
    },
    "maintenance": {
        label: "Under Maintenance",
        title: "We'll be back soon",
        message: "We're upgrading this section to make it better that your last project.",
        accent: "",
    },
    "access-restricted": {
        label: "Access Restricted",
        title: "Access restricted",
        message: "Looks like this area requires a different level of access. You need the right badge to enter. Please contact the administrator if you believe this is an error.",
        accent: "",
    },
    "no-announcements": {
        label: "No Announcements",
        title: "No announcements",
        message: "There are no updates at the moment. Keep an eye out — something exciting may be on the way.",
        accent: "",
    },
    "something-went-wrong": {
        label: "Something went wrong",
        title: "Something went wrong",
        message: "Our servers are having a moment. The team is debugging the issue and will have things back up soon. Thanks for your patience!",
        accent: "",
    },
};


// ALIAS MAP
export const TYPE_ALIASES: Record<string, FallbackType> = {
    //404
    "page not found": "404",
    "404": "404",
    //coming soon
    "coming soon": "coming-soon",
    "we're cooking something": "coming-soon",
    //maintenance
    "under maintenance": "maintenance",
    "we'll be back soon": "maintenance",
    "maintenance": "maintenance",
    //access restricted
    "access restricted": "access-restricted",
    //no announcements
    "no announcements": "no-announcements",
    "no updates": "no-announcements",
    //something went wrong
    "something went wrong": "something-went-wrong",
};

//helper
export function resolveType(rawType: string | undefined): FallbackType {
    if (!rawType) return "404"; // default to 404 if no type provided
    const key = rawType.toLowerCase().trim();
    return TYPE_ALIASES[key] || "404"; // default to 404 if no match found
}