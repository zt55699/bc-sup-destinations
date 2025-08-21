import React from 'react';

function DifficultyLegend() {
    return (
        <div id="difficulty-legend" className="fixed bottom-0 left-0 right-0 z-10 backdrop-blur-2xl h-12 transition-all duration-300"
            style={{
                opacity: 0,
                transform: 'translateY(100%)',
                background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    rgba(255, 255, 255, 0.05) 25%,
                    rgba(255, 255, 255, 0.08) 50%,
                    rgba(255, 255, 255, 0.03) 75%,
                    rgba(255, 255, 255, 0.06) 100%)`,
                borderTop: `1px solid rgba(255, 255, 255, 0.15)`,
                boxShadow: `
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
                    0 -4px 16px rgba(0, 0, 0, 0.2)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '32px'
            }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', transform: 'translateY(-3px)'}}>
                <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', opacity: '0.8', backgroundColor: 'rgba(34, 197, 94, 0.7)'}}>
                    <div style={{width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%'}}></div>
                </div>
                <span style={{color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px', fontWeight: '500'}}>初级</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', transform: 'translateY(-3px)'}}>
                <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', opacity: '0.8', backgroundColor: 'rgba(59, 130, 246, 0.7)'}}>
                    <div style={{width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%'}}></div>
                </div>
                <span style={{color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px', fontWeight: '500'}}>中级</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', transform: 'translateY(-3px)'}}>
                <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', opacity: '0.8', backgroundColor: 'rgba(249, 115, 22, 0.7)'}}>
                    <div style={{width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%'}}></div>
                </div>
                <span style={{color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px', fontWeight: '500'}}>高级</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', transform: 'translateY(-3px)'}}>
                <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', opacity: '0.8', backgroundColor: 'rgba(220, 38, 38, 0.7)'}}>
                    <div style={{width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%'}}></div>
                </div>
                <span style={{color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px', fontWeight: '500'}}>专家级</span>
            </div>
        </div>
    );
}

export default DifficultyLegend;