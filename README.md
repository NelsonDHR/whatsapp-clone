# WhatsApp-clone

## Integrantes.
- Miguel Angel Fernandez Villaquirán - 201941923.
- Jorge Eduardo Arias Muñoz          - 202042055.
- Nelson Daniel Herrera Rey          - 201841270.

## Link de la página en funcionamiento.
- Puede acceder a la aplicación ya desplegada por medio de esta url: https://jorgeasmz-whatsapp-clone.netlify.app/#/

## Guía de inicio rápida.
- Clone el repositorio y use el comando git clone (link del repositorio) dentro de una consola y dirección que desee.
- Entre al repositorio, ingrese a la ruta `whatsapp-clone/packages/client` y ejecute `npm install`, igualmente para `whatsapp-clone/packages/server`.

# Explicación del proyecto.
  ## Pipeline.
  ![CI_CD drawio](https://github.com/jorgeasmz/whatsapp-clone/assets/71350118/78497862-0641-4e0f-90c0-82389f5459f6)
  - Usando la metodología de Scrum los desarrolladores realizan las historias de usuario que les corresponden durante su sprint. 
  - Cómo para el desarrollo del proyecto se usó la metodología de gitflow cada HU se trabaja en una branch diferente que se desprende de la rama dev. 
    Una vez la HU está completada se realiza el respectivo commit y push al repositorio; ya en el repositorio se realiza el merge con la rama Dev.
  - Al realizar el pull request en la rama Dev Github actions se activará dando paso a la ejecución de pruebas de frontend y backend, además del escaneo de *sonarCloud*.
  - Una vez ha transcurridas las pruebas se hará el build de la imágen del backend y se notificará a Slack el merge realizado y el informe de *sonarCloud*. (C.I.)
  - Una vez llegado hasta aquí se realiza pull request de Dev hacía main, es aquí donde inicia el C.D. el cual toma la imagen creada del backend y la manda a *fly.io*
    el cual se encargará del host de nuestro servicio, a su vez esto resultará en la activación del trigger que desde el build del frontend realizará su deploy en *netlify*.
  > Este trigger no es directamente desde github actions, el repositorio se encuentra vinculado con netlify el cual detecta los cambios en main, por lo que en el momento del merge toma el dist y realiza el deploy.
  - Ya estando todo deplegado y funcionando *fly.io* nos ofrece automáticamente monitoreo de la aplicación con grafana.     
  ## Ejecución de pruebas.
  - Las pruebas se ejecutan automáticamente en el momento del pull request con la rama Dev, pues está configurado un actions en el proyecto el cual sigue está secuencia:
    - Instala las dependencias del backend, ejecuta las pruebas.
    - Instala las dependencias del frontend, ejecuta las pruebas.
    - Ejecuta el escaneo de *sonarCloud*.
  - Si desea ejecutar las pruebas desde la consola dirijase ya sea a *client* o *server* y ejecute el comando `npm run tests`
  ## Despliegues.
  - El proceso de despliegue al igual que en las pruebas se ejecutra automáticamente el cambio está en que este trigger se activa cuando el pull request va dirijido a la rama main, es ahí cuando a partir de la imágen del backend se realiza el deploy en *fly.io* a su vez esto hará de trigger para que en *netlify* se realice el deploy con el build del frontend.
  > Lea la parte de `Pipeline` para entender a qué se refiere con "Esto hará de trigger".
  ## Monitoreo de la aplicación.
  - EL monitoreo está a carga de *fly.io* el cual de manera automática nos ofrece este servicio por medio de grafana.

