# Agenda Médica CHENSON Cloud

Aplicación web dinámica académica para registrar, consultar, editar, reprogramar y eliminar citas médicas programadas o de seguimiento.

> En una urgencia no se utiliza la agenda: se debe acudir directamente al servicio médico.

## Funciones

- CRUD completo de citas.
- Horarios de lunes a viernes de 09:00 a 12:30 h.
- Descanso bloqueado de 10:30 a 11:00 h.
- Prevención de reservaciones duplicadas.
- Filtros por fecha, departamento y estado.
- Enlace para agregar cada cita a Google Calendar.
- Enlace a Google Maps.
- Interfaz responsiva para computadora, tableta y celular.
- Datos ficticios para demostración académica.

## Tecnologías

Node.js, Express, EJS, MongoDB Atlas, Mongoose, CSS y JavaScript.

## Instalación local

1. Abre esta carpeta en VS Code.
2. Ejecuta `npm install`.
3. Duplica `.env.example`, renómbralo `.env` y agrega tu conexión de MongoDB Atlas.
4. Ejecuta `npm run seed` para agregar tres citas ficticias (opcional).
5. Ejecuta `npm start`.
6. Abre `http://localhost:3000`.

## Variables de entorno

| Variable | Uso |
|---|---|
| `MONGODB_URI` | Cadena privada de conexión a MongoDB Atlas |
| `PORT` | Puerto local; Render lo asigna automáticamente |
| `MAPS_URL` | Enlace público de la ubicación en Google Maps |

Nunca publiques el archivo `.env` ni escribas credenciales directamente en el código.

## Publicación en Render

- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Variable requerida: `MONGODB_URI`
- Variable opcional: `MAPS_URL`

Render proporciona automáticamente `PORT`. La aplicación ya escucha en `0.0.0.0`.

## Datos y privacidad

Este proyecto está preparado como demostración académica. No debe utilizar datos reales de empleados o pacientes mientras no cuente con autenticación, controles de acceso y medidas de seguridad apropiadas.

