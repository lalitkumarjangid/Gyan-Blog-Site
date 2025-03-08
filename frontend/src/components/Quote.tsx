export const Quote = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02]">
            <div className="w-full max-w-2xl p-8 space-y-8">
                <div className="relative">
                    <div className="absolute -left-4 -top-4 text-6xl text-emerald-500/20">"</div>
                    <blockquote className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 leading-relaxed">
                        Empowering Developers: Your Ultimate Destination for Expert Tips, Insights, and Mastery in the World of Coding.
                    </blockquote>
                    <div className="absolute -right-4 bottom-0 text-6xl text-emerald-500/20 leading-none">"</div>
                </div>
                
                <div className="space-y-2 relative z-10">
                    <a 
                        href="https://lalitdev.vercel.app" 
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="block text-xl font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Lalit Kumar Jangid
                    </a>
                    <div className="text-sm font-medium text-neutral-500">
                        Developer | <span className="text-emerald-500">Gyan</span>
                    </div>
                </div>
            </div>
        </div>
    );
}