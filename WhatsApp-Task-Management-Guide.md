# Hướng Dẫn Triển Khai Hệ Thống Quản Lý Báo Cáo và Giao Task 2 Chiều qua WhatsApp

## 📋 Tổng Quan Dự Án

### Mục Tiêu
Xây dựng hệ thống automation hoàn chỉnh cho việc quản lý báo cáo và giao task 2 chiều giữa nhân viên và quản lý thông qua WhatsApp, sử dụng n8n làm nền tảng automation chính.

### Phạm Vi Dự Án
- **Luồng 1**: Nhân viên → Admin/Boss (Gửi báo cáo)
- **Luồng 2**: Admin/Boss → Nhân viên (Giao task)
- **Tích hợp AI**: Tự động tóm tắt báo cáo
- **Lưu trữ**: Google Sheets hoặc Database
- **Đa phương tiện**: Hỗ trợ text, PDF, voice, hình ảnh

### Lợi Ích
- ✅ Tự động hóa quy trình báo cáo và giao task
- ✅ Tập trung quản lý thông tin từ nhiều nhân viên
- ✅ Tích hợp AI để tóm tắt thông minh
- ✅ Hỗ trợ đa phương tiện và hẹn giờ gửi
- ✅ Giao diện quen thuộc qua WhatsApp

## 🏗️ Kiến Trúc Hệ Thống

### Sơ Đồ Luồng Dữ Liệu

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Nhân Viên     │───▶│   WhatsApp   │───▶│   n8n Workflow │
│  (Báo cáo)      │    │   Business   │    │   (Xử lý)       │
└─────────────────┘    │     API      │    └─────────────────┘
                       └──────────────┘             │
                              ▲                     ▼
┌─────────────────┐           │            ┌─────────────────┐
│  Admin/Boss     │◀──────────┘            │  Google Sheets  │
│  (Nhận tóm tắt) │                        │   /Database     │
└─────────────────┘                        └─────────────────┘
        │                                           ▲
        ▼                                           │
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│  Admin/Boss     │───▶│   WhatsApp   │───▶│   n8n Workflow │
│  (Giao task)    │    │   Business   │    │   (Phân phối)   │
└─────────────────┘    │     API      │    └─────────────────┘
                       └──────────────┘             │
                              ▲                     ▼
┌─────────────────┐           │            ┌─────────────────┐
│   Nhân Viên     │◀──────────┘            │   AI Service    │
│  (Nhận task)    │                        │  (Tóm tắt)      │
└─────────────────┘                        └─────────────────┘
```

### Thành Phần Chính

1. **WhatsApp Business API**: Giao tiếp với người dùng
2. **n8n Workflows**: Logic xử lý và automation
3. **Google Sheets**: Lưu trữ dữ liệu đơn giản
4. **AI Service**: Tóm tắt báo cáo (GPT/Gemini)
5. **File Storage**: Lưu trữ media files

## 🔧 Yêu Cầu Kỹ Thuật

### Stack Công Nghệ Đã Chọn

#### 1. WhatsApp Business API - Meta Official API
**Lý do chọn**: Miễn phí, chính thức từ Meta, tích hợp tốt với n8n
- **API Version**: Graph API v18.0 trở lên
- **Webhook Support**: Có hỗ trợ real-time webhooks
- **Message Types**: Text, Media (Image, Audio, Document), Templates
- **Rate Limits**: 1000 messages/24h (tier miễn phí), có thể nâng cấp

**Yêu cầu setup Meta WhatsApp Business API**:
```
✅ Facebook Business Account (đã verified)
✅ WhatsApp Business Account
✅ Facebook App với WhatsApp Business Product
✅ Phone Number đã verify (có thể dùng số test)
✅ Webhook URL có SSL certificate
```

#### 2. n8n Platform - Instance Có Sẵn
**Instance URL**: https://n8n.phuongndam.site/
- **Version**: n8n v1.0+ (hỗ trợ WhatsApp nodes)
- **Authentication**: Đã setup sẵn
- **Webhook Base URL**: `https://n8n.phuongndam.site/webhook/`
- **Available Nodes**: WhatsApp Trigger, WhatsApp, Google Sheets, LangChain

**Lưu ý quan trọng**:
- Instance đã có sẵn các node cần thiết
- Không cần setup server riêng
- Webhook URLs sẽ có format: `https://n8n.phuongndam.site/webhook/whatsapp-reports`

#### 3. Storage Solutions - Google Workspace
**Primary Storage**: Google Sheets API
- **Lý do chọn**: Miễn phí, dễ setup, UI thân thiện cho non-tech users
- **Limitations**: 10M cells/sheet, 2M cells/day quota
- **Upgrade path**: Có thể migrate sang database sau này

