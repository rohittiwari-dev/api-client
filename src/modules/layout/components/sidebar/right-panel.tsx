'use client';

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import useRightPanelStore from '../../store/right-panel.store';
import EnvironmentSwitcher from '@/modules/workspace/components/EnvironmentSwitcher';
import CookieManager from '@/modules/cookies/components/CookieManager';
import RequestInfoPanel from './RequestInfoPanel';

const RightPanel = () => {
    const { activePanel, closePanel } = useRightPanelStore();

    return (
        <>
            {/* Environment Modal - Two panel view with sidebar */}
            <Dialog open={activePanel === 'environment'} onOpenChange={(open) => !open && closePanel()}>
                <DialogContent className="max-w-[90vw] min-w-[70vw] w-fit h-[85vh] p-0 flex items-stretch justify-center flex-col gap-0">
                    <DialogHeader className="px-4 py-3 border-b">
                        <DialogTitle className="text-sm">Manage Environment</DialogTitle>
                    </DialogHeader>
                    <EnvironmentSwitcher />
                </DialogContent>
            </Dialog>

            {/* Cookie Manager Modal */}
            <Dialog open={activePanel === 'cookies'} onOpenChange={(open) => !open && closePanel()}>
                <DialogContent className="max-w-[90vw] min-w-[70vw] w-fit h-[80vh] p-0 flex items-stretch justify-center flex-col gap-0">
                    <DialogHeader className="px-4 py-3 border-b">
                        <DialogTitle className="text-sm">Manage Cookies</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto p-4">
                        <CookieManager />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Request Info Sheet (Side Drawer) */}
            <Sheet open={activePanel === 'request'} onOpenChange={(open) => !open && closePanel()}>
                <SheetContent side="right" className="w-[360px] p-0 flex flex-col">
                    <SheetHeader className="px-4 py-3 border-b bg-muted/30 shrink-0">
                        <SheetTitle className="text-sm">Request Info</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-hidden">
                        <RequestInfoPanel />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Code Sheet (Side Drawer) */}
            <Sheet open={activePanel === 'code'} onOpenChange={(open) => !open && closePanel()}>
                <SheetContent side="right" className="w-96 p-0">
                    <SheetHeader className="px-4 py-3 border-b">
                        <SheetTitle className="text-sm">Code Snippet</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-auto p-4">
                        <p className="text-muted-foreground text-xs text-center py-8">
                            Generate code snippets in various languages coming soon
                        </p>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default RightPanel;
