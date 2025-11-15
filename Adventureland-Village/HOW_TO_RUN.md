# How to Run AdventureLand Village REST API

## Project Overview
This is a Spring Boot REST API application for an Amusement Park management system with two user types:
- **Admin**: Manages activities and customers
- **Customer**: Books tickets and manages bookings

## Prerequisites

### Required Software
1. **Java 17** (JDK 17)
   - Check version: `java -version`
   - Download from: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html

2. **Maven 3.6+**
   - Check version: `mvn -version`
   - Download from: https://maven.apache.org/download.cgi

3. **MySQL Database**
   - The project is currently configured to use AWS RDS MySQL
   - For local development, you can use local MySQL or keep using AWS RDS

4. **IDE (Optional but recommended)**
   - IntelliJ IDEA, Eclipse, or VS Code with Java extensions

## Step-by-Step Setup Instructions

### Step 1: Clone/Navigate to Project
```bash
cd Adventureland-Village
```

### Step 2: Database Configuration

The project is currently configured to use AWS RDS MySQL. You have two options:

#### Option A: Use AWS RDS (Current Configuration)
The `application.properties` already has AWS RDS credentials configured:
- Host: `adventurelandvillage.chik8r4sqgzo.ap-south-1.rds.amazonaws.com`
- Port: `3306`
- Database: `adventurelandvillage`
- Username: `admin`
- Password: `ashishTripathy`

**Note**: Ensure you have network access to this AWS RDS instance.

#### Option B: Use Local MySQL Database
If you want to use a local MySQL database:

1. Install MySQL and create a database:
```sql
CREATE DATABASE adventurelandvillage;
```

2. Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/adventurelandvillage
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Step 3: Build the Project

Navigate to the project directory and build using Maven:

```bash
# Windows (PowerShell)
cd Adventureland-Village
.\mvnw clean install

# Or if Maven is installed globally
mvn clean install
```

This will:
- Download all dependencies
- Compile the project
- Run tests (if any)
- Create the JAR file

### Step 4: Run the Application

You have multiple options to run the application:

#### Option 1: Using Maven (Recommended for Development)
```bash
.\mvnw spring-boot:run

# Or if Maven is installed globally
mvn spring-boot:run
```

#### Option 2: Using the JAR File
After building, run the generated JAR:
```bash
java -jar target/AdventureLandVillageApplication.jar
```

#### Option 3: Run from IDE
- **IntelliJ IDEA**: Right-click on `AdventurelandVillageApplication.java` → Run
- **Eclipse**: Right-click on `AdventurelandVillageApplication.java` → Run As → Java Application
- **VS Code**: Use the Java extension and click Run

### Step 5: Verify Application is Running

Once started, you should see:
- Application running on port **8082**
- Database connection established
- Hibernate creating/updating tables (if `ddl-auto=update`)

Check the console for:
```
Started AdventurelandVillageApplication in X.XXX seconds
```

### Step 6: Access the API

#### Swagger UI (API Documentation)
Open your browser and navigate to:
```
http://localhost:8082/swagger-ui/index.html
```

This provides interactive API documentation where you can test all endpoints.

#### Base URL
All API endpoints are available at:
```
http://localhost:8082
```

## API Endpoints Overview

### Public Endpoints (No Authentication Required)
- `POST /customers/register` - Register a new customer
- `POST /admin/register` - Register a new admin
- `GET /activities` - Get all activities

### Customer Endpoints (Require JWT Token)
- `GET /customers/signIn` - Customer login (returns JWT token)
- `PUT /customers` - Update customer profile
- `DELETE /customers` - Delete customer
- `GET /customers` - Get all customers
- `GET /customers/{customerId}` - Get customer by ID

### Admin Endpoints (Require JWT Token)
- `GET /admin/signIn` - Admin login (returns JWT token)
- `PATCH /admin` - Update admin profile
- `DELETE /admin/{adminId}` - Delete admin
- `GET /admin` - Get all admins

### Activity Endpoints
- `POST /activities` - Add activity (Admin only)
- `GET /activities` - Get all activities (Public)

### Ticket Endpoints (Require JWT Token)
- `POST /tickets?activityId={id}` - Book a ticket
- `POST /tickets/{ticketId}` - Cancel a ticket
- `GET /tickets/{customerId}` - View all tickets of a customer
- `GET /tickets` - Calculate bill

## Authentication Flow

1. **Register** a user (customer or admin) using the registration endpoint
2. **Login** using Basic Authentication:
   - Username: Email address
   - Password: Your password
   - The response will include a JWT token in the `Authorization` header
3. **Use the JWT token** for subsequent requests:
   - Include in header: `Authorization: Bearer <your-jwt-token>`

### Example Login Request (using cURL)
```bash
# Customer Login
curl -X GET http://localhost:8082/customers/signIn \
  -u "customer@example.com:password" \
  -v

# Admin Login
curl -X GET http://localhost:8082/admin/signIn \
  -u "admin@example.com:password" \
  -v
```

The response will include the JWT token in the `Authorization` header.

## Testing the API

### Using Swagger UI
1. Open `http://localhost:8082/swagger-ui/index.html`
2. Click "Authorize" button (top right)
3. Enter your credentials or JWT token
4. Test endpoints directly from the UI

### Using Postman/Thunder Client
1. Register a user first
2. Login to get JWT token
3. Copy the token from response headers
4. Use it in subsequent requests: `Authorization: Bearer <token>`

### Using cURL
```bash
# Register a customer
curl -X POST http://localhost:8082/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123",
    "name": "John Doe",
    "mobile": "1234567890"
  }'

# Login and get token
curl -X GET http://localhost:8082/customers/signIn \
  -u "customer@example.com:password123" \
  -v

# Use token for authenticated requests
curl -X GET http://localhost:8082/customers \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Troubleshooting

### Common Issues

1. **Port 8082 already in use**
   - Change port in `application.properties`: `server.port=8083`
   - Or stop the process using port 8082

2. **Database connection error**
   - Verify database credentials in `application.properties`
   - Ensure MySQL is running (if using local)
   - Check network connectivity (if using AWS RDS)
   - Verify database exists

3. **Maven build fails**
   - Ensure Java 17 is installed and configured
   - Check internet connection (Maven needs to download dependencies)
   - Try: `mvn clean install -U` (force update dependencies)

4. **JWT token not working**
   - Ensure you're including the token in the `Authorization` header
   - Format: `Authorization: Bearer <token>`
   - Check token hasn't expired

5. **Lombok errors in IDE**
   - Install Lombok plugin in your IDE
   - Enable annotation processing in IDE settings

## Project Structure

```
Adventureland-Village/
├── src/
│   ├── main/
│   │   ├── java/com/adventurelandVillage/
│   │   │   ├── controller/     # REST Controllers
│   │   │   ├── service/        # Business Logic
│   │   │   ├── repository/     # Data Access Layer
│   │   │   ├── model/          # Entity Classes
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── security/       # Security Configuration
│   │   │   └── exception/      # Exception Handling
│   │   └── resources/
│   │       └── application.properties
│   └── test/                   # Test Files
├── pom.xml                     # Maven Configuration
└── mvnw                        # Maven Wrapper
```

## Additional Notes

- **Hibernate DDL**: The project uses `spring.jpa.hibernate.ddl-auto=update`, which automatically creates/updates database tables
- **SQL Logging**: `spring.jpa.show-sql=true` enables SQL query logging in console
- **CORS**: CORS is enabled for all origins (configured in SecurityConfiguration)
- **Password Encryption**: Passwords are encrypted using BCrypt with strength 11

## Support

For issues or questions, refer to the main README.md or contact the project contributors.

