# Tutifruti con palabra en guaraní

Aplicación React Native 0.87.1 (TypeScript) para jugar Tutifruti en red. Cada jugador
recibe 10 monedas digitales para apostar, y los participantes se unen a una sala
compartiendo una clave.

## Cómo se juega

1. Cada jugador escribe su nombre y recibe 10 monedas.
2. Un jugador crea la sala y comparte la clave de 5 caracteres. Los demás entran con esa clave.
3. El anfitrión elige la apuesta (1 a 3 monedas) e inicia la ronda. Cada participante apuesta lo mismo.
4. Se sortea una letra. Cada categoría aparece en una vista individual, con las opciones Volver y Saltar.
5. Al completar todas las categorías (todas deben empezar con la letra), un jugador presiona **TUTIFRUTI**.
   La pantalla de los demás se bloquea y se comparten los resultados.
6. Puntaje: 10 por palabra válida única, 5 si otro jugador escribió la misma, 0 si es inválida o está vacía.
   El mayor puntaje se lleva el pozo (si hay empate, se reparte).

## Requisitos

| Herramienta | Versión |
|---|---|
| Node.js | 22.11 o superior |
| JDK | 17 |
| Android SDK | Platform 36, Build-Tools y Platform-Tools |
| NOX Player o teléfono Android | Con depuración habilitada |

Variables de entorno: `ANDROID_HOME` y `JAVA_HOME` (ver la guía de compilación local).

## Compilar y probar

```
git clone https://github.com/moios/tutifruti.git
cd tutifruti
npm install
cd android
gradlew.bat assembleRelease -PreactNativeArchitectures=x86_64
```

En Linux o macOS use `./gradlew`. Para un teléfono real use `arm64-v8a` en lugar de `x86_64`.

El APK queda en `android/app/build/outputs/apk/release/app-release.apk`. Para instalarlo en NOX Player:

```
adb connect 127.0.0.1:62001
adb install -r app/build/outputs/apk/release/app-release.apk
```

El puerto es 62001 en NOX de 32 bits y 62025 en NOX de 64 bits.

## Servidor

La app necesita el servidor PHP del docente para sincronizar las salas. La dirección está en
`src/config.ts` (`API_URL`). El servidor no forma parte de este repositorio.

## Estructura

```
App.tsx                      Navegación según el estado (registro, menú, sala)
src/config.ts                Dirección del servidor y opciones de apuesta
src/api.ts                   Llamadas al servidor
src/hooks/useEstadoSala.ts   Consulta periódica del estado de la sala
src/pantallas/               Registro, Menú, Sala, Lobby, Juego, Resultados
src/componentes/             Boton, Chip, Cabecera
src/utils/texto.ts           Normalización de palabras
```
