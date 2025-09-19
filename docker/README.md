# Docker Setup for FPT Software Website

This directory contains Docker configuration files for the FPT Software Website project.

## Files

- `mysql/init/01-init.sql` - Database initialization script that runs when the MySQL container starts for the first time

## Usage

### Start the database

```bash
docker-compose up -d mysql
```

### Stop the database

```bash
docker-compose down
```

### View logs

```bash
docker-compose logs mysql
```

### Access MySQL directly

```bash
docker-compose exec mysql mysql -u fpt_software_user -p fpt_software_website
```

## Environment Variables

The following environment variables can be configured in a `.env` file:

- `MYSQL_ROOT_PASSWORD` - Root password for MySQL (default: fpt_software_root_password)
- `MYSQL_DATABASE` - Database name (default: fpt_software_website)
- `MYSQL_USER` - Application user (default: fpt_software_user)
- `MYSQL_PASSWORD` - Application user password (default: fpt_software_password)

## Database Schema

The initialization script creates the following tables:

- `users` - User accounts for admin portal
- `industries` - Industry categories
- `announcements` - News and announcements
- `subscriptions` - Newsletter subscriptions

## Data Persistence

Database data is persisted using Docker volumes. The `mysql_data` volume ensures that data survives container restarts and updates.
