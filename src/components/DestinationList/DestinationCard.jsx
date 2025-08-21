import React from 'react';

function DestinationCard({ 
    destination, 
    isActive, 
    isHidden, 
    onSelect, 
    onToggleVisibility 
}) {
    const renderDifficultyIcon = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
            case 'intermediate':
                return <div className="w-3 h-3 bg-blue-500"></div>;
            case 'advanced':
                return (
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-black transform rotate-45"></div>
                    </div>
                );
            case 'expert':
                return (
                    <div className="bg-white rounded-sm px-1 py-0.5 flex gap-0.5 h-4 items-center">
                        <div className="w-1.5 h-1.5 bg-black transform rotate-45"></div>
                        <div className="w-1.5 h-1.5 bg-black transform rotate-45"></div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderVisibilityIcon = (isHidden) => {
        if (isHidden) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
            );
        }
        return (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </>
        );
    };

    return (
        <div
            id={`card-${destination.id}`}
            className={`top-card flex-shrink-0 w-48 p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:border-white/40 hover:bg-white/20 relative ${
                isActive ? '!border-sky-400 !bg-white/20' : ''
            } ${isHidden ? 'opacity-50' : ''}`}
            onClick={() => onSelect(destination.id)}
        >
            <button
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors z-10"
                onClick={(e) => onToggleVisibility(destination.id, e)}
                title={isHidden ? "显示目的地" : "隐藏目的地"}
            >
                {renderVisibilityIcon(isHidden)}
            </button>
            
            <div className="flex items-center gap-2 pr-8">
                <h3 className="text-white font-semibold truncate">{destination.name}</h3>
                {destination.difficulty && (
                    <div className="flex-shrink-0" title={destination.difficultyInfo || ''}>
                        {renderDifficultyIcon(destination.difficulty)}
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
                {destination.tags.map(tag => (
                    <span key={tag} className="text-xs text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default DestinationCard;