**File Storage**: Google Drive API
- **Lý do chọn**: Tích hợp tốt với Sheets, 15GB miễn phí
- **Media Types**: Images, Audio, Documents từ WhatsApp
- **Access Control**: Share permissions cho team

#### 4. AI Services - Google Gemini API
**Model**: Gemini 1.5 Flash (khuyến nghị cho production)
- **Lý do chọn**: Miễn phí tier 15 requests/minute, chi phí thấp khi scale
- **Use Cases**: Tóm tắt báo cáo, phân loại nội dung, extract insights
- **Input Limits**: 1M tokens/request (đủ cho hầu hết báo cáo)
- **Languages**: Hỗ trợ tiếng Việt tốt

**Alternative Models**:
- **Gemini 1.5 Pro**: Cho tasks phức tạp hơn (có phí)
- **Gemini 1.0 Pro**: Backup option nếu Flash không khả dụng

### Dependencies và Credentials Chi Tiết

#### Required Credentials
```json
{
  "meta_whatsapp_business": {
    "access_token": "Permanent Access Token từ Facebook App",
    "phone_number_id": "ID của số WhatsApp Business",
    "app_id": "Facebook App ID",
    "app_secret": "Facebook App Secret",
    "verify_token": "Custom token để verify webhook"
  },
  "google_workspace": {
    "service_account_json": "Service Account credentials file",
    "sheets_scope": "https://www.googleapis.com/auth/spreadsheets",
    "drive_scope": "https://www.googleapis.com/auth/drive.file"
  },
  "google_ai": {
    "api_key": "Google AI Studio API Key",
    "project_id": "Google Cloud Project ID (optional)"
  }
}
```

#### n8n Nodes Required (Đã có sẵn trên instance)
```json
{
  "core_nodes": [
    "n8n-nodes-base.whatsAppTrigger",
    "n8n-nodes-base.whatsApp",
    "n8n-nodes-base.googleSheets",
    "n8n-nodes-base.googleDrive",
    "n8n-nodes-base.httpRequest",
    "n8n-nodes-base.code",
    "n8n-nodes-base.if",
    "n8n-nodes-base.schedule"
  ],
  "langchain_nodes": [
    "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
    "@n8n/n8n-nodes-langchain.chatTrigger"
  ]
}
```

#### Environment Variables (Cho n8n instance)
```bash
# WhatsApp Configuration
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
WHATSAPP_WEBHOOK_URL=https://n8n.phuongndam.site/webhook/whatsapp-main

# Google Configuration
GOOGLE_SHEETS_ID=your_google_sheets_id
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# Admin Configuration
ADMIN_PHONE_NUMBER=84xxxxxxxxx
EMPLOYEE_PHONE_NUMBERS=84xxxxxxxxx,84yyyyyyyyy,84zzzzzzzzz
```

#### API Quotas và Limitations
```json
{
  "whatsapp_business_api": {
    "free_tier": "1000 conversations/month",
    "rate_limit": "80 messages/second",
    "webhook_timeout": "20 seconds"
  },
  "google_sheets_api": {
    "read_requests": "100 requests/100 seconds/user",
    "write_requests": "100 requests/100 seconds/user",
    "daily_quota": "Unlimited (với service account)"
  },
  "google_drive_api": {
    "requests_per_day": "1 billion",
    "requests_per_100_seconds": "1000",
    "storage_limit": "15GB (miễn phí)"
  },
  "gemini_api": {
    "free_tier": "15 requests/minute",
    "paid_tier": "1000 requests/minute",
    "input_limit": "1M tokens/request"
  }
}
```

## 🚀 Hướng Dẫn Setup Từng Bước

### Bước 1: Cấu Hình Meta WhatsApp Business API

#### 1.1. Tạo Facebook Business Account và App

**Bước 1**: Tạo Facebook Business Account
```bash
# Truy cập: https://business.facebook.com/
# Tạo Business Account mới hoặc sử dụng có sẵn
# Verify business account (cần thông tin doanh nghiệp)
```

**Bước 2**: Tạo Facebook App
```bash
# Truy cập: https://developers.facebook.com/apps/
# Chọn "Create App" → "Business" → "WhatsApp"
# App Name: "WhatsApp Task Management"
# Business Account: Chọn account đã tạo ở bước 1
```

**Bước 3**: Thêm WhatsApp Business Product
```bash
# Trong App Dashboard → Add Product → WhatsApp Business
# Chọn "Set up" để bắt đầu cấu hình
```

#### 1.2. Cấu Hình Phone Number và Permissions

**Bước 1**: Add Phone Number
```bash
# WhatsApp → Getting Started → Add phone number
# Chọn "Use a test number" (cho development)
# Hoặc "Add your own number" (cho production)
```

