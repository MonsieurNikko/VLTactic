"use client";

import React from "react";

interface MapSwitchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmClear: () => void;
    onConfirmSave: () => void;
    mapDisplayName: string;
}

export default function MapSwitchModal({
    isOpen,
    onClose,
    onConfirmClear,
    onConfirmSave,
    mapDisplayName,
}: MapSwitchModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-950/50 border border-orange-500/50 rounded-full flex items-center justify-center text-orange-500">
                            ⚠️
                        </div>
                        <h3 className="text-xl font-bold text-white">Switching to {mapDisplayName}</h3>
                    </div>

                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                        You have active items or drawings on the board. Switching maps will clear your current strategy. Would you like to save it first?
                    </p>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={onConfirmSave}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                        >
                            💾 Save & Switch
                        </button>
                        <button
                            onClick={onConfirmClear}
                            className="w-full py-2.5 bg-neutral-800 hover:bg-red-900/40 hover:text-red-300 text-neutral-300 font-medium rounded-lg transition-colors"
                        >
                            🗑 Discard & Switch
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 bg-transparent hover:bg-neutral-800 text-neutral-500 hover:text-neutral-400 font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <div className="px-6 py-3 bg-neutral-950/50 border-t border-neutral-800 flex justify-center">
                    <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold">VLTactic Strategy Guard</span>
                </div>
            </div>
        </div>
    );
}
