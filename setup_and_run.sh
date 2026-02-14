#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}MediVault Setup Script${NC}"
echo "--------------------------------"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}Java is not installed. Please install Java 21 or higher.${NC}"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Maven is not installed. Please install Maven.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js.${NC}"
    exit 1
fi

# Prompt for Aiven PostgreSQL details
echo -e "${YELLOW}Enter your Aiven PostgreSQL details:${NC}"
read -p "Host: " DB_HOST
read -p "Port: " DB_PORT
read -p "Database name: " DB_NAME
read -p "Username: " DB_USERNAME
read -p "Password: " DB_PASSWORD

# Update application.properties
echo -e "${YELLOW}Updating application.properties...${NC}"
cat > mediVault_springboot/src/main/resources/application.properties << EOF
spring.application.name=mediVault_springboot
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Properties
spring.jpa.hibernate.ddl-auto=none
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Initialize schema using SQL scripts
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:db/schema.sql

# JWT Configuration
jwt.secret=$(openssl rand -base64 32)
jwt.expiration=86400000

# CORS Configuration
spring.webmvc.cors.allowed-origins=http://localhost:5173
spring.webmvc.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.webmvc.cors.allowed-headers=*
spring.webmvc.cors.allow-credentials=true

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Email Configuration (Replace with your email service details)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Logging Configuration
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
EOF

echo -e "${GREEN}Application properties updated successfully!${NC}"

# Build and run the Spring Boot application
echo -e "${YELLOW}Building and running the Spring Boot application...${NC}"
cd mediVault_springboot
mvn clean install
mvn spring-boot:run &
SPRING_PID=$!
cd ..

echo -e "${GREEN}Spring Boot application started with PID: ${SPRING_PID}${NC}"

# Install dependencies and run the React application
echo -e "${YELLOW}Installing dependencies and running the React application...${NC}"
cd project
npm install
npm run dev &
REACT_PID=$!
cd ..

echo -e "${GREEN}React application started with PID: ${REACT_PID}${NC}"

echo -e "${GREEN}Setup complete! Access the application at http://localhost:5173${NC}"

# Wait for user to press Ctrl+C
echo -e "${YELLOW}Press Ctrl+C to stop both applications${NC}"
trap "kill $SPRING_PID $REACT_PID; exit" INT
wait 