**Bước 2**: Lấy Credentials
```json
{
  "app_id": "Lấy từ App Dashboard → Settings → Basic",
  "app_secret": "Lấy từ App Dashboard → Settings → Basic",
  "phone_number_id": "Lấy từ WhatsApp → Getting Started",
  "access_token": "Lấy từ WhatsApp → Getting Started → Temporary token"
}
```

**Bước 3**: Tạo Permanent Access Token
```bash
# Truy cập: Graph API Explorer
# GET /me/accounts với User Access Token
# Lấy Page Access Token từ response
# Convert sang Permanent Token:

curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token" \
  -d "grant_type=fb_exchange_token" \
  -d "client_id=YOUR_APP_ID" \
  -d "client_secret=YOUR_APP_SECRET" \
  -d "fb_exchange_token=YOUR_PAGE_ACCESS_TOKEN"
```

#### 1.3. Cấu Hình Webhook

**Bước 1**: Setup Webhook URL
```bash
# Webhook URL: https://n8n.phuongndam.site/webhook/whatsapp-main
# Verify Token: tạo random string, ví dụ: "whatsapp_verify_2025"
```

**Bước 2**: Configure Webhook trong Facebook App
```bash
# WhatsApp → Configuration → Webhook
# Callback URL: https://n8n.phuongndam.site/webhook/whatsapp-main
# Verify Token: whatsapp_verify_2025
# Webhook Fields: messages, message_deliveries, message_reads
```

**Bước 3**: Test Webhook Connection
```bash
curl -X POST "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "84xxxxxxxxx",
    "type": "text",
    "text": {"body": "Test message from n8n setup"}
  }'
```

#### 1.4. Verify Setup
```json
{
  "checklist": [
    "✅ Facebook Business Account verified",
    "✅ Facebook App created with WhatsApp Product",
    "✅ Phone number added and verified",
    "✅ Permanent Access Token generated",
    "✅ Webhook configured và test thành công",
    "✅ Test message gửi/nhận thành công"
  ]
}
```

### Bước 2: Thiết Lập n8n Workflows trên Instance

#### 2.1. Truy Cập n8n Instance

**URL**: https://n8n.phuongndam.site/
```bash
# Login vào n8n instance
# Kiểm tra các node có sẵn:
# - WhatsApp Trigger ✅
# - WhatsApp ✅
# - Google Sheets ✅
# - Google Gemini LangChain ✅
```

#### 2.2. Tạo Credentials trong n8n

**WhatsApp Business API Credential**:
```json
{
  "credential_name": "Meta WhatsApp Business",
  "credential_type": "whatsAppTriggerApi",
  "data": {
    "accessToken": "YOUR_PERMANENT_ACCESS_TOKEN",
    "phoneNumberId": "YOUR_PHONE_NUMBER_ID",
    "appSecret": "YOUR_APP_SECRET",
    "verifyToken": "whatsapp_verify_2025"
  }
}
```

**Google Sheets Credential**:
```json
{
  "credential_name": "Google Sheets Service Account",
  "credential_type": "googleSheetsOAuth2Api",
  "data": {
    "serviceAccountEmail": "your-service-account@project.iam.gserviceaccount.com",
    "privateKey": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
  }
}
```

**Google Gemini Credential**:
```json
{
  "credential_name": "Google Gemini AI",
  "credential_type": "googlePalmApi",
  "data": {
    "apiKey": "YOUR_GEMINI_API_KEY"
  }
}
```

#### 2.3. Workflow Templates cho n8n Instance

**Workflow 1: WhatsApp Report Processor**
```json
{
  "name": "WhatsApp Report Processor",
  "active": true,
  "nodes": [
    {
      "name": "WhatsApp Trigger",
      "type": "n8n-nodes-base.whatsAppTrigger",
      "webhookId": "whatsapp-main",
      "parameters": {
        "updates": ["messages"],
        "options": {
          "includeMetadata": true
        }
      },
      "credentials": {
        "whatsAppTriggerApi": {
          "name": "Meta WhatsApp Business"
        }
      }
    },
    {
      "name": "Filter Employee Messages",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.from }}",
              "operation": "isContainedIn",
              "value2": "84901234567,84907654321,84912345678"
            }
          ]
        }
      }
    }
  ]
}
```

**Workflow 2: Task Distribution System**
```json
{
  "name": "Task Distribution System",
  "active": true,
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.schedule",
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * 1-5"
            }
          ]
        }
      }
    },
    {
      "name": "Get Tasks from Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "parameters": {
        "operation": "read",
        "sheetId": "YOUR_GOOGLE_SHEETS_ID",
        "range": "Tasks!A:E",
        "options": {
          "headerRow": true
        }
      },
      "credentials": {
        "googleSheetsOAuth2Api": {
          "name": "Google Sheets Service Account"
        }
      }
    }
  ]
}
```

### Bước 3: Kết Nối Database/Storage

#### Cấu hình Google Sheets

