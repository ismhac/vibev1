# Users Module - Enhanced Search & Filter

This module provides comprehensive user management with advanced search and filtering capabilities.

## Features

### 🔍 **Advanced Search**
- **Multi-field search**: Search by name, email, or ID
- **Smart ID detection**: Automatically detects numeric search terms as ID searches
- **Case-insensitive**: All text searches are case-insensitive
- **Partial matching**: Supports partial text matching for names and emails

### 🎯 **Filtering Options**
- **Role filtering**: Filter users by their role (admin, editor, viewer, etc.)
- **Status filtering**: Filter by active/inactive status
- **Combined filters**: Use multiple filters simultaneously

### 📊 **Pagination**
- **Configurable page size**: Set custom limit per page
- **Page navigation**: Navigate through multiple pages
- **Total count**: Get total number of matching records

## API Endpoints

### Get Users with Search & Filter
```http
GET /api/v1/users?page=1&limit=10&search=john&role=admin&status=active
```

#### Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term (searches name, email, or ID)
- `role` (optional): Filter by role
- `status` (optional): Filter by status (`active` or `inactive`)

#### Response:
```json
{
  "data": [
    {
      "id": 1,
      "email": "john.doe@example.com",
      "fullName": "John Doe",
      "role": "admin",
      "isActive": true,
      "lastLoginAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Get Filter Options
```http
GET /api/v1/users/filters
```

#### Response:
```json
{
  "roles": ["admin", "editor", "viewer"],
  "statuses": ["active", "inactive"]
}
```

## Search Examples

### 1. Search by Name
```http
GET /api/v1/users?search=john
```
Returns users with "john" in their full name.

### 2. Search by Email
```http
GET /api/v1/users?search=@example.com
```
Returns users with "@example.com" in their email.

### 3. Search by ID
```http
GET /api/v1/users?search=123
```
Returns user with ID 123.

### 4. Filter by Role
```http
GET /api/v1/users?role=admin
```
Returns only admin users.

### 5. Filter by Status
```http
GET /api/v1/users?status=active
```
Returns only active users.

### 6. Combined Search & Filter
```http
GET /api/v1/users?search=john&role=admin&status=active
```
Returns active admin users with "john" in their name or email.

## Implementation Details

### Search Logic
1. **Numeric Detection**: If search term is numeric, searches by ID
2. **Text Search**: Otherwise searches in `fullName` and `email` fields
3. **Case Insensitive**: Uses `ILIKE` for case-insensitive matching
4. **Partial Matching**: Uses `%search%` pattern for partial matches

### Filter Logic
1. **Role Filter**: Exact match on role field
2. **Status Filter**: Converts string to boolean:
   - `active` or `true` → `isActive = true`
   - `inactive` or `false` → `isActive = false`
3. **Combined Filters**: All filters are applied with AND logic

### Performance Considerations
- **Indexed Fields**: Ensure `email`, `fullName`, `role`, and `isActive` are indexed
- **Query Optimization**: Uses TypeORM QueryBuilder for efficient queries
- **Pagination**: Implements proper skip/take for large datasets

## Frontend Integration

### Search Input
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [selectedRole, setSelectedRole] = useState('');
const [selectedStatus, setSelectedStatus] = useState('');

const searchUsers = async () => {
  const params = new URLSearchParams({
    page: '1',
    limit: '10',
    ...(searchTerm && { search: searchTerm }),
    ...(selectedRole && { role: selectedRole }),
    ...(selectedStatus && { status: selectedStatus }),
  });
  
  const response = await fetch(`/api/v1/users?${params}`);
  const data = await response.json();
  return data;
};
```

### Filter Dropdowns
```typescript
const [filterOptions, setFilterOptions] = useState({ roles: [], statuses: [] });

useEffect(() => {
  fetch('/api/v1/users/filters')
    .then(res => res.json())
    .then(data => setFilterOptions(data));
}, []);
```

## Migration from Old API

### Before (Basic Pagination)
```http
GET /api/v1/users?page=1&limit=10
```

### After (Enhanced Search & Filter)
```http
GET /api/v1/users?page=1&limit=10&search=john&role=admin&status=active
```

**Backward Compatibility**: The old API still works - new parameters are optional.

## Error Handling

- **Invalid Status**: Invalid status values are ignored (no error thrown)
- **Invalid Role**: Invalid roles return empty results
- **Database Errors**: Proper error logging and user-friendly messages
- **Validation**: Input validation on all parameters

## Testing

### Test Cases
1. **Search by name**: `search=john`
2. **Search by email**: `search=@example.com`
3. **Search by ID**: `search=123`
4. **Filter by role**: `role=admin`
5. **Filter by status**: `status=active`
6. **Combined filters**: `search=john&role=admin&status=active`
7. **Empty results**: `search=nonexistent`
8. **Pagination**: `page=2&limit=5`

### Performance Tests
- Test with large datasets (10,000+ users)
- Verify query performance with indexes
- Test pagination with large result sets
