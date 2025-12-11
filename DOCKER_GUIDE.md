# Primavera Events Group - Docker Deployment Guide

## 🐳 Deployment con Docker Compose

### Requisitos Previos
- Docker Desktop instalado
- Docker Compose v2.0+
- 4GB RAM mínimo
- 10GB espacio en disco

---

## 🚀 Inicio Rápido

### 1. Construir y Ejecutar

```bash
# Desde la raíz del proyecto
docker-compose up --build -d
```

Esto iniciará:
- **PostgreSQL** en puerto 5432
- **Backend API** en puerto 3000
- **Frontend** en puerto 80

### 2. Acceder a la Aplicación

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### 3. Ver Logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

### 4. Detener Servicios

```bash
# Detener sin eliminar
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

---

## 📋 Servicios Incluidos

### 1. Database (PostgreSQL)
- **Imagen**: postgres:15-alpine
- **Puerto**: 5432
- **Usuario**: primavera
- **Password**: primavera2024
- **Database**: primavera_events
- **Volumen**: postgres_data (persistente)

### 2. Backend (Node.js + Express)
- **Puerto**: 3000
- **Tecnología**: TypeScript, Prisma, Express
- **Health Check**: Automático cada 30s
- **Auto-restart**: Sí

### 3. Frontend (React + Nginx)
- **Puerto**: 80
- **Tecnología**: React, Vite, TailwindCSS
- **Servidor**: Nginx
- **Gzip**: Habilitado
- **Cache**: Optimizado

---

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# Database
POSTGRES_USER=primavera
POSTGRES_PASSWORD=primavera2024
POSTGRES_DB=primavera_events

# Backend
NODE_ENV=production
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000
```

### Cambiar Puertos

Editar `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Cambiar puerto frontend
  
  backend:
    ports:
      - "4000:3000"  # Cambiar puerto backend
```

---

## 🗄️ Base de Datos

### Migraciones

Las migraciones se ejecutan automáticamente al iniciar el backend.

### Seed Data

Para poblar la base de datos:

```bash
# Ejecutar dentro del contenedor backend
docker-compose exec backend npm run seed
docker-compose exec backend npx ts-node src/seed-venues.ts
```

### Backup

```bash
# Crear backup
docker-compose exec database pg_dump -U primavera primavera_events > backup.sql

# Restaurar backup
docker-compose exec -T database psql -U primavera primavera_events < backup.sql
```

### Acceso Directo

```bash
# Conectar a PostgreSQL
docker-compose exec database psql -U primavera -d primavera_events
```

---

## 🔍 Troubleshooting

### Problema: Backend no inicia

```bash
# Ver logs detallados
docker-compose logs backend

# Reconstruir imagen
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Problema: Frontend muestra error 502

```bash
# Verificar que backend esté corriendo
docker-compose ps

# Reiniciar frontend
docker-compose restart frontend
```

### Problema: Database connection error

```bash
# Verificar health check
docker-compose ps database

# Reiniciar database
docker-compose restart database

# Esperar a que esté healthy
docker-compose logs database
```

### Limpiar Todo y Empezar de Nuevo

```bash
# Detener y eliminar todo
docker-compose down -v

# Limpiar imágenes
docker system prune -a

# Reconstruir
docker-compose up --build -d
```

---

## 📊 Monitoreo

### Health Checks

```bash
# Backend
curl http://localhost:3000/api/health

# Frontend
curl http://localhost/

# Database
docker-compose exec database pg_isready -U primavera
```

### Recursos

```bash
# Ver uso de recursos
docker stats

# Ver solo servicios de Primavera
docker stats primavera-frontend primavera-backend primavera-db
```

---

## 🚀 Deployment en Producción

### 1. Cambiar Credenciales

```yaml
# docker-compose.yml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}  # Usar variable de entorno
```

### 2. Usar HTTPS

Agregar servicio de reverse proxy (Nginx o Traefik):

```yaml
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs
```

### 3. Configurar Dominio

```yaml
services:
  frontend:
    environment:
      VIRTUAL_HOST: primavera-events.com
      LETSENCRYPT_HOST: primavera-events.com
```

---

## 📦 Comandos Útiles

```bash
# Reconstruir solo un servicio
docker-compose build backend

# Escalar servicios (si es necesario)
docker-compose up -d --scale backend=3

# Ver configuración final
docker-compose config

# Ejecutar comando en contenedor
docker-compose exec backend npm run seed

# Copiar archivos
docker cp primavera-backend:/app/logs ./logs
```

---

## 🔐 Seguridad

### Recomendaciones para Producción

1. **Cambiar passwords por defecto**
2. **Usar secrets de Docker**
3. **Habilitar HTTPS**
4. **Configurar firewall**
5. **Limitar acceso a puertos**
6. **Actualizar imágenes regularmente**

### Secrets

```yaml
services:
  database:
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

---

## 📈 Optimizaciones

### Caché de Build

```bash
# Usar BuildKit
DOCKER_BUILDKIT=1 docker-compose build
```

### Multi-stage Builds

Ya implementado en los Dockerfiles para reducir tamaño de imágenes.

### Volúmenes Named

```yaml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      device: /path/to/data
      o: bind
```

---

## 📝 Mantenimiento

### Actualizar Aplicación

```bash
# Pull últimos cambios
git pull

# Reconstruir y reiniciar
docker-compose up --build -d

# Ver logs
docker-compose logs -f
```

### Limpiar Recursos

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes sin usar
docker image prune -a

# Eliminar volúmenes sin usar
docker volume prune
```

---

## 🎯 Checklist de Deployment

- [ ] Cambiar passwords por defecto
- [ ] Configurar variables de entorno
- [ ] Configurar dominio y DNS
- [ ] Habilitar HTTPS
- [ ] Configurar backups automáticos
- [ ] Configurar monitoreo
- [ ] Probar health checks
- [ ] Documentar configuración
- [ ] Configurar logs centralizados
- [ ] Implementar CI/CD

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisar logs: `docker-compose logs`
2. Verificar health checks
3. Revisar documentación de Docker
4. Contactar al equipo de desarrollo

---

**Última actualización**: Diciembre 2025