1. **Tạo Google Service Account**
   ```bash
   # Tạo service account tại Google Cloud Console
   # Download JSON credentials file
   ```

2. **Cấu trúc Sheet "Reports"**
   ```
   | A: Timestamp | B: Employee_ID | C: Message | D: Media_URL | E: AI_Summary |
   |--------------|----------------|------------|--------------|---------------|
   | 2025-01-20   | EMP001        | Báo cáo... | drive.com... | Tóm tắt...   |
   ```

3. **Cấu trúc Sheet "Tasks"**
   ```
   | A: Task_ID | B: Employee_ID | C: Task_Content | D: Due_Date | E: Status |
   |------------|----------------|-----------------|-------------|-----------|
   | TSK001     | EMP001        | Hoàn thành...   | 2025-01-25  | Pending   |
   ```

#### Cấu hình Google Drive (Lưu Media)

```javascript
// n8n Code node - Upload to Drive
const fs = require('fs');
const { google } = require('googleapis');

// Upload file logic
const uploadFile = async (fileBuffer, fileName) => {
  const drive = google.drive({ version: 'v3', auth });
  
  const fileMetadata = {
    name: fileName,
    parents: ['your_folder_id']
  };
  
  const media = {
    mimeType: 'application/octet-stream',
    body: fileBuffer
  };
  
  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  });
  
  return `https://drive.google.com/file/d/${file.data.id}/view`;
};
```

### Bước 4: Cấu Hình Authentication

#### Google Sheets Credentials

1. **Tạo Service Account**
   - Google Cloud Console → IAM & Admin → Service Accounts
   - Tạo key JSON và download

2. **Chia sẻ Sheet**
   - Share Google Sheet với email service account
   - Cấp quyền Editor

#### WhatsApp API Credentials

```json
{
  "credential_type": "whatsAppTriggerApi",
  "name": "WhatsApp OAuth account",
  "data": {
    "accessToken": "your_access_token",
    "phoneNumberId": "your_phone_number_id"
  }
}
```

## 💻 Chi Tiết Implementation

### Workflow 1: Xử Lý Báo Cáo Nhân Viên

#### Node 1: WhatsApp Trigger
```json
{
  "name": "WhatsApp Report Trigger",
  "type": "n8n-nodes-base.whatsAppTrigger",
  "parameters": {
    "updates": ["messages"],
    "options": {
      "includeMetadata": true
    }
  }
}
```

#### Node 2: Phân Loại Tin Nhắn
```javascript
// Code Node - Message Classification
const message = $input.first().json;
const employeeList = ['84901234567', '84907654321']; // Danh sách SĐT nhân viên

// Kiểm tra người gửi có phải nhân viên
if (!employeeList.includes(message.from)) {
  return []; // Không xử lý nếu không phải nhân viên
}

// Phân loại loại tin nhắn
let messageType = 'text';
let content = message.text?.body || '';
let mediaUrl = '';

if (message.image) {
  messageType = 'image';
  mediaUrl = message.image.id;
} else if (message.audio) {
  messageType = 'audio'; 
  mediaUrl = message.audio.id;
} else if (message.document) {
  messageType = 'document';
  mediaUrl = message.document.id;
}

return [{
  json: {
    employee_id: message.from,
    message_type: messageType,
    content: content,
    media_id: mediaUrl,
    timestamp: new Date().toISOString(),
    message_id: message.id
  }
}];
```

#### Node 3: Xử Lý Media Files
```javascript
// Code Node - Media Processing
const data = $input.first().json;

if (data.media_id) {
  // Lấy URL media từ WhatsApp API
  const mediaResponse = await this.helpers.httpRequest({
    method: 'GET',
    url: `https://graph.facebook.com/v17.0/${data.media_id}`,
    headers: {
      'Authorization': `Bearer ${$credentials.whatsAppTriggerApi.accessToken}`
    }
  });

  // Download file
  const fileResponse = await this.helpers.httpRequest({
    method: 'GET',
    url: mediaResponse.url,
    headers: {
      'Authorization': `Bearer ${$credentials.whatsAppTriggerApi.accessToken}`
    },
    encoding: 'arraybuffer'
  });

  return [{
    json: {
      ...data,
      media_url: mediaResponse.url,
      file_buffer: fileResponse
    }
  }];
}

