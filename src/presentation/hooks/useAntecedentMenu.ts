import { useState } from 'react';

interface UseAntecedenteMenuReturn {
    menuAnchorEl: null | HTMLElement;
    menuOpen: boolean;
    confirmDialogOpen: boolean;
    handleMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
    handleMenuClose: () => void;
    handleEditClick: () => void;
    handleDeleteClick: () => void;
    setConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UseAntecedenteMenuProps {
    setCurrentMode: React.Dispatch<React.SetStateAction<'add' | 'view' | 'edit'>>; 
}

export const useAntecedenteMenu = ({ 
    setCurrentMode 
}: UseAntecedenteMenuProps): UseAntecedenteMenuReturn => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    
    const menuOpen = Boolean(menuAnchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>): void => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (): void => {
        setMenuAnchorEl(null);
    };

    const handleEditClick = (): void => {
        setCurrentMode('edit');
        handleMenuClose();
    };

    const handleDeleteClick = (): void => {
        handleMenuClose();
        setConfirmDialogOpen(true);
    };

    return {
        menuAnchorEl,
        menuOpen,
        confirmDialogOpen,
        handleMenuClick,
        handleMenuClose,
        handleEditClick,
        handleDeleteClick,
        setConfirmDialogOpen
    };
};