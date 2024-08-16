"use client";

import { createContext, useCallback, useContext, useState } from "react";
import CreateProjectModal from "@/components/domains/header/projects-dropdown/create-project-modal/create-project-modal";
import { ModalKey } from "./types";
import NewEntryModal from "@/components/domains/sidebar/modals/new-entry.modal";
import RenameEntryModal from "@/components/domains/sidebar/modals/rename-entry.modal";
import DeleteEntryModal from "@/components/domains/sidebar/modals/delete-entry.modal";

const ModalComponents: Record<ModalKey, React.ComponentType<any>> = {
  [ModalKey.createProject]: CreateProjectModal,
  [ModalKey.newEntry]: NewEntryModal,
  [ModalKey.renameEntry]: RenameEntryModal,
  [ModalKey.deleteEntry]: DeleteEntryModal,
};

interface ModalContextResult {
  openModal: (modalKey: ModalKey, props?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextResult | undefined>(undefined);

interface ModalContextProviderProps {
  children: React.ReactNode;
}
export const ModalContextProvider = ({
  children,
}: ModalContextProviderProps) => {
  const [activeModal, setActiveModal] = useState<{
    key: ModalKey;
    props?: any;
  } | null>(null);

  const openModal = useCallback(
    (modalKey: ModalKey, props?: any) => {
      if (!activeModal) {
        setActiveModal({ key: modalKey, props });
      }
    },
    [activeModal]
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const renderActiveModal = () => {
    if (!activeModal) return null;

    const ModalComponent = ModalComponents[activeModal.key];
    return <ModalComponent {...activeModal.props} onClose={closeModal} />;
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {renderActiveModal()}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useModalContext must be used within a ModalContextProvider"
    );
  }
  return context;
};
