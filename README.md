# Rapid Order - Frontend

## Resumen

Rapid Order is a frontend application designed to streamline the process of placing orders in food establishments. It enhances the user experience by allowing efficient and straightforward order placement.

## Estructura de Carpetas

```plaintext
Frontend project
│
├── src
  ├── app
  ├── components
    ├── otros componentes
    ├── ui
  ├── modules
  ├── services
    ├── config
    ├── ... more service folders
  ├── shared
    ├── config
    ├── constants
    ├── utils
├── public
├── node_modules
├── Dockerfile.dev
├── docker-compose-dev.yml
├── package.json
├── tsconfig.json
└── ...
```

## Instalación y Ejecución en Contenedor

1. **Clona el Repositorio:**

   ```bash
   HTTP: https://github.com/clma-luis/RapidOrder_frontend.git
   SSH: git@github.com:clma-luis/RapidOrder_frontend.git

2. **Navega al Directorio del Proyecto:**

    ```bash
    cd rapid-order-frontend

3. **Copia el Archivo de Entorno:**

    ```bash
    cp .env.example .env

4. **Instala las Dependencias:**

    ```bash
    docker-compose -f docker-compose-dev.yml up --build

5. **Ejecutar Pruebas:**

    ```bash
    docker-compose -f docker-compose-dev.yml run nextjs-app npm run test