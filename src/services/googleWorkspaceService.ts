import { GoogleAccountInfo, GoogleSheetsSyncStatus, GoogleDriveSyncStatus, GoogleClassroomCourse, GoogleClassroomAssignment, AppUserProfile, StudentRecording } from '../types';

const DEFAULT_OAUTH_CLIENT_ID = '343701045130-g7ue5ftn96vs1m52daa7747if66g0dti.apps.googleusercontent.com';
const STORAGE_KEY_CUSTOM_CLIENT_ID = 'tiengviet1_google_custom_client_id_v1';
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/classroom.rosters.readonly'
].join(' ');

const STORAGE_KEY_AUTH = 'tiengviet1_google_auth_v1';
const STORAGE_KEY_SHEET = 'tiengviet1_google_sheet_sync_v1';
const STORAGE_KEY_DRIVE = 'tiengviet1_google_drive_sync_v1';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; expires_in?: number }) => void;
            error_callback?: (err: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

class GoogleWorkspaceService {
  private tokenClient: any = null;
  private currentAccount: GoogleAccountInfo | null = null;
  private sheetsStatus: GoogleSheetsSyncStatus = { status: 'idle' };
  private driveStatus: GoogleDriveSyncStatus = { status: 'idle' };
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadPersistedData();
  }

  private loadPersistedData() {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        // Check if token is still valid (or within expiration)
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          this.currentAccount = parsed;
        } else {
          // Token expired, keep profile info but need refresh
          this.currentAccount = { ...parsed, accessToken: '' };
        }
      }

      const savedSheet = localStorage.getItem(STORAGE_KEY_SHEET);
      if (savedSheet) {
        this.sheetsStatus = JSON.parse(savedSheet);
      }

      const savedDrive = localStorage.getItem(STORAGE_KEY_DRIVE);
      if (savedDrive) {
        this.driveStatus = JSON.parse(savedDrive);
      }
    } catch (e) {
      console.error('Error loading Google Workspace persisted data', e);
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try {
        l();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Getters
  getAccount(): GoogleAccountInfo | null {
    return this.currentAccount;
  }

  isConnected(): boolean {
    return !!(this.currentAccount && this.currentAccount.accessToken && this.currentAccount.expiresAt > Date.now());
  }

  getSheetsStatus(): GoogleSheetsSyncStatus {
    return this.sheetsStatus;
  }

  getDriveStatus(): GoogleDriveSyncStatus {
    return this.driveStatus;
  }

  // Client ID Management
  getActiveClientId(): string {
    try {
      const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_CLIENT_ID);
      if (custom && custom.trim()) {
        return custom.trim();
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_OAUTH_CLIENT_ID;
  }

  setCustomClientId(id: string): void {
    try {
      if (id && id.trim()) {
        localStorage.setItem(STORAGE_KEY_CUSTOM_CLIENT_ID, id.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_CUSTOM_CLIENT_ID);
      }
      this.tokenClient = null;
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  resetCustomClientId(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_CLIENT_ID);
      this.tokenClient = null;
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  isUsingCustomClientId(): boolean {
    try {
      const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_CLIENT_ID);
      return !!(custom && custom.trim());
    } catch (e) {
      return false;
    }
  }

  getDefaultClientId(): string {
    return DEFAULT_OAUTH_CLIENT_ID;
  }

  // Initialize Token Client
  private initTokenClientPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window not available'));
        return;
      }

      // Check if GSI is loaded
      if (window.google?.accounts?.oauth2) {
        this.setupClient();
        resolve();
        return;
      }

      // Wait for script to load
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(interval);
          this.setupClient();
          resolve();
        } else if (attempts > 30) {
          clearInterval(interval);
          reject(new Error('Không thể tải Google Identity Services. Vui lòng kiểm tra kết nối mạng.'));
        }
      }, 200);
    });
  }

  private setupClient() {
    if (!window.google?.accounts?.oauth2) return;
    try {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.getActiveClientId(),
        scope: SCOPES,
        callback: () => {} // Overridden on request
      });
    } catch (err) {
      console.warn('setupClient error', err);
    }
  }

  // Connect / Sign In
  async signIn(): Promise<GoogleAccountInfo> {
    await this.initTokenClientPromise();

    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error('Thư viện Google Identity Services chưa sẵn sàng. Vui lòng thử tải lại trang web.'));
        return;
      }

      let isFinished = false;
      // 45s safety timeout to prevent infinite spinning in case popup hangs on Google 400 error page or is closed silently
      const timeoutTimer = setTimeout(() => {
        if (!isFinished) {
          isFinished = true;
          reject(new Error(
            'Quá thời gian chờ phản hồi từ Google (45s). ' +
            'Nếu bạn gặp màn hình "Lỗi 400: origin_mismatch", hãy xem mục "Khắc phục Lỗi 400: origin_mismatch" bên dưới để ủy quyền tên miền trên Google Cloud Console.'
          ));
        }
      }, 45000);

      const finishOnce = () => {
        clearTimeout(timeoutTimer);
        isFinished = true;
      };

      try {
        const activeClientId = this.getActiveClientId();
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: activeClientId,
          scope: SCOPES,
          error_callback: (err: any) => {
            if (isFinished) return;
            finishOnce();
            console.error('Google token error', err);
            const errType = err?.type || '';
            if (errType === 'popup_closed') {
              reject(new Error('Cửa sổ đăng nhập Google đã bị đóng trước khi hoàn tất xác thực.'));
            } else if (errType === 'popup_failed_to_open') {
              reject(new Error('Trình duyệt đã chặn cửa sổ Popup. Vui lòng cho phép Pop-up trên trình duyệt để tiếp tục.'));
            } else {
              reject(new Error(err?.message || 'Cửa sổ đăng nhập Google bị đóng hoặc bị chặn.'));
            }
          },
          callback: async (response: any) => {
            if (isFinished) return;
            finishOnce();

            if (response.error) {
              reject(new Error(`Lỗi xác thực Google: ${response.error}`));
              return;
            }

            if (response.access_token) {
              const accessToken = response.access_token;
              const expiresIn = response.expires_in || 3599;
              const expiresAt = Date.now() + expiresIn * 1000;

              let email = 'user@gmail.com';
              let name = 'Tài khoản Google';
              let picture = '';

              try {
                // Attempt 1: Fetch from oauth2 userinfo
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${accessToken}` }
                });

                if (userInfoRes.ok) {
                  const userInfo = await userInfoRes.json();
                  email = userInfo.email || email;
                  name = userInfo.name || userInfo.given_name || name;
                  picture = userInfo.picture || picture;
                } else {
                  // Attempt 2: Fallback to Drive API user info
                  try {
                    const driveAboutRes = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
                      headers: { Authorization: `Bearer ${accessToken}` }
                    });
                    if (driveAboutRes.ok) {
                      const driveData = await driveAboutRes.json();
                      if (driveData.user) {
                        email = driveData.user.emailAddress || email;
                        name = driveData.user.displayName || name;
                        picture = driveData.user.photoLink || picture;
                      }
                    }
                  } catch (driveErr) {
                    console.warn('Drive about fallback error', driveErr);
                  }
                }
              } catch (fetchErr) {
                console.warn('Could not fetch user profile details, using default placeholder', fetchErr);
              }

              const account: GoogleAccountInfo = {
                email,
                name,
                picture,
                accessToken,
                expiresAt
              };

              this.currentAccount = account;
              localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(account));
              this.notify();
              resolve(account);
            } else {
              reject(new Error('Không nhận được mã truy cập (Access Token) từ Google.'));
            }
          }
        });

        this.tokenClient = client;
        client.requestAccessToken({ prompt: '' });
      } catch (err: any) {
        finishOnce();
        reject(err);
      }
    });
  }

  signOut() {
    this.currentAccount = null;
    localStorage.removeItem(STORAGE_KEY_AUTH);
    this.notify();
  }

  private async getValidAccessToken(): Promise<string> {
    if (!this.currentAccount) {
      throw new Error('Chưa đăng nhập tài khoản Google. Vui lòng bấm Kết nối Google trước.');
    }
    if (this.currentAccount.expiresAt <= Date.now() || !this.currentAccount.accessToken) {
      // Need re-auth
      const renewed = await this.signIn();
      return renewed.accessToken;
    }
    return this.currentAccount.accessToken;
  }

  // ==========================================
  // GOOGLE DRIVE OPERATIONS
  // ==========================================

  // Get or Create App Folder in Google Drive
  async getOrCreateAppFolder(folderName: string = 'Tiếng Việt 1 - Âm Thanh & Dữ Liệu Học Sinh'): Promise<{ folderId: string; folderUrl: string }> {
    const token = await this.getValidAccessToken();

    // Check if folder exists
    const query = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`);
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        const folder = data.files[0];
        const folderUrl = folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`;
        this.driveStatus = {
          ...this.driveStatus,
          folderId: folder.id,
          folderUrl,
          status: 'synced'
        };
        localStorage.setItem(STORAGE_KEY_DRIVE, JSON.stringify(this.driveStatus));
        this.notify();
        return { folderId: folder.id, folderUrl };
      }
    }

    // Create new folder
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Thư mục lưu trữ bài thu âm giọng đọc và dữ liệu học tập Tiếng Việt Lớp 1'
      })
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(`Không thể tạo thư mục trên Google Drive: ${err.error?.message || 'Lỗi không xác định'}`);
    }

    const newFolder = await createRes.json();
    const folderUrl = newFolder.webViewLink || `https://drive.google.com/drive/folders/${newFolder.id}`;

    this.driveStatus = {
      folderId: newFolder.id,
      folderUrl,
      lastSyncedAt: new Date().toISOString(),
      status: 'synced'
    };
    localStorage.setItem(STORAGE_KEY_DRIVE, JSON.stringify(this.driveStatus));
    this.notify();

    return { folderId: newFolder.id, folderUrl };
  }

  // Upload a single audio recording Blob to Google Drive
  async uploadAudioToDrive(
    recording: StudentRecording,
    audioBlob: Blob,
    studentName: string = 'Học sinh'
  ): Promise<{ fileId: string; webViewLink: string }> {
    const token = await this.getValidAccessToken();
    const { folderId } = await this.getOrCreateAppFolder();

    const fileName = `[Tiếng Việt 1] ${studentName} - ${recording.lessonTitle} - ${recording.targetText.substring(0, 20)}.webm`;

    const metadata = {
      name: fileName,
      parents: [folderId],
      mimeType: recording.mimeType || 'audio/webm',
      description: `Bản thu âm của học sinh ${studentName} cho bài: ${recording.lessonTitle} (${recording.targetText})`
    };

    // Multipart upload
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
    const mediaHeader = `${delimiter}Content-Type: ${metadata.mimeType}\r\n\r\n`;

    const metadataBlob = new Blob([metadataPart]);
    const mediaHeaderBlob = new Blob([mediaHeader]);
    const closeBlob = new Blob([closeDelimiter]);

    const multipartBlob = new Blob([metadataBlob, mediaHeaderBlob, audioBlob, closeBlob]);

    const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartBlob
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      throw new Error(`Tải file âm thanh lên Drive thất bại: ${err.error?.message || 'Lỗi Drive API'}`);
    }

    const fileData = await uploadRes.json();
    return {
      fileId: fileData.id,
      webViewLink: fileData.webViewLink || `https://drive.google.com/file/d/${fileData.id}/view`
    };
  }

  // ==========================================
  // GOOGLE SHEETS OPERATIONS
  // ==========================================

  // Get or Create Spreadsheet for Class Data
  async getOrCreateSpreadsheet(title: string = '📘 Tiếng Việt 1 - Bảng Điểm & Báo Cáo Học Tập'): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
    const token = await this.getValidAccessToken();

    // If we already have a spreadsheet ID saved, verify it exists
    if (this.sheetsStatus.spreadsheetId) {
      const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.sheetsStatus.spreadsheetId}?fields=spreadsheetId,spreadsheetUrl`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (checkRes.ok) {
        const data = await checkRes.json();
        return {
          spreadsheetId: data.spreadsheetId,
          spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`
        };
      }
    }

    // Search Drive for existing spreadsheet
    const query = encodeURIComponent(`mimeType='application/vnd.google-apps.spreadsheet' and name='${title}' and trashed=false`);
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        const file = data.files[0];
        const spreadsheetUrl = file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`;
        this.sheetsStatus = {
          ...this.sheetsStatus,
          spreadsheetId: file.id,
          spreadsheetUrl,
          status: 'synced'
        };
        localStorage.setItem(STORAGE_KEY_SHEET, JSON.stringify(this.sheetsStatus));
        this.notify();
        return { spreadsheetId: file.id, spreadsheetUrl };
      }
    }

    // Create new Google Spreadsheet with 2 Sheets: "Bảng Điểm Học Sinh" and "Nhật Ký Đọc & Thu Âm"
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title
        },
        sheets: [
          {
            properties: {
              title: 'Bảng Điểm Học Sinh',
              gridProperties: { rowCount: 100, columnCount: 12, frozenRowCount: 1 }
            }
          },
          {
            properties: {
              title: 'Nhật Ký Đọc & Thu Âm',
              gridProperties: { rowCount: 200, columnCount: 10, frozenRowCount: 1 }
            }
          }
        ]
      })
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(`Không thể tạo Google Sheet: ${err.error?.message || 'Lỗi Sheets API'}`);
    }

    const created = await createRes.json();
    const spreadsheetUrl = created.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${created.spreadsheetId}/edit`;

    this.sheetsStatus = {
      spreadsheetId: created.spreadsheetId,
      spreadsheetUrl,
      lastSyncedAt: new Date().toISOString(),
      status: 'synced'
    };
    localStorage.setItem(STORAGE_KEY_SHEET, JSON.stringify(this.sheetsStatus));
    this.notify();

    return { spreadsheetId: created.spreadsheetId, spreadsheetUrl };
  }

  // Full Sync of Student Profiles & Analytics to Google Sheets
  async syncProfilesToSheet(profiles: AppUserProfile[], recordings: StudentRecording[] = []): Promise<{ spreadsheetUrl: string; totalSynced: number }> {
    this.sheetsStatus.status = 'syncing';
    this.notify();

    try {
      const token = await this.getValidAccessToken();
      const { spreadsheetId, spreadsheetUrl } = await this.getOrCreateSpreadsheet();

      // 1. Prepare Data for "Bảng Điểm Học Sinh" tab
      const studentProfiles = profiles.filter(p => p.role === 'student');
      const headerRow1 = [
        'STT',
        'Mã Học Sinh',
        'Họ Và Tên Học Sinh',
        'Lớp Học',
        'Biểu Tượng Avatar',
        'Số Sao Tích Lũy ⭐',
        'Số Bài Học Hoàn Thành 📖',
        'Số Bài Đã Thu Âm 🎙️',
        'Danh Hiệu Đạt Được 🏆',
        'Tiến Độ Hoàn Thành (% SGK)',
        'Ngày Cập Nhật Mới Nhất',
        'Đánh Giá / Lời Nhận Xét'
      ];

      const studentRows = studentProfiles.map((student, index) => {
        const totalSGKLessons = 70; // Approximation for Vol 1 + 2
        const progressPercent = Math.min(100, Math.round((student.completedLessonKeys.length / totalSGKLessons) * 100));
        const rating = progressPercent >= 50 ? 'Xuất sắc ⭐⭐⭐' : progressPercent >= 25 ? 'Tiến bộ tốt ⭐⭐' : 'Đang rèn luyện ⭐';

        return [
          index + 1,
          student.studentCode || `HS0${index + 1}`,
          student.name,
          student.classroom || 'Lớp 1A',
          student.avatar || '🐰',
          student.starsCount || 0,
          student.completedLessonKeys.length,
          student.totalRecordingsCount || 0,
          (student.unlockedBadgeIds || []).join(', '),
          `${progressPercent}%`,
          new Date(student.lastActiveAt || Date.now()).toLocaleDateString('vi-VN') + ' ' + new Date(student.lastActiveAt || Date.now()).toLocaleTimeString('vi-VN'),
          rating
        ];
      });

      // Clear and update Sheet 1
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Bảng Điểm Học Sinh'!A1:Z100:clear`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Bảng Điểm Học Sinh'!A1?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: "'Bảng Điểm Học Sinh'!A1",
          majorDimension: 'ROWS',
          values: [headerRow1, ...studentRows]
        })
      });

      // 2. Prepare Data for "Nhật Ký Đọc & Thu Âm" tab
      if (recordings.length > 0) {
        const headerRow2 = [
          'STT',
          'Thời Gian Ghi Âm',
          'Tập SGK',
          'Bài Học',
          'Phần Luyện Đọc',
          'Nội Dung Bé Đã Đọc',
          'Thời Lượng (giây)',
          'Đánh Giá Âm Thanh',
          'Ghi Chú Của Giáo Viên'
        ];

        const recRows = recordings.slice(0, 100).map((rec, idx) => [
          idx + 1,
          new Date(rec.createdAt).toLocaleDateString('vi-VN') + ' ' + new Date(rec.createdAt).toLocaleTimeString('vi-VN'),
          rec.volume === 'vol1' ? 'Tập 1 (Âm Vần)' : 'Tập 2 (Đọc Hiểu)',
          rec.lessonTitle,
          rec.sectionTitle || 'Luyện đọc',
          rec.targetText,
          `${rec.durationSeconds}s`,
          rec.feedback?.fluencyRating === 'excellent' ? '🌟 Xuất sắc (To, rõ ràng)' : rec.feedback?.fluencyRating === 'great' ? '⭐ Rất tốt' : '👍 Đọc tốt',
          rec.teacherComment || rec.feedback?.cheeringMessage || 'Bé đọc to, tròn vành rõ chữ.'
        ]);

        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Nhật Ký Đọc & Thu Âm'!A1:Z200:clear`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });

        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Nhật Ký Đọc & Thu Âm'!A1?valueInputOption=USER_ENTERED`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            range: "'Nhật Ký Đọc & Thu Âm'!A1",
            majorDimension: 'ROWS',
            values: [headerRow2, ...recRows]
          })
        });
      }

      this.sheetsStatus = {
        spreadsheetId,
        spreadsheetUrl,
        lastSyncedAt: new Date().toISOString(),
        totalRowsSynced: studentProfiles.length,
        status: 'synced'
      };
      localStorage.setItem(STORAGE_KEY_SHEET, JSON.stringify(this.sheetsStatus));
      this.notify();

      return { spreadsheetUrl, totalSynced: studentProfiles.length };
    } catch (err: any) {
      this.sheetsStatus = {
        ...this.sheetsStatus,
        status: 'error',
        errorMessage: err.message || 'Lỗi đồng bộ Google Sheets'
      };
      this.notify();
      throw err;
    }
  }

  // ==========================================
  // GOOGLE CLASSROOM OPERATIONS
  // ==========================================

  // List all active Google Classroom courses
  async listClassroomCourses(): Promise<GoogleClassroomCourse[]> {
    const token = await this.getValidAccessToken();

    const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Không thể lấy danh sách lớp Google Classroom: ${err.error?.message || 'Lỗi Classroom API'}`);
    }

    const data = await res.json();
    return (data.courses || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      section: c.section,
      descriptionHeading: c.descriptionHeading,
      room: c.room,
      alternateLink: c.alternateLink
    }));
  }

  // Create Assignment (Giao bài tập đọc về nhà trên Google Classroom)
  async createClassroomAssignment(
    courseId: string,
    lessonTitle: string,
    instructions: string,
    materialsLink?: string
  ): Promise<GoogleClassroomAssignment> {
    const token = await this.getValidAccessToken();

    const assignmentPayload: any = {
      title: `[Tiếng Việt 1] Bài tập: ${lessonTitle}`,
      description: instructions,
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
      maxPoints: 100
    };

    if (materialsLink) {
      assignmentPayload.materials = [
        {
          link: {
            url: materialsLink,
            title: `Mở ứng dụng học Tiếng Việt 1 - ${lessonTitle}`
          }
        }
      ];
    }

    const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assignmentPayload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Giao bài lên Google Classroom thất bại: ${err.error?.message || 'Lỗi Classroom API'}`);
    }

    const created = await res.json();
    return {
      id: created.id,
      courseId,
      title: created.title,
      description: created.description,
      state: created.state,
      alternateLink: created.alternateLink,
      maxPoints: created.maxPoints
    };
  }
}

export const googleWorkspaceService = new GoogleWorkspaceService();
