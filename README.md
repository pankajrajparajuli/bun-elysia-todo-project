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

## ✨ Features

- ⚡ **Blazing fast** runtime powered by **Bun**
- 🌸 **Type-safe** & ergonomic API development with **Elysia**
- 🐘 **PostgreSQL** + **Drizzle ORM** — fully type-safe queries & migrations
- 🐳 **Production-ready** containerization with **Docker** & **Docker Compose**
- 🔄 **Nginx** as a high-performance reverse proxy & static file serving
- 📊 **Prometheus** metrics — application + system observability
- 📈 **Grafana** dashboards — beautiful real-time visualization
- 🔧 Clean **.env**-based configuration
- 🧹 **Modular**, clean, and scalable project structure


## 🛠 Tech Stack

| Layer              | Technology                     |
|--------------------|--------------------------------|
| Runtime            | Bun                            |
| Web Framework      | Elysia                         |
| ORM                | Drizzle ORM                    |
| Database           | PostgreSQL                     |
| Reverse Proxy      | Nginx                          |
| Monitoring         | Prometheus + Grafana           |
| Containerization   | Docker · Docker Compose        |
| Configuration      | dotenv                         |

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