return [{ json: data }];
```

#### Node 4: Lưu vào Google Sheets
```json
{
  "name": "Save to Reports Sheet",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "append",
    "sheetId": "your_sheet_id",
    "range": "Reports!A:F",
    "options": {
      "valueInputOption": "USER_ENTERED"
    },
    "values": {
      "values": [
        [
          "={{ $json.timestamp }}",
          "={{ $json.employee_id }}",
          "={{ $json.content }}",
          "={{ $json.media_url || '' }}",
          "={{ $json.message_type }}",
          "Pending AI Summary"
        ]
      ]
    }
  }
}
```

#### Node 5: AI Tóm Tắt với Google Gemini
```json
{
  "name": "Gemini AI Summary Generator",
  "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
  "parameters": {
    "model": "gemini-1.5-flash",
    "options": {
      "temperature": 0.2,
      "maxTokens": 200
    },
    "messages": {
      "values": [
        {
          "content": "=Bạn là trợ lý AI chuyên tóm tắt báo cáo công việc. Hãy tóm tắt báo cáo sau đây thành 2-3 câu ngắn gọn, tập trung vào:\n1. Công việc đã hoàn thành\n2. Vấn đề gặp phải (nếu có)\n3. Kế hoạch tiếp theo (nếu có)\n\nBáo cáo: {{ $json.content }}\n\nTóm tắt:",
          "role": "user"
        }
      ]
    }
  },
  "credentials": {
    "googlePalmApi": {
      "name": "Google Gemini AI"
    }
  }
}
```

#### Node 6: Cập Nhật AI Summary vào Sheets
```json
{
  "name": "Update AI Summary to Sheets",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "update",
    "sheetId": "YOUR_GOOGLE_SHEETS_ID",
    "range": "Reports!F{{ $('Save to Reports Sheet').item.json.row_number }}",
    "options": {
      "valueInputOption": "USER_ENTERED"
    },
    "values": {
      "values": [
        [
          "={{ $json.response.content }}"
        ]
      ]
    }
  },
  "credentials": {
    "googleSheetsOAuth2Api": {
      "name": "Google Sheets Service Account"
    }
  }
}
```

### Workflow 2: Gửi Task cho Nhân Viên

#### Node 1: Manual Trigger hoặc Schedule
```json
{
  "name": "Task Distribution Trigger",
  "type": "n8n-nodes-base.schedule",
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "cronExpression",
          "expression": "0 9 * * 1-5"
        }
      ]
    }
  }
}
```

#### Node 2: Lấy Danh Sách Task
```json
{
  "name": "Get Pending Tasks",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "read",
    "sheetId": "your_sheet_id",
    "range": "Tasks!A:E",
    "options": {
      "headerRow": true
    }
  }
}
```

#### Node 3: Phân Phối Task
```javascript
// Code Node - Task Distribution Logic
const tasks = $input.all();
const currentDate = new Date().toISOString().split('T')[0];

const tasksToSend = tasks.filter(task => {
  const taskData = task.json;
  return taskData.Status === 'Pending' &&
         taskData.Due_Date >= currentDate;
});

// Group tasks by employee
const tasksByEmployee = {};
tasksToSend.forEach(task => {
  const empId = task.json.Employee_ID;
  if (!tasksByEmployee[empId]) {
    tasksByEmployee[empId] = [];
  }
  tasksByEmployee[empId].push(task.json);
});

// Prepare messages for each employee
const messages = [];
Object.keys(tasksByEmployee).forEach(empId => {
  const employeeTasks = tasksByEmployee[empId];
  let messageText = `📋 *Nhiệm vụ mới cho bạn:*\n\n`;

  employeeTasks.forEach((task, index) => {
    messageText += `${index + 1}. *${task.Task_ID}*\n`;
    messageText += `   ${task.Task_Content}\n`;
    messageText += `   📅 Hạn: ${task.Due_Date}\n\n`;
  });

  messageText += `Vui lòng xác nhận đã nhận được nhiệm vụ bằng cách reply "OK ${task.Task_ID}"`;

  messages.push({
    json: {
      to: empId,
      message: messageText,
      tasks: employeeTasks
    }
  });
});

return messages;
```

#### Node 4: Gửi WhatsApp Message với Meta API
```json
{
  "name": "Send Task via WhatsApp",
  "type": "n8n-nodes-base.whatsApp",
  "parameters": {
    "resource": "message",
    "operation": "send",
    "to": "={{ $json.to }}",
    "messageType": "text",
    "message": "={{ $json.message }}",
    "options": {
      "messagingProduct": "whatsapp"
    }
  },
  "credentials": {
    "whatsAppApi": {
      "name": "Meta WhatsApp Business"
    }
  }
}
```

#### Node 5: Log Task Distribution
```json
{
  "name": "Log Task Distribution",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "append",
    "sheetId": "YOUR_GOOGLE_SHEETS_ID",
    "range": "Task_Logs!A:D",
    "options": {
      "valueInputOption": "USER_ENTERED"
    },
    "values": {
      "values": [
        [
          "={{ new Date().toISOString() }}",
          "={{ $json.to }}",
          "Task Sent",
          "={{ $json.tasks.length }} tasks distributed"
        ]
      ]
    }
  },
  "credentials": {
    "googleSheetsOAuth2Api": {
      "name": "Google Sheets Service Account"
    }
  }
}
```

### Workflow 3: Tổng Hợp Báo Cáo cho Admin

#### Node 1: Schedule Trigger (Hàng ngày)
```json
{
  "name": "Daily Report Schedule",
  "type": "n8n-nodes-base.schedule",
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "cronExpression",
          "expression": "0 18 * * 1-5"
        }
      ]
    }
  }
}
```

#### Node 2: Lấy Báo Cáo Trong Ngày
```javascript
// Code Node - Get Today's Reports
const today = new Date().toISOString().split('T')[0];

