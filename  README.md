# Data Pusher 🚀

A robust Express.js web application built with TypeScript that receives data and intelligently distributes it across multiple platforms using webhook URLs. Perfect for data integration, real-time notifications, and multi-platform data synchronization.

## ✨ Features

- **Multi-Account Management**: Create and manage multiple accounts with unique identifiers
- **Flexible Destinations**: Configure multiple webhook destinations per account
- **Smart Data Routing**: Automatically route incoming data to all configured destinations
- **HTTP Method Support**: Supports GET, POST, and PUT methods with intelligent data formatting
- **Secure Authentication**: Token-based authentication using auto-generated app secret tokens
- **TypeScript**: Full type safety and modern JavaScript features
- **SQLite Database**: Lightweight, file-based database with TypeORM
- **RESTful APIs**: Clean, well-documented REST endpoints
- **Error Handling**: Comprehensive error handling with meaningful responses
- **Cascade Operations**: Account deletion automatically removes associated destinations

## 🏗️ Architecture

### Core Modules

1. **Account Module**

   - Manages user accounts with unique email addresses
   - Auto-generates account IDs and secret tokens
   - Optional website field for additional context

2. **Destination Module**

   - Manages webhook destinations for each account
   - Supports custom headers and HTTP methods
   - Flexible URL configuration

3. **Data Handler Module**
   - Processes incoming JSON data via `/server/incoming_data`
   - Authenticates requests using secret tokens
   - Distributes data to all account destinations

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd data-pusher
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the application**

   ```bash
   npm run build
   ```

4. **Start the server**

   ```bash
   # Production
   npm start

   # Development (with hot reload)
   npm run dev
   ```

The server will start on `http://localhost:3000` by default.

### Database

The application uses SQLite with TypeORM. The database file (`data-pusher.db`) will be automatically created on first run.

### Base URL

```
http://localhost:3000
```

### Authentication

Data submission requires the `CL-X-TOKEN` header with a valid app secret token.
