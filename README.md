# Bun + Elysia Todo API

A modern, high-performance **Todo REST API** built with **Bun** + **Elysia**, using **PostgreSQL** with **Drizzle ORM**.  
Fully containerized with **Docker Compose**, including **Nginx** reverse proxy, **Prometheus** metrics, and **Grafana** dashboards.

<p align="center">
  <img src="https://img.shields.io/badge/Bun-1.3+-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
  <img src="https://img.shields.io/badge/Elysia-1.0+-FF69B4?style=for-the-badge" alt="Elysia" />
  <img src="https://img.shields.io/badge/Drizzle-ORM-blueviolet?style=for-the-badge" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/Monitoring-Prometheus/Grafana-orange?style=for-the-badge" alt="Monitoring" />
</p>

## Features

- ⚡ Blazing fast runtime with **Bun**
- 🌸 Type-safe, lightweight API framework — **Elysia**
- 🐘 PostgreSQL + **Drizzle ORM** (type-safe queries & migrations)
- 🐳 Fully containerized with **Docker** & **Docker Compose**
- 🔄 **Nginx** reverse proxy
- 📊 **Prometheus** for application + system metrics
- 📈 **Grafana** real-time dashboards & visualization
- 🔧 Clean `.env`-based configuration
- 🧹 Modular, scalable project structure

## Tech Stack

- **Runtime**: Bun  
- **Framework**: Elysia  
- **ORM**: Drizzle ORM  
- **Database**: PostgreSQL  
- **Monitoring**: Prometheus + Grafana  
- **Containerization**: Docker · Docker Compose  
- **Reverse Proxy**: Nginx  

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-username/bun-elysia-todo.git
cd bun-elysia-todo

# Install dependencies
bun install

# ────────────── Option 1: Run locally ──────────────
bun run index.ts

# ────────────── Option 2: Run with Docker (recommended) ──────────────
docker compose up --build
```