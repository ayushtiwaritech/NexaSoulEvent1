import React, { useState } from 'react';
import type { Mission } from '../types/mission';

interface ProofSubmissionModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (missionId: string, evidenceUrl: string, notes: string) => void;
}

export const ProofSubmissionModal: React.FC<ProofSubmissionModalProps> = ({
  mission,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [simulatedFileName, setSimulatedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !mission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceUrl.trim() && !simulatedFileName) {
      setError('Please provide an evidence link or attach an operative artifact file.');
      return;
    }
    setError(null);
    onSubmit(
      mission.id, 
      evidenceUrl || `https://cu-operatives.local/artifacts/${simulatedFileName || 'submission-bundle.zip'}`, 
      notes || 'Objective milestones completed and verified against local criteria.'
    );
    // Reset local state
    setEvidenceUrl('');
    setNotes('');
    setSimulatedFileName(null);
    onClose();
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSimulatedFileName(e.target.files[0].name);
      setError(null);
    }
  };

  return (
    <div className="modal-backdrop cursed-modal-backdrop" onClick={onClose}>
      <div className="modal-card cursed-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-tag">
            <span className="modal-code cursed-modal-code">{mission.code}</span>
            <span className="modal-xp cursed-modal-xp">+{mission.xpReward} XP REWARD (呪力)</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <h3 className="modal-title">
          <span className="title-seal-glyph">印</span> Submit Proof of Exorcism
        </h3>
        <p className="modal-subtitle">
          Mission Directive: <strong>{mission.title}</strong>
        </p>

        <form onSubmit={handleSubmit} className="proof-form">
          {error && <div className="form-error-alert">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="evidence-url">
              Evidence Repository / Pull Request / Verification URL <span className="req">*</span>
            </label>
            <input
              id="evidence-url"
              type="text"
              className="form-input cursed-input"
              placeholder="e.g. https://github.com/campus-guild/pr-42 or demo link"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
            />
            <span className="form-helper-text">
              Link to your GitHub PR, audit log, Loom video, or verification write-up.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proof-notes">
              Operative Briefing & Seal Implementation Notes
            </label>
            <textarea
              id="proof-notes"
              rows={3}
              className="form-textarea cursed-textarea"
              placeholder="Detail the technical steps taken, edge cases addressed, and how criteria were verified..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Attach Telemetry / Log Artifact (Optional)
            </label>
            <label className="upload-dropzone cursed-dropzone">
              <input
                type="file"
                className="hidden-file-input"
                onChange={handleSimulateUpload}
              />
              <div className="dropzone-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {simulatedFileName ? (
                  <span className="uploaded-file-name">Selected: {simulatedFileName}</span>
                ) : (
                  <span>Click to attach .pcap, .log, or proof screenshot</span>
                )}
              </div>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary cursed-btn-primary">
              <span className="btn-glyph">封</span>
              Submit Proof for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
