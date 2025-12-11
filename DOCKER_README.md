# 🐳 Docker Compose - Primavera Events Group

## ✅ Archivos Creados

```
primavera-events-app/
├── docker-compose.yml          # Configuración principal
├── .dockerignore               # Archivos a ignorar
├── DOCKER_GUIDE.md            # Guía completa de deployment
│
├── server/
│   └── Dockerfile             # Imagen del backend
│
└── client/
    ├── Dockerfile             # Imagen del frontend
    └── nginx.conf             # Configuración de Nginx
```

---

## 🚀 Inicio Rápido

### 1. Ejecutar con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up --build -d
```

### 2. Acceder a la Aplicación

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

### 3. Ver Logs

```bash
docker-compose logs -f
```

### 4. Detener

```bash
docker-compose down
```

---

## 📦 Servicios Incluidos

### 🗄️ Database (PostgreSQL 15)
- Puerto: 5432
- Usuario: `primavera`
- Password: `primavera2024`
- Database: `primavera_events`
- Volumen persistente

### 🔧 Backend (Node.js + Express)
- Puerto: 3000
- TypeScript compilado
- Prisma ORM
- Health checks automáticos
- Auto-restart

### 🎨 Frontend (React + Nginx)
- Puerto: 80
- Build optimizado de Vite
- Nginx con gzip
- Proxy reverso a API
- Cache de assets

---

## 🔧 Características

### ✅ Multi-stage Builds
- Imágenes optimizadas
- Menor tamaño
- Más rápido deployment

### ✅ Health Checks
- Monitoreo automático
- Auto-recovery
- Status visible

### ✅ Networking
- Red privada entre servicios
- Comunicación interna segura
- Puertos expuestos solo necesarios

### ✅ Volúmenes Persistentes
- Data de PostgreSQL persiste
- Backups fáciles
- No se pierde información

### ✅ Production Ready
- Variables de entorno
- Logs centralizados
- Optimizaciones de performance
- Security headers

---

## 📊 Arquitectura Docker

```
┌─────────────────────────────────────────┐
│         Docker Compose Network          │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐│
│  │ Frontend │  │ Backend  │  │  DB   ││
│  │  :80     │◄─┤  :3000   │◄─┤ :5432 ││
│  │  Nginx   │  │ Node.js  │  │ PG 15 ││
│  └──────────┘  └──────────┘  └───────┘│
│       │             │             │    │
│       └─────────────┴─────────────┘    │
│              primavera-network         │
└─────────────────────────────────────────┘
         │
         ▼
    Host Machine
    localhost:80 → Frontend
    localhost:3000 → API
```

---

## 🛠️ Comandos Útiles

### Gestión de Servicios

```bash
# Iniciar
docker-compose up -d

# Detener
docker-compose stop

# Reiniciar
docker-compose restart

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f [servicio]
```

### Base de Datos

```bash
# Ejecutar seed
docker-compose exec backend npm run seed
docker-compose exec backend npx ts-node src/seed-venues.ts

# Backup
docker-compose exec database pg_dump -U primavera primavera_events > backup.sql

# Conectar a PostgreSQL
docker-compose exec database psql -U primavera -d primavera_events
```

### Desarrollo

```bash
# Reconstruir un servicio
docker-compose build backend

# Ver logs en tiempo real
docker-compose logs -f backend

# Ejecutar comando en contenedor
docker-compose exec backend sh
```

---

## 🔐 Seguridad

### Para Producción

1. **Cambiar passwords**:
```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

2. **Usar HTTPS**:
- Agregar certificados SSL
- Configurar reverse proxy

3. **Limitar acceso**:
- Firewall
- VPN
- IP whitelisting

---

## 📈 Performance

### Optimizaciones Incluidas

- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Multi-stage builds
- ✅ Production dependencies only
- ✅ Health checks
- ✅ Resource limits (configurable)

### Monitoreo

```bash
# Ver uso de recursos
docker stats

# Health checks
curl http://localhost:3000/api/health
curl http://localhost/
```

---

## 🎯 Deployment Checklist

- [x] Docker Compose configurado
- [x] Dockerfiles optimizados
- [x] Nginx configurado
- [x] Health checks implementados
- [x] Volúmenes persistentes
- [x] Networking configurado
- [x] Scripts de build
- [x] Documentación completa
- [ ] Cambiar passwords (producción)
- [ ] Configurar HTTPS (producción)
- [ ] Configurar dominio (producción)
- [ ] Backups automáticos (producción)

---

## 📚 Documentación

- `DOCKER_GUIDE.md` - Guía completa de deployment
- `TECHNICAL_DOCS.md` - Documentación técnica
- `README.md` - Inicio rápido

---

## 🎉 Resultado

Tu aplicación **Primavera Events Group** ahora está completamente dockerizada y lista para deployment en cualquier entorno que soporte Docker!

**Características:**
- ✅ Full-stack containerizado
- ✅ Base de datos PostgreSQL
- ✅ Production-ready
- ✅ Fácil de deployar
- ✅ Escalable
- ✅ Mantenible
