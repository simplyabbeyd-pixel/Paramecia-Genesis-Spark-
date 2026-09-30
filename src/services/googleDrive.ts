export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  description?: string;
  parents?: string[];
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3/files';

/**
 * List files from Google Drive
 */
export async function listDriveFiles(
  accessToken: string,
  options: { query?: string; folderId?: string; pageSize?: number } = {}
): Promise<DriveFileItem[]> {
  const { query = '', folderId, pageSize = 30 } = options;

  let q = "trashed = false";
  if (folderId) {
    q += ` and '${folderId}' in parents`;
  }
  if (query.trim()) {
    q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
  }

  const url = new URL(`${DRIVE_API_URL}/files`);
  url.searchParams.set('q', q);
  url.searchParams.set('pageSize', pageSize.toString());
  url.searchParams.set(
    'fields',
    'files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink, description, parents)'
  );
  url.searchParams.set('orderBy', 'modifiedTime desc');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to list Google Drive files: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Find or create a dedicated "Paramecia Universe Archives" folder in Drive
 */
export async function getOrCreateParameciaFolder(accessToken: string): Promise<string> {
  const existing = await listDriveFiles(accessToken, {
    query: "Paramecia Universe Archives",
    pageSize: 5,
  });

  const folder = existing.find(
    (f) => f.name === 'Paramecia Universe Archives' && f.mimeType === 'application/vnd.google-apps.folder'
  );

  if (folder) {
    return folder.id;
  }

  // Create new folder
  const res = await fetch(`${DRIVE_API_URL}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Paramecia Universe Archives',
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Cosmic records, periodic element states, and sentient ideas saved from the Paramecia cosmos',
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create Paramecia folder in Drive: ${await res.text()}`);
  }

  const newFolder = await res.json();
  return newFolder.id;
}

/**
 * Upload a universe archive or idea state as JSON file into Google Drive using multipart upload
 */
export async function uploadJsonToDrive(
  accessToken: string,
  name: string,
  contentObj: any,
  parentFolderId?: string
): Promise<DriveFileItem> {
  const metadata: any = {
    name,
    mimeType: 'application/json',
    description: 'Saved cosmic state of the Paramecia homebrew universe',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(contentObj, null, 2) +
    closeDelimiter;

  const res = await fetch(`${UPLOAD_API_URL}?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Failed to upload to Google Drive: ${await res.text()}`);
  }

  return await res.json();
}

/**
 * Download file content from Google Drive
 */
export async function downloadFileContent(accessToken: string, fileId: string): Promise<string> {
  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to download file from Google Drive: ${await res.text()}`);
  }

  return await res.text();
}

/**
 * Delete a file or folder from Google Drive
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete Google Drive file: ${await res.text()}`);
  }
}