// Get reports from Google Sheets
const reports = await this.helpers.httpRequest({
  method: 'GET',
  url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Reports!A:F`,
  headers: {
    'Authorization': `Bearer ${$credentials.googleSheetsOAuth2Api.accessToken}`
  }
});

const todayReports = reports.values.filter(row => {
  return row[0] && row[0].startsWith(today);
});

return [{
  json: {
    date: today,
    total_reports: todayReports.length,
    reports: todayReports
  }
}];
```

#### Node 3: Tạo Báo Cáo Tổng Hợp
```javascript
// Code Node - Generate Summary Report
const data = $input.first().json;
const reports = data.reports;

// Group by employee
const reportsByEmployee = {};
reports.forEach(report => {
  const empId = report[1]; // Employee_ID column
  if (!reportsByEmployee[empId]) {
    reportsByEmployee[empId] = [];
  }
  reportsByEmployee[empId].push({
    time: report[0],
    content: report[2],
    type: report[4]
  });
});

// Generate summary message
let summaryMessage = `📊 *BÁO CÁO TỔNG HỢP NGÀY ${data.date}*\n\n`;
summaryMessage += `📈 Tổng số báo cáo: ${data.total_reports}\n`;
summaryMessage += `👥 Số nhân viên báo cáo: ${Object.keys(reportsByEmployee).length}\n\n`;

Object.keys(reportsByEmployee).forEach(empId => {
  const empReports = reportsByEmployee[empId];
  summaryMessage += `👤 *Nhân viên ${empId}:*\n`;
  summaryMessage += `   📝 ${empReports.length} báo cáo\n`;

  empReports.forEach((report, index) => {
    summaryMessage += `   ${index + 1}. ${report.content.substring(0, 50)}...\n`;
  });
  summaryMessage += `\n`;
});

return [{
  json: {
    summary_message: summaryMessage,
    detailed_data: reportsByEmployee
  }
}];
```

#### Node 4: Gửi cho Admin
```json
{
  "name": "Send Summary to Admin",
  "type": "n8n-nodes-base.whatsApp",
  "parameters": {
    "resource": "message",
    "operation": "send",
    "to": "84901234567", // Admin phone number
    "messageType": "text",
    "message": "={{ $json.summary_message }}",
    "options": {}
  }
}
```

## 🧪 Testing và Troubleshooting

### Test Cases Cơ Bản

#### Test 1: Nhận Báo Cáo Text với Meta API
```bash
# Test gửi tin nhắn từ số nhân viên đến WhatsApp Business
# Sử dụng Meta Graph API để test
curl -X POST "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "messaging_product": "whatsapp",
  "to": "84xxxxxxxxx",
  "type": "text",
  "text": {"body": "Báo cáo: Đã hoàn thành task A và B hôm nay. Gặp khó khăn ở task C cần hỗ trợ."}
}'

# Kiểm tra workflow hoạt động:
# 1. ✅ Webhook nhận được message trong n8n
# 2. ✅ Message được filter đúng (chỉ nhân viên)
# 3. ✅ Dữ liệu được lưu vào Google Sheets
# 4. ✅ Gemini AI tạo summary thành công
# 5. ✅ Summary được cập nhật vào Sheets
```

#### Test 2: Gửi Task cho Nhân Viên
```bash
# Test task distribution workflow
# 1. Thêm task mới vào Google Sheets:
#    Task_ID: TSK001
#    Employee_ID: 84xxxxxxxxx
#    Task_Content: Hoàn thành báo cáo tháng 1
#    Due_Date: 2025-01-25
#    Status: Pending

# 2. Trigger workflow manually hoặc đợi schedule (9AM)

# 3. Kiểm tra kết quả:
# ✅ Task được đọc từ Google Sheets
# ✅ Message được format với emoji và structure đẹp
# ✅ Nhân viên nhận được tin nhắn qua WhatsApp
# ✅ Task distribution được log vào Sheets
```

#### Test 3: Báo Cáo Tổng Hợp với Gemini AI
```bash
# Test daily summary workflow
# 1. Đảm bảo có ít nhất 2-3 báo cáo trong ngày
# 2. Trigger daily report workflow (6PM hoặc manual)

# 3. Kiểm tra kết quả:
# ✅ Dữ liệu được tổng hợp đúng theo nhân viên
# ✅ Gemini AI tạo insights từ multiple reports
# ✅ Format message professional với emoji
# ✅ Admin nhận được báo cáo chi tiết
# ✅ Summary bao gồm trends và recommendations
```

#### Test 4: Media Files Processing
```bash
# Test với file đính kèm
# 1. Gửi image/document từ WhatsApp
# 2. Kiểm tra:
# ✅ Media được download từ WhatsApp API
# ✅ File được upload lên Google Drive
# ✅ Drive URL được lưu vào Sheets
# ✅ Gemini AI có thể analyze image content (nếu cần)
```

### Xử Lý Lỗi Thường Gặp

#### Lỗi 1: Meta WhatsApp API Rate Limit
```javascript
// Retry logic cho Meta WhatsApp Business API
const maxRetries = 3;
let retryCount = 0;

while (retryCount < maxRetries) {
  try {
    const response = await this.helpers.httpRequest({
      method: 'POST',
      url: `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      body: {
        messaging_product: "whatsapp",
        to: recipientPhone,
        type: "text",
        text: { body: messageContent }
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    break; // Success
  } catch (error) {
    if (error.response?.status === 429) {
      retryCount++;
      // Meta API rate limit: wait exponentially
      const waitTime = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    } else if (error.response?.status === 401) {
      throw new Error('WhatsApp Access Token expired - need to refresh');
    } else {
      throw error;
    }
  }
}
```

#### Lỗi 2: Google Sheets Quota Exceeded
```javascript
// Batch operations để giảm API calls
const batchData = [];
reports.forEach(report => {
  batchData.push([
    report.timestamp,
    report.employee_id,
    report.content,
    report.media_url,
    report.type
  ]);
});

// Ghi một lần thay vì nhiều lần
await googleSheets.spreadsheets.values.batchUpdate({
  spreadsheetId: sheetId,
  resource: {
    valueInputOption: 'USER_ENTERED',
    data: [{
      range: 'Reports!A:E',
      values: batchData
    }]
  }
});
```

#### Lỗi 3: Meta WhatsApp Media Download Failed
```javascript
// Fallback mechanism cho Meta WhatsApp API
try {
  // Step 1: Get media URL from Meta API
  const mediaResponse = await this.helpers.httpRequest({
    method: 'GET',
    url: `https://graph.facebook.com/v18.0/${mediaId}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  // Step 2: Download actual file
  const fileBuffer = await this.helpers.httpRequest({
    method: 'GET',
    url: mediaResponse.url,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    encoding: 'arraybuffer'
  });

  // Step 3: Upload to Google Drive
  const driveUrl = await uploadToGoogleDrive(fileBuffer, fileName);
  return driveUrl;

} catch (error) {
  console.error('Meta WhatsApp media processing failed:', error);

  // Log error to Sheets for monitoring
  await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Error_Logs!A:D:append',
    headers: {
      'Authorization': `Bearer ${googleToken}`
    },
    body: {
      values: [[
        new Date().toISOString(),
        'Media Download Failed',
        mediaId,
        error.message
      ]]
    }
  });

  return 'Media không thể xử lý - vui lòng gửi lại hoặc liên hệ IT support';
}
```

#### Lỗi 4: Google Gemini API Quota Exceeded
```javascript
// Fallback cho Gemini API
try {
  const summary = await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    headers: {
      'Authorization': `Bearer ${geminiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: {
      contents: [{
        parts: [{
          text: `Tóm tắt báo cáo: ${reportContent}`
        }]
      }]
    }
  });

  return summary.candidates[0].content.parts[0].text;

} catch (error) {
  if (error.response?.status === 429) {
    // Quota exceeded - use simple text processing
    const sentences = reportContent.split('.').slice(0, 2);
    return `Tóm tắt tự động: ${sentences.join('.')}. (AI tạm thời không khả dụng)`;
  }
  throw error;
}
```

## 🔒 Best Practices

### Bảo Mật

#### 1. Credential Management
```json
{
  "security_practices": {
    "api_keys": "Lưu trong n8n credentials, không hardcode",
    "phone_numbers": "Mã hóa hoặc hash trong database",
    "webhook_verification": "Luôn verify webhook signature",
    "access_control": "Whitelist số điện thoại nhân viên"
  }
}
```

#### 2. Data Privacy
```javascript
// Mã hóa dữ liệu nhạy cảm
const crypto = require('crypto');

const encryptData = (text, key) => {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Sử dụng khi lưu thông tin nhạy cảm
const encryptedContent = encryptData(reportContent, process.env.ENCRYPTION_KEY);
```

### Performance

#### 1. Caching Strategy
```javascript
// Cache employee list để giảm API calls
const CACHE_TTL = 3600; // 1 hour
let employeeCache = null;
let cacheTimestamp = 0;

const getEmployeeList = async () => {
  const now = Date.now();
  if (employeeCache && (now - cacheTimestamp) < CACHE_TTL * 1000) {
    return employeeCache;
  }

  employeeCache = await fetchEmployeeListFromSheets();
  cacheTimestamp = now;
  return employeeCache;
};
```

#### 2. Batch Processing
```javascript
// Xử lý nhiều message cùng lúc
const processBatchMessages = async (messages) => {
  const batchSize = 10;
  const batches = [];

  for (let i = 0; i < messages.length; i += batchSize) {
    batches.push(messages.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await Promise.all(batch.map(processMessage));
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }
};
```

### Maintenance

#### 1. Monitoring và Logging
```javascript
// Thêm logging chi tiết
const logActivity = async (activity, data, status) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    activity: activity,
    data: JSON.stringify(data),
    status: status,
    workflow_id: $workflow.id
  };

  // Lưu vào monitoring sheet
  await appendToSheet('Logs', Object.values(logEntry));
};

// Sử dụng trong workflow
await logActivity('message_received', messageData, 'success');
```

#### 2. Health Checks
```javascript
// Workflow kiểm tra sức khỏe hệ thống
const healthCheck = async () => {
  const checks = {
    whatsapp_api: await testWhatsAppConnection(),
    google_sheets: await testSheetsConnection(),
    ai_service: await testAIService()
  };

  const allHealthy = Object.values(checks).every(check => check.status === 'ok');

  if (!allHealthy) {
    await sendAlertToAdmin('System health check failed', checks);
  }

  return checks;
};
```

#### 3. Backup Strategy
```javascript
// Tự động backup dữ liệu hàng ngày
const backupData = async () => {
  const timestamp = new Date().toISOString().split('T')[0];

  // Export Google Sheets data
  const reportsData = await exportSheetData('Reports');
  const tasksData = await exportSheetData('Tasks');

  // Upload to backup location
  await uploadToBackupStorage(`backup_${timestamp}_reports.json`, reportsData);
  await uploadToBackupStorage(`backup_${timestamp}_tasks.json`, tasksData);
};
```

## 📚 Tài Liệu Tham Khảo

### APIs Documentation (Stack đã chọn)
- **[Meta WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/business-management-api)** - Official documentation
- **[WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)** - Sending/receiving messages
- **[Google Sheets API v4](https://developers.google.com/sheets/api/reference/rest)** - Spreadsheet operations
- **[Google Drive API v3](https://developers.google.com/drive/api/reference/rest/v3)** - File storage
- **[Google Gemini API](https://ai.google.dev/docs)** - AI text generation
- **[n8n Documentation](https://docs.n8n.io/)** - Workflow automation

### Specific Integration Guides
- **[n8n WhatsApp Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.whatsapp/)** - Node configuration
- **[Meta App Setup](https://developers.facebook.com/docs/development/create-an-app)** - Facebook app creation
- **[Google Service Account](https://cloud.google.com/iam/docs/service-accounts)** - Authentication setup
- **[Gemini API Quickstart](https://ai.google.dev/tutorials/quickstart)** - AI integration

### Workflow Templates (Từ collection có sẵn)
```bash
# Tham khảo các workflow tương tự trong n8n_trick/
n8n_trick/00 Nguyen_13.07.2025/345/3201-whatsapp-ai-sales-agent.json
n8n_trick/00 Nguyen_13.07.2025/79/0905-whatsapp-chatbot-rag.json
n8n_trick/00 Nguyen_13.07.2025/346/3202-whatsapp-bot-process.json
n8n_trick/00 Nguyen_13.07.2025/242/2897-team-weekly-report.json
```

### Configuration Examples
```json
{
  "meta_whatsapp_setup": "https://developers.facebook.com/docs/whatsapp/business-management-api/get-started",
  "n8n_instance": "https://n8n.phuongndam.site/",
  "google_sheets_template": "Template có sẵn trong tài liệu",
  "gemini_pricing": "https://ai.google.dev/pricing"
}
```

### Support và Community
- **[n8n Community Forum](https://community.n8n.io/)** - Workflow support
- **[Meta Developer Community](https://developers.facebook.com/community/)** - WhatsApp API issues
- **[Google Cloud Support](https://cloud.google.com/support)** - Sheets/Drive API
- **[Google AI Studio](https://aistudio.google.com/)** - Gemini API management

### Troubleshooting Resources
- **Meta WhatsApp Status**: https://developers.facebook.com/status/
- **Google Workspace Status**: https://www.google.com/appsstatus/
- **n8n Instance Status**: https://n8n.phuongndam.site/healthz
- **Gemini API Limits**: https://ai.google.dev/docs/quota

---

*Tài liệu này được tạo bởi chuyên gia n8n automation với kinh nghiệm thực tế từ hàng nghìn workflow. Để được hỗ trợ thêm, vui lòng liên hệ team phát triển.*
```
