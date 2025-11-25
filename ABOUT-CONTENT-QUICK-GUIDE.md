# About Content Management - Quick Guide

## For Admins

### How to Edit About Page Content

1. **Navigate to Admin About Page**
   ```
   Login as Admin → Click "About Us" in navigation
   ```

2. **Enter Edit Mode**
   ```
   Click "Edit Content" button (top right)
   ```

3. **Edit Fields**
   - **Page Title**: Main heading (e.g., "About CapSort")
   - **Subtitle**: Subheading (e.g., "Capstone Archiving and Sorting System")
   - **Mission Statement**: Long description (textarea)
   - **Contact Email**: Email address (validated)

4. **Save Changes**
   ```
   Click "Save Changes" button (green)
   ```

5. **Or Cancel**
   ```
   Click "Cancel" button to discard changes
   ```

### What Happens After Saving?
- ✅ Content saved to database
- ✅ Success notification appears
- ✅ Changes immediately visible on all About pages
- ✅ Guest and Student users see updated content

---

## For Developers

### API Endpoints

**Get About Content (Public)**
```bash
GET /api/about
```

**Update About Content (Admin Only)**
```bash
PUT /api/about
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "About CapSort",
  "subtitle": "Capstone Archiving and Sorting System",
  "mission": "CapSort is designed to...",
  "contactEmail": "capsort@ustp.edu.ph"
}
```

### Frontend Implementation

**Fetch Content (Public Pages)**
```typescript
const [content, setContent] = useState({
  title: 'About CapSort',
  subtitle: 'Capstone Archiving and Sorting System',
  mission: '...',
  contactEmail: 'capsort@ustp.edu.ph'
});

useEffect(() => {
  const fetchContent = async () => {
    const response = await api.get<{ content: AboutContent }>('/about');
    if (response.data?.content) {
      setContent(response.data.content);
    }
  };
  fetchContent();
}, []);
```

**Update Content (Admin Page)**
```typescript
const handleSave = async () => {
  const response = await api.put('/about', content);
  if (response.data?.content) {
    toast.success('About content updated successfully');
  }
};
```

---

## Testing

### Run Backend Tests
```bash
cd backend
node scripts/test-about-content.js
```

### Expected Results
- ✅ Public endpoint working
- ✅ Admin authentication working
- ✅ Content update working
- ✅ Updates visible on public endpoint
- ✅ Email validation working

---

## Content Sections

### Editable (Admin Can Change)
✅ Page Title
✅ Subtitle
✅ Mission Statement
✅ Contact Email

### Static (Requires Code Changes)
❌ Features section
❌ Team section
❌ Contact section layout

---

## Quick Reference

| Action | Page | Button/Method |
|--------|------|---------------|
| View content | `/admin/about` | Default view |
| Edit content | `/admin/about` | Click "Edit Content" |
| Save changes | `/admin/about` | Click "Save Changes" |
| Cancel editing | `/admin/about` | Click "Cancel" |
| View public | `/about` or `/student/about` | Auto-loads content |

---

## Status
🟢 **LIVE** - Content management system is fully operational
