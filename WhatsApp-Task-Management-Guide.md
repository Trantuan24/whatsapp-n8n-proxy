# 🚀 Hướng Dẫn Triển Khai WhatsApp Task Management System

> **Mục đích tài liệu**: Hướng dẫn từng bước triển khai hệ thống quản lý báo cáo và giao task tự động qua WhatsApp

## 🎯 Tổng Quan Dự Án

### Hệ Thống Sẽ Làm Gì?
- **📤 Nhận báo cáo**: Nhân viên gửi báo cáo → Tự động lưu trữ + AI tóm tắt
- **📥 Giao task**: Admin tạo task → Tự động phân phối cho nhân viên
- **📊 Báo cáo tổng hợp**: Tự động tổng hợp và gửi cho admin hàng ngày
- **🤖 AI hỗ trợ**: Tóm tắt thông minh, phân loại nội dung

### Stack Công Nghệ Đã Chọn
- **WhatsApp**: Meta Business API (miễn phí)
- **Automation**: n8n instance có sẵn (https://n8n.phuongndam.site/)
- **Storage**: Google Sheets (miễn phí, dễ quản lý)
- **AI**: Google Gemini (miễn phí tier)

### Lợi Ích Chính
- ✅ **Không cần app riêng** - Dùng WhatsApp có sẵn
- ✅ **Tự động 24/7** - Không cần can thiệp thủ công
- ✅ **AI thông minh** - Tóm tắt và phân loại tự động
- ✅ **Dễ quản lý** - Tất cả dữ liệu trong Google Sheets
- ✅ **Chi phí thấp** - Chủ yếu sử dụng dịch vụ miễn phí

## 📋 Roadmap Triển Khai (4 Giai Đoạn)

> **Mục đích**: Chia nhỏ việc triển khai thành 4 giai đoạn rõ ràng, dễ theo dõi

### 🎯 Giai Đoạn 1: Setup Cơ Bản (30 phút)
**Mục đích**: Tạo kết nối WhatsApp ↔ n8n
- Setup Meta WhatsApp Business API
- Cấu hình webhook với n8n instance
- **✅ Hoàn thành khi**: Test message gửi/nhận thành công

### 🎯 Giai Đoạn 2: Storage & AI (20 phút)
**Mục đích**: Chuẩn bị nơi lưu trữ và AI
- Tạo Google Sheets với cấu trúc chuẩn
- Setup Google Gemini API
- **✅ Hoàn thành khi**: n8n đọc/ghi được Sheets + AI response

### 🎯 Giai Đoạn 3: Workflow Chính (45 phút)
**Mục đích**: Tạo workflow xử lý báo cáo nhân viên
- Workflow nhận báo cáo từ WhatsApp
- Lưu vào Sheets + AI tóm tắt
- **✅ Hoàn thành khi**: Báo cáo test được xử lý hoàn chỉnh

### 🎯 Giai Đoạn 4: Mở Rộng (30 phút)
**Mục đích**: Thêm tính năng giao task và báo cáo tổng hợp
- Workflow giao task cho nhân viên
- Báo cáo tổng hợp hàng ngày
- **✅ Hoàn thành khi**: Hệ thống hoạt động end-to-end

---

## 🏗️ Kiến Trúc Hệ Thống (Tham Khảo)

### Luồng Dữ Liệu Đơn Giản
```
Nhân viên gửi WhatsApp → n8n nhận → Lưu Sheets → AI tóm tắt → Admin nhận báo cáo
Admin tạo task trong Sheets → n8n đọc → Gửi WhatsApp → Nhân viên nhận
```

### 5 Thành Phần Chính
1. **WhatsApp Business API** - Giao tiếp với users
2. **n8n Instance** - Logic automation
3. **Google Sheets** - Lưu trữ dữ liệu
4. **Google Gemini** - AI tóm tắt
5. **Google Drive** - Lưu media files

---

# 🛠️ GIAI ĐOẠN 1: SETUP CƠ BẢN

> **Mục đích**: Tạo kết nối WhatsApp ↔ n8n để có thể gửi/nhận tin nhắn tự động

## 🔧 Yêu Cầu Trước Khi Bắt Đầu

### Cần Chuẩn Bị
```
✅ Facebook Business Account (miễn phí)
✅ Số điện thoại để làm WhatsApp Business
✅ Truy cập vào n8n instance: https://n8n.phuongndam.site/
✅ Google Account (để tạo Sheets sau)
```

### Thông Tin Stack Công Nghệ
- **WhatsApp**: Meta Business API (miễn phí, 1000 tin nhắn/tháng)
- **n8n**: Instance có sẵn với đầy đủ nodes
- **Storage**: Google Sheets (miễn phí, 10M cells)
- **AI**: Google Gemini (miễn phí, 15 requests/phút)

## 📱 Bước 1.1: Setup Meta WhatsApp Business API

**Mục đích**: Tạo Facebook App để kết nối WhatsApp với n8n

### Tạo Facebook App
```bash
1. Truy cập: https://developers.facebook.com/apps/
2. Chọn "Create App" → "Business" → "WhatsApp"
3. App Name: "Task Management Bot"
4. Business Account: Chọn account của bạn
5. Add Product: WhatsApp Business
```

### Lấy Credentials Quan Trọng
```json
{
  "phone_number_id": "Từ WhatsApp → Getting Started",
  "access_token": "Từ WhatsApp → Getting Started (Temporary)",
  "app_secret": "Từ App Settings → Basic",
  "verify_token": "Tự tạo: task_bot_2025"
}
```

**✅ Hoàn thành bước này khi**: Có đủ 4 thông tin trên

## 🔗 Bước 1.2: Cấu Hình Webhook

**Mục đích**: Cho phép WhatsApp gửi tin nhắn đến n8n tự động

### Setup Webhook URL
```bash
# Trong Facebook App → WhatsApp → Configuration → Webhook:
Callback URL: https://n8n.phuongndam.site/webhook/whatsapp-main
Verify Token: task_bot_2025
Subscribe to: messages
```

### Test Kết Nối
```bash
# Test gửi tin nhắn qua API:
curl -X POST "https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages" \
-H "Authorization: Bearer ACCESS_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "messaging_product": "whatsapp",
  "to": "84xxxxxxxxx",
  "type": "text",
  "text": {"body": "Test từ n8n setup"}
}'
```

**✅ Hoàn thành bước này khi**: Test message gửi thành công

---

# 📊 GIAI ĐOẠN 2: STORAGE & AI SETUP

> **Mục đích**: Chuẩn bị nơi lưu trữ dữ liệu và AI để tóm tắt báo cáo

## 📋 Bước 2.1: Tạo Google Sheets Storage

**Mục đích**: Tạo nơi lưu trữ báo cáo và task, dễ xem và quản lý

### Tạo Google Sheets
```bash
1. Truy cập: https://sheets.google.com/
2. Tạo sheet mới: "WhatsApp Task Management"
3. Tạo 3 tabs:
   - "Reports" (Báo cáo nhân viên)
   - "Tasks" (Task cần giao)
   - "Logs" (Log hoạt động)
```

### Cấu Trúc Dữ Liệu Chuẩn

**Tab "Reports"**:
```
A: Timestamp | B: Employee_Phone | C: Message_Content | D: AI_Summary | E: Status
2025-01-20 09:30 | 84901234567 | Báo cáo hoàn thành... | Đã hoàn thành task A,B | Processed
```

**Tab "Tasks"**:
```
A: Task_ID | B: Employee_Phone | C: Task_Content | D: Due_Date | E: Status
TSK001 | 84901234567 | Hoàn thành báo cáo tháng 1 | 2025-01-25 | Pending
```

**Tab "Logs"**:
```
A: Timestamp | B: Action | C: Details | D: Status
2025-01-20 09:30 | Message_Received | From 84901234567 | Success
```

### Setup Service Account
```bash
1. Google Cloud Console → IAM → Service Accounts
2. Create Service Account: "n8n-whatsapp-bot"
3. Generate JSON key và download
4. Share Google Sheet với service account email (Editor permission)
```

**✅ Hoàn thành bước này khi**: Service account có thể đọc/ghi sheet

## 🤖 Bước 2.2: Setup Google Gemini AI

**Mục đích**: Cấu hình AI để tóm tắt báo cáo tự động

### Lấy Gemini API Key
```bash
1. Truy cập: https://aistudio.google.com/
2. Get API Key → Create API Key
3. Copy API key (dạng: AIza...)
```

### Test AI Connection
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "contents": [{
    "parts": [{
      "text": "Tóm tắt: Hôm nay tôi đã hoàn thành task A và B, gặp khó khăn ở task C"
    }]
  }]
}'
```

**✅ Hoàn thành bước này khi**: API trả về response tóm tắt

---

# ⚙️ GIAI ĐOẠN 3: TẠO WORKFLOW CHÍNH

> **Mục đích**: Tạo workflow xử lý báo cáo nhân viên - đây là core functionality của hệ thống

## 🔧 Bước 3.1: Setup Credentials trong n8n

**Mục đích**: Cấu hình các kết nối cần thiết trong n8n

### Truy Cập n8n Instance
```bash
1. Truy cập: https://n8n.phuongndam.site/
2. Login với account được cấp
3. Kiểm tra nodes có sẵn: WhatsApp, Google Sheets, Gemini
```

### Tạo Credentials

**WhatsApp Business Credential**:
```json
{
  "name": "Meta WhatsApp Business",
  "type": "whatsAppTriggerApi",
  "data": {
    "accessToken": "YOUR_ACCESS_TOKEN",
    "phoneNumberId": "YOUR_PHONE_NUMBER_ID",
    "verifyToken": "task_bot_2025"
  }
}
```

**Google Sheets Credential**:
```json
{
  "name": "Google Sheets Service Account",
  "type": "googleSheetsOAuth2Api",
  "data": {
    "serviceAccountEmail": "n8n-whatsapp-bot@project.iam.gserviceaccount.com",
    "privateKey": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
  }
}
```

**Google Gemini Credential**:
```json
{
  "name": "Google Gemini AI",
  "type": "googlePalmApi",
  "data": {
    "apiKey": "YOUR_GEMINI_API_KEY"
  }
}
```

**✅ Hoàn thành bước này khi**: Tất cả credentials test connection thành công

## 🔄 Bước 3.2: Tạo Workflow "WhatsApp Report Handler"

**Mục đích**: Workflow chính xử lý báo cáo từ nhân viên

### Tạo Workflow Mới
```bash
1. n8n → New Workflow
2. Name: "WhatsApp Report Handler"
3. Description: "Xử lý báo cáo nhân viên từ WhatsApp"
```

### Thêm 5 Nodes Chính

**Node 1: WhatsApp Trigger**
```json
{
  "name": "Nhận tin nhắn WhatsApp",
  "type": "n8n-nodes-base.whatsAppTrigger",
  "parameters": {
    "updates": ["messages"],
    "webhookId": "whatsapp-main"
  },
  "credentials": "Meta WhatsApp Business"
}
```

**Node 2: Filter Nhân Viên**
```javascript
// Code Node - Chỉ xử lý tin nhắn từ nhân viên
const employeePhones = ['84901234567', '84907654321', '84912345678'];
const message = $input.first().json;

