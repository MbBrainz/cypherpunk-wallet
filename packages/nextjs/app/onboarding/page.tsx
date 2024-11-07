"use client";

import React from "react";
import { useState } from "react";
import CreateWalletComponent from "../../components/CreateWalletComponent";
import ImportWalletComponent from "../../components/ImportWalletComponent";
import type { NextPage } from "next";

const OnboardingPage: NextPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <h1 className="text-5xl font-bold mb-10">Welcome to Cypherpunk Wallet</h1>
      <div className="flex space-x-4">
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          Create New Wallet
        </button>
        <button className="btn btn-secondary" onClick={() => setShowImportModal(true)}>
          Import Wallet
        </button>
      </div>

      {/* Create Wallet Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <CreateWalletComponent />
            <div className="modal-action">
              <button className="btn" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Wallet Modal */}
      {showImportModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <ImportWalletComponent />
            <div className="modal-action">
              <button className="btn" onClick={() => setShowImportModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
