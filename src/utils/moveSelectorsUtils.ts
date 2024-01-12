export function StateButtonStyle(buttonState: string, selectedState: string | null) {
    if (!selectedState) {
        return "bg-slate-600 hover:bg-slate-800 px-4 py-2 rounded-md text-white"
    }
    if (buttonState == selectedState) {
        return "bg-slate-800 px-4 py-2 rounded-md text-white"
    }
    return "bg-slate-400 hover:bg-slate-600 px-4 py-2 rounded-md text-white"
} 