if (!employeePhones.includes(message.from)) {
  return []; // Bỏ qua nếu không phải nhân viên
}

return [{
  json: {
    employee_phone: message.from,
    message_content: message.text?.body || '',
    timestamp: new Date().toISOString(),
    message_id: message.id
  }
}];
```

**Node 3: Lưu vào Google Sheets**
```json
{
  "name": "Lưu báo cáo vào Sheets",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "append",
    "sheetId": "YOUR_GOOGLE_SHEETS_ID",
    "range": "Reports!A:E",
    "values": [
      [
        "={{ $json.timestamp }}",
        "={{ $json.employee_phone }}",
        "={{ $json.message_content }}",
        "Đang xử lý AI...",
        "Processing"
      ]
    ]
  },
  "credentials": "Google Sheets Service Account"
}
```

**Node 4: AI Tóm Tắt**
```json
{
  "name": "Gemini AI Tóm Tắt",
  "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
  "parameters": {
    "model": "gemini-1.5-flash",
    "messages": [
      {
        "content": "Tóm tắt báo cáo công việc sau trong 1-2 câu ngắn gọn:\n\n{{ $json.message_content }}",
        "role": "user"
      }
    ]
  },
  "credentials": "Google Gemini AI"
}
```

**Node 5: Cập Nhật AI Summary**
```json
{
  "name": "Cập nhật AI Summary",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "update",
    "sheetId": "YOUR_GOOGLE_SHEETS_ID",
    "range": "Reports!D{{ $('Node 3').item.json.row }}:E{{ $('Node 3').item.json.row }}",
    "values": [
      [
        "={{ $json.response }}",
        "Completed"
      ]
    ]
  },
  "credentials": "Google Sheets Service Account"
}
```

**✅ Hoàn thành bước này khi**: Workflow chạy thành công với test message

## 🧪 Bước 3.3: Test Workflow

**Mục đích**: Đảm bảo workflow hoạt động đúng trước khi deploy

### Test Case 1: Gửi Báo Cáo Text
```bash
# Gửi tin nhắn từ số nhân viên:
"Báo cáo: Hôm nay đã hoàn thành task A và B. Gặp khó khăn ở task C cần hỗ trợ."

# Kiểm tra kết quả:
1. ✅ Tin nhắn xuất hiện trong n8n execution log
2. ✅ Dữ liệu được lưu vào Google Sheets tab "Reports"
3. ✅ AI summary được tạo và cập nhật
4. ✅ Status chuyển từ "Processing" → "Completed"
```

### Test Case 2: Filter Nhân Viên
```bash
# Gửi tin nhắn từ số không phải nhân viên
# Kết quả mong đợi: Tin nhắn bị bỏ qua, không lưu vào Sheets
```

**✅ Hoàn thành Giai đoạn 3 khi**: Cả 2 test case đều pass

---

# 🚀 GIAI ĐOẠN 4: MỞ RỘNG TÍNH NĂNG

> **Mục đích**: Thêm workflow giao task và báo cáo tổng hợp để hoàn thiện hệ thống

## 📋 Bước 4.1: Workflow Giao Task cho Nhân Viên

**Mục đích**: Tự động gửi task từ Google Sheets đến nhân viên qua WhatsApp

### Tạo Workflow "Task Distribution"
```bash
1. n8n → New Workflow
2. Name: "Task Distribution System"
3. Description: "Gửi task cho nhân viên theo lịch"
```

### 4 Nodes Chính

**Node 1: Schedule Trigger (9AM hàng ngày)**
```json
{
  "name": "Daily Task Check",
  "type": "n8n-nodes-base.schedule",
  "parameters": {
    "rule": {
      "interval": [{"field": "cronExpression", "expression": "0 9 * * 1-5"}]
    }
  }
}
```

**Node 2: Đọc Tasks từ Sheets**
```json
{
  "name": "Get Pending Tasks",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "read",
    "sheetId": "YOUR_GOOGLE_SHEETS_ID",
    "range": "Tasks!A:E",
    "options": {"headerRow": true}
  }
}
```

**Node 3: Filter Tasks Pending**
```javascript
// Code Node - Chỉ lấy task chưa gửi
const tasks = $input.all();
const pendingTasks = tasks.filter(task =>
  task.json.Status === 'Pending' &&
  task.json.Due_Date >= new Date().toISOString().split('T')[0]
);

