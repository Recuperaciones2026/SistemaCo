# Grupo Finvivir · Plataforma de Recuperación — Prototipo

Prototipo funcional para la prueba de campo del sistema de gestión de recuperación
de cartera.

---

## ⚠️ LEER ANTES DE PUBLICAR

Este prototipo **no tiene seguridad real**:

- **No hay servidor.** Toda la lógica y los datos viven en el navegador.
- **La autenticación es simulada.** Las contraseñas se verifican contra hashes
  SHA-256 que viajan dentro de `script.js`. Cualquiera que abra el archivo los ve.
  Las contraseñas además son adivinables por diseño (`Nombre#Fin2026`), porque
  tienen que poder comunicarse a los participantes de la prueba.
- **No hay persistencia.** Todo lo capturado se pierde al cerrar o refrescar.
- **La bitácora no es auditoría.** Vive en memoria y desaparece con la sesión.
- **El alcance de datos es de presentación, no de seguridad.** Los datos completos
  están en el navegador de quien abra la página.

**Los datos incluidos son ficticios.** Nunca conectar este prototipo a datos reales
de clientes ni usarlo como base del sistema productivo.

### Sobre publicar en GitHub Pages

GitHub Pages en cuenta **gratuita requiere repositorio público**, y Google lo indexa.
Aunque los datos de clientas sean ficticios, la página expone el nombre de la empresa,
nombres de personal, la estructura de jefaturas y la matriz de permisos: es
**información interna de la organización**.

- Con plan **GitHub Pro / Team / Enterprise** se puede publicar desde repositorio
  privado y restringir el acceso. Esa es la opción recomendada.
- Con cuenta gratuita, considerar una alternativa con autenticación (ver más abajo).

---

## Archivos

```
index.html      Estructura de la página y contenedores
estilo.css      Todos los estilos (variables de diseño, componentes, responsive)
script.js       Datos simulados, reglas de negocio y las 26 pantallas
favicon.svg     Icono de la pestaña
.nojekyll       Evita que GitHub procese los archivos con Jekyll
README.md       Este documento
```

No hay carpeta de imágenes: el logotipo está dibujado con CSS y los iconos son
emoji. El único `<img>` del sistema es dinámico, para la vista previa de evidencia
fotográfica.

**Dependencia externa:** la tipografía Inter se carga desde Google Fonts. Si no hay
internet o el CDN está bloqueado, la aplicación usa la tipografía del sistema y
sigue viéndose correctamente.

---

## Publicar en GitHub Pages

### 1. Crear el repositorio

En GitHub: **New repository**. Si tienen plan pagado, márcalo **Private**.
No agregar README (ya existe uno).

### 2. Subir los archivos

Con la interfaz web: **Add file → Upload files**, arrastrar los 6 archivos y
confirmar con **Commit changes**.

Con línea de comandos:

```bash
git init
git add .
git commit -m "Prototipo de recuperación de cartera para prueba de campo"
git branch -M main
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

> `.nojekyll` empieza con punto y algunos exploradores lo ocultan. Verifica que
> quedó subido; sin él, GitHub puede ignorar archivos en ciertos casos.

### 3. Activar Pages

**Settings → Pages**

- Source: **Deploy from a branch**
- Branch: **main**, carpeta **/ (root)**
- **Save**

En uno o dos minutos la URL aparece en la misma pantalla:
`https://USUARIO.github.io/REPOSITORIO/`

### 4. Verificar

Abre la URL y comprueba:

- [ ] Carga la pantalla de inicio de sesión con el logotipo
- [ ] Entra con `carmen.vega@finvivir.com` / `Carmen#Fin2026`
- [ ] La barra roja de SIMULACIÓN aparece al fondo
- [ ] Se recorren las opciones del menú lateral sin errores
- [ ] Los botones **Reportar algo** y **Cerrar sesión** están al pie del menú
- [ ] Se ve bien en un teléfono real, no solo en el navegador de escritorio

Si algo no carga, abre la consola del navegador (F12) y revisa si falta un archivo.

---

## Actualizar después

Sube el archivo modificado al repositorio y Pages se actualiza solo en un par de
minutos. Si no ves el cambio, es caché del navegador: recarga con **Ctrl+Shift+R**
(Cmd+Shift+R en Mac).

---

## Alternativas si no pueden usar repositorio privado

| Opción | Autenticación | Notas |
|---|---|---|
| **Azure Static Web Apps** con Entra ID | ✅ Cuenta de Finvivir | Recomendada: ya usan Microsoft 365, solo entra quien tenga cuenta de la empresa |
| **SharePoint** o Teams (biblioteca de documentos) | ✅ Cuenta de Finvivir | Lo más rápido si TI ya lo administra |
| **Red interna** (servidor local o intranet) | Según su red | Sin exposición a internet |
| GitHub Pages privado (plan pagado) | ✅ Cuenta de GitHub | Requiere que los participantes tengan cuenta de GitHub |
| GitHub Pages gratuito | ❌ Público | No recomendado por la exposición de información interna |

Todas sirven igual: son archivos estáticos, no requieren servidor de aplicaciones.

---

## Credenciales

Están en el documento `CREDENCIALES_PRUEBA.md`, que **no debe subirse al
repositorio**. Compártelo por separado con los participantes de la prueba.

---

## Contexto del proyecto

Este prototipo existe para validar reglas de negocio y usabilidad con el área
usuaria antes de construir el sistema real. El diseño de la base de datos y la
especificación funcional están documentados aparte:

- `Especificacion_Tecnica_Finvivir.docx` — reglas de negocio, máquinas de estado, RBAC
- `Levantamiento_BD_Finvivir.docx` — modelo de datos y trazabilidad
- `finvivir_ddl.sql` — 48 tablas propuestas para PostgreSQL

El prototipo es **referencia de UX y de reglas**, no base de código del sistema
productivo.
