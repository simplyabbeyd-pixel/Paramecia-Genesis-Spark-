import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from '../services/googleAuth';
import {
  listDriveFiles,
  getOrCreateParameciaFolder,
  uploadJsonToDrive,
  downloadFileContent,
  deleteDriveFile,
  DriveFileItem,
} from '../services/googleDrive';
import { Spark, Idea, Wish, CosmicEvent } from '../types';
import {
  X,
  Cloud,
  HardDrive,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Folder,
  FileText,
  Sparkles,
  LogOut,
  Loader2,
} from 'lucide-react';
import { cosmicAudio } from '../utils/audio';

interface GoogleDriveModalProps {
  onClose: () => void;
  cosmosState: {
    sparks: Spark[];
    ideas: Idea[];
    wishes: Wish[];
    millenniaAge: number;
    events: CosmicEvent[];
  };
  onRestoreCosmos: (savedState: {
    sparks: Spark[];
    ideas: Idea[];
    wishes: Wish[];
    millenniaAge: number;
    events: CosmicEvent[];
  }) => void;
  onAddCosmicEvent: (text: string, type: CosmicEvent['type']) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  onClose,
  cosmosState,
  onRestoreCosmos,
  onAddCosmicEvent,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive files state
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Deletion confirmation dialog state (Mandatory per skill)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Init auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files when token is available
  const fetchFiles = useCallback(async (authToken: string) => {
    setIsLoadingFiles(true);
    setErrorMsg(null);
    try {
      const driveFiles = await listDriveFiles(authToken, {
        query: searchQuery,
      });
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      setErrorMsg(err.message || 'Failed to load files from Google Drive.');
    } finally {
      setIsLoadingFiles(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (token) {
      fetchFiles(token);
    }
  }, [token, fetchFiles]);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setActionSuccess('Connected to Google Drive successfully!');
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setAuthError(err.message || 'Failed to sign in with Google.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setFiles([]);
  };

  // Archive current universe to Drive
  const handleArchiveCosmos = async () => {
    if (!token) return;
    setIsUploading(true);
    setErrorMsg(null);
    try {
      cosmicAudio.playChargeElectric();
      const folderId = await getOrCreateParameciaFolder(token);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `Paramecia_Cosmos_Epoch_${Math.floor(cosmosState.millenniaAge)}M_${timestamp}.json`;

      const payload = {
        universe: 'Paramecia',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        millenniaAge: cosmosState.millenniaAge,
        statistics: {
          ideasCount: cosmosState.ideas.length,
          sparksCount: cosmosState.sparks.length,
          wishesCount: cosmosState.wishes.length,
        },
        ideas: cosmosState.ideas,
        sparks: cosmosState.sparks,
        wishes: cosmosState.wishes,
        events: cosmosState.events,
      };

      const uploaded = await uploadJsonToDrive(token, filename, payload, folderId);
      setActionSuccess(`Archived current cosmos as "${uploaded.name}" in Google Drive!`);
      onAddCosmicEvent(`Cosmos state archived to Google Drive [${uploaded.name}]`, 'crystallization');
      fetchFiles(token);
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMsg(err.message || 'Failed to archive cosmos to Google Drive.');
    } finally {
      setIsUploading(false);
    }
  };

  // Restore universe from selected Drive file
  const handleRestoreFile = async (file: DriveFileItem) => {
    if (!token) return;
    setIsLoadingFiles(true);
    setErrorMsg(null);
    try {
      const content = await downloadFileContent(token, file.id);
      const data = JSON.parse(content);

      if (!data.ideas || !Array.isArray(data.ideas)) {
        throw new Error('This file does not contain a valid Paramecia Cosmos state.');
      }

      onRestoreCosmos({
        ideas: data.ideas || [],
        sparks: data.sparks || [],
        wishes: data.wishes || [],
        millenniaAge: data.millenniaAge || 14200,
        events: data.events || [],
      });

      cosmicAudio.playRecognition();
      setActionSuccess(`Universe successfully restored from "${file.name}"!`);
      onAddCosmicEvent(`Cosmos restored from Google Drive archive: ${file.name}`, 'recognition');
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      console.error('Failed to restore cosmos:', err);
      setErrorMsg(err.message || 'Could not parse or restore this cosmos file.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Execute confirmed deletion
  const handleConfirmDelete = async () => {
    if (!token || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(token, fileToDelete.id);
      setActionSuccess(`"${fileToDelete.name}" was deleted from Google Drive.`);
      setFileToDelete(null);
      fetchFiles(token);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      console.error('Failed to delete file:', err);
      setErrorMsg(err.message || 'Failed to delete file from Google Drive.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        id="google-drive-modal-content"
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#070b19] border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-7 text-slate-200"
      >
        {/* Close Button */}
        <button
          id="btn-close-google-drive"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
              <Cloud className="w-4 h-4" />
              <span>Google Drive Integration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel'] text-white">
              Cosmic Drive Vault
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Archive Paramecia universes, restore cosmic epochs, and store sentient element records in Google Drive.
            </p>
          </div>
        </div>

        {/* Alert Messages */}
        {actionSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign In / Account Status Card */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border border-cyan-400"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {user.displayName || 'Google Drive Connected'}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-archive-cosmos"
                  onClick={handleArchiveCosmos}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow transition-all disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Archiving...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Archive Cosmos to Drive</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-signout-google"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Disconnect</span>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Connect your Google Account
                </h4>
                <p className="text-xs text-slate-400">
                  Authorize with Google Drive to enable cloud backup and restore for your Paramecia universe.
                </p>
                {authError && (
                  <p className="text-xs text-rose-400 mt-1">{authError}</p>
                )}
              </div>

              {/* Official styled Sign In with Google Button */}
              <button
                id="btn-signin-google"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold shadow-md transition-all active:scale-98 cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                ) : (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
            </div>
          )}
        </div>

        {/* Drive Explorer Section */}
        {user ? (
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files in Google Drive..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-refresh-drive-files"
                  onClick={() => token && fetchFiles(token)}
                  disabled={isLoadingFiles}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  title="Refresh Files"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Files List */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 max-h-72 overflow-y-auto">
              {isLoadingFiles ? (
                <div className="p-8 flex flex-col items-center justify-center text-slate-400 text-xs font-mono">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mb-2" />
                  <span>Accessing Google Drive...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-mono">
                  No files found matching your search. Click "Archive Cosmos to Drive" to create your first celestial backup!
                </div>
              ) : (
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3 hidden sm:table-cell">Type</th>
                      <th className="py-2.5 px-3 hidden md:table-cell">Modified</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {files.map((file) => {
                      const isParameciaArchive =
                        file.name.includes('Paramecia') || file.name.endsWith('.json');
                      const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                      return (
                        <tr key={file.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2 px-3 flex items-center gap-2">
                            {isFolder ? (
                              <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : isParameciaArchive ? (
                              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate max-w-[220px] sm:max-w-xs font-medium text-slate-200">
                              {file.name}
                            </span>
                          </td>
                          <td className="py-2 px-3 hidden sm:table-cell text-[11px] text-slate-500 truncate max-w-[120px]">
                            {isFolder ? 'Folder' : isParameciaArchive ? 'Cosmic Archive' : file.mimeType}
                          </td>
                          <td className="py-2 px-3 hidden md:table-cell text-[11px] text-slate-500">
                            {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : '-'}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Restore Universe button if it's a cosmic archive */}
                              {isParameciaArchive && !isFolder && (
                                <button
                                  onClick={() => handleRestoreFile(file)}
                                  className="px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-[11px] flex items-center gap-1 transition-colors"
                                  title="Restore Universe from this file"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Restore</span>
                                </button>
                              )}

                              {/* Open in Google Drive */}
                              {file.webViewLink && (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                  title="Open in Google Drive"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {/* Delete button (triggers explicit confirmation modal) */}
                              <button
                                onClick={() => setFileToDelete(file)}
                                className="p-1 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete from Google Drive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-slate-950/40 border border-slate-800/60 text-center">
            <HardDrive className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300 mb-1">
              Google Drive Offline
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Sign in with your Google account above to sync Paramecia's eons, store living ideas, and download cosmic archives safely.
            </p>
          </div>
        )}

        {/* Mandatory User Confirmation Dialog for Destructive Operations */}
        {fileToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-[#0a0f24] border border-rose-600/80 rounded-2xl shadow-2xl p-6 text-slate-200">
              <div className="flex items-center gap-3 mb-4 text-rose-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold font-['Cinzel'] text-white">
                  Confirm Deletion from Google Drive
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Are you sure you want to permanently delete{' '}
                <strong className="text-white font-mono">"{fileToDelete.name}"</strong>{' '}
                from your Google Drive? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  id="btn-cancel-delete"
                  onClick={() => setFileToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-delete"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete File</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