return pendingTasks.map(task => ({
  json: {
    employee_phone: task.json.Employee_Phone,
    task_content: `📋 *Task mới*: ${task.json.Task_Content}\n📅 Hạn: ${task.json.Due_Date}`,
    task_id: task.json.Task_ID
  }
}));
```

**Node 4: Gửi WhatsApp**
```json
{
  "name": "Send Task via WhatsApp",
  "type": "n8n-nodes-base.whatsApp",
  "parameters": {
    "resource": "message",
    "operation": "send",
    "to": "={{ $json.employee_phone }}",
    "messageType": "text",
    "message": "={{ $json.task_content }}"
  }
}
```

## 📊 Bước 4.2: Workflow Báo Cáo Tổng Hợp

**Mục đích**: Gửi báo cáo tổng hợp cho admin mỗi cuối ngày

### Tạo Workflow "Daily Summary"
```bash
1. n8n → New Workflow
2. Name: "Daily Summary Report"
3. Schedule: 6PM hàng ngày
```

### Logic Đơn Giản
```javascript
// Đọc báo cáo trong ngày → Tổng hợp theo nhân viên → Gửi cho admin
const today = new Date().toISOString().split('T')[0];
const reports = await getReportsFromSheets(today);

let summary = `📊 *Báo cáo ngày ${today}*\n\n`;
summary += `📈 Tổng: ${reports.length} báo cáo\n\n`;

