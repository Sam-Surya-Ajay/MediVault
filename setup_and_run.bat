@echo off
setlocal enabledelayedexpansion

echo MediVault Setup Script
echo --------------------------------

:: Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Java is not installed. Please install Java 21 or higher.
    exit /b 1
)

:: Check if Maven is installed
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Maven is not installed. Please install Maven.
    exit /b 1
)

:: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js.
    exit /b 1
)

:: Prompt for Aiven PostgreSQL details
echo Enter your Aiven PostgreSQL details:
set /p DB_HOST="Host: "
set /p DB_PORT="Port: "
set /p DB_NAME="Database name: "
set /p DB_USERNAME="Username: "
set /p DB_PASSWORD="Password: "

:: Generate random JWT secret
set "characters=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
set "jwt_secret="
for /L %%i in (1,1,32) do (
    set /a "rand=!random! %% 62"
    for %%j in (!rand!) do set "jwt_secret=!jwt_secret!!characters:~%%j,1!"
)

:: Update application.properties
echo Updating application.properties...
(
echo spring.application.name=mediVault_springboot
echo server.port=8080
echo.
echo # Database Configuration
echo spring.datasource.url=jdbc:postgresql://%DB_HOST%:%DB_PORT%/%DB_NAME%?sslmode=require
echo spring.datasource.username=%DB_USERNAME%
echo spring.datasource.password=%DB_PASSWORD%
echo spring.datasource.driver-class-name=org.postgresql.Driver
echo.
echo # JPA/Hibernate Properties
echo spring.jpa.hibernate.ddl-auto=none
echo spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
echo spring.jpa.show-sql=true
echo spring.jpa.properties.hibernate.format_sql=true
echo.
echo # Initialize schema using SQL scripts
echo spring.sql.init.mode=always
echo spring.sql.init.schema-locations=classpath:db/schema.sql
echo.
echo # JWT Configuration
echo jwt.secret=%jwt_secret%
echo jwt.expiration=86400000
echo.
echo # CORS Configuration
echo spring.webmvc.cors.allowed-origins=http://localhost:5173
echo spring.webmvc.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
echo spring.webmvc.cors.allowed-headers=*
echo spring.webmvc.cors.allow-credentials=true
echo.
echo # File Upload Configuration
echo spring.servlet.multipart.max-file-size=10MB
echo spring.servlet.multipart.max-request-size=10MB
echo.
echo # Email Configuration (Replace with your email service details)
echo spring.mail.host=smtp.gmail.com
echo spring.mail.port=587
echo spring.mail.username=your-email@gmail.com
echo spring.mail.password=your-app-password
echo spring.mail.properties.mail.smtp.auth=true
echo spring.mail.properties.mail.smtp.starttls.enable=true
echo.
echo # Logging Configuration
echo logging.level.org.springframework.security=DEBUG
echo logging.level.org.hibernate.SQL=DEBUG
echo logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
) > mediVault_springboot\src\main\resources\application.properties

echo Application properties updated successfully!

:: Build and run the Spring Boot application
echo Building and running the Spring Boot application...
cd mediVault_springboot
start cmd /k "mvn clean install && mvn spring-boot:run"
cd ..

:: Install dependencies and run the React application
echo Installing dependencies and running the React application...
cd project
start cmd /k "npm install && npm run dev"
cd ..

echo Setup complete! Access the application at http://localhost:5173
echo Press Ctrl+C in the terminal windows to stop the applications

pause 