// Group by employee và tạo summary
const groupedReports = groupByEmployee(reports);
Object.keys(groupedReports).forEach(emp => {
  summary += `👤 ${emp}: ${groupedReports[emp].length} báo cáo\n`;
});

return summary;
```

**✅ Hoàn thành Giai đoạn 4 khi**: Cả 2 workflow mới hoạt động ổn định

---

# 🔧 TROUBLESHOOTING & SUPPORT

## ⚠️ Lỗi Thường Gặp

### Lỗi 1: WhatsApp không nhận tin nhắn
```bash
# Nguyên nhân thường gặp:
- Webhook URL sai hoặc không accessible
- Verify token không khớp
- Phone number chưa được whitelist

# Cách fix:
1. Kiểm tra webhook URL: https://n8n.phuongndam.site/webhook/whatsapp-main
2. Verify token phải khớp với setting trong Facebook App
3. Test webhook bằng curl command
```

### Lỗi 2: Google Sheets không cập nhật
```bash
# Nguyên nhân:
- Service account không có quyền edit sheet
- Sheet ID sai
- Range format không đúng

# Cách fix:
1. Share sheet với service account email (Editor permission)
2. Kiểm tra Sheet ID trong URL
3. Range format: "Reports!A:E" (có dấu !)
```

### Lỗi 3: AI không tóm tắt
```bash
# Nguyên nhân:
- Gemini API key hết quota
- Text quá dài (>1M tokens)
- Credential setup sai

# Cách fix:
1. Kiểm tra quota tại: https://aistudio.google.com/
2. Rút ngắn prompt hoặc text input
3. Test API key bằng curl
```

## 📞 Hỗ Trợ & Tài Liệu

### Quick Commands
```bash
# Test WhatsApp API:
curl -X POST "https://graph.facebook.com/v18.0/PHONE_ID/messages" \
-H "Authorization: Bearer TOKEN" \
-d '{"messaging_product":"whatsapp","to":"84xxx","type":"text","text":{"body":"Test"}}'

# Test Google Sheets:
curl "https://sheets.googleapis.com/v4/spreadsheets/SHEET_ID/values/Reports!A1:D1" \
-H "Authorization: Bearer GOOGLE_TOKEN"

# Test Gemini AI:
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=API_KEY" \
-d '{"contents":[{"parts":[{"text":"Test"}]}]}'
```

### Tài Liệu Tham Khảo
- **[Meta WhatsApp API](https://developers.facebook.com/docs/whatsapp)** - Official docs
- **[n8n Documentation](https://docs.n8n.io/)** - Workflow automation
- **[Google Sheets API](https://developers.google.com/sheets/api)** - Spreadsheet integration
- **[Google Gemini API](https://ai.google.dev/docs)** - AI integration

### Workflow Templates Có Sẵn
```bash
# Tham khảo từ collection n8n_trick/:
- WhatsApp AI Sales Agent: n8n_trick/.../3201-whatsapp-ai-sales-agent.json
- Business WhatsApp Chatbot: n8n_trick/.../0905-whatsapp-chatbot-rag.json
```

---

## 🎯 KẾT LUẬN

**Sau khi hoàn thành 4 giai đoạn trên, bạn sẽ có:**
- ✅ Hệ thống WhatsApp automation hoạt động 24/7
- ✅ Tự động xử lý báo cáo nhân viên với AI tóm tắt
- ✅ Phân phối task tự động theo lịch
- ✅ Báo cáo tổng hợp hàng ngày cho admin
- ✅ Tất cả dữ liệu được lưu trữ trong Google Sheets dễ quản lý

**Thời gian triển khai**: ~2 giờ (nếu follow đúng hướng dẫn)
**Chi phí vận hành**: Gần như miễn phí (chỉ phí khi scale lớn)

*Tài liệu được tối ưu hóa cho triển khai nhanh và dễ hiểu. Mọi bước đều có mục đích rõ ràng và checklist hoàn thành.*

---

# 📚 PHỤ LỤC: CHI TIẾT IMPLEMENTATION

> **Mục đích**: Tham khảo chi tiết code và configuration cho các workflow (không bắt buộc đọc để triển khai)

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
