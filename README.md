# El laboratorio de la pantalla

Actividad de ordenadores para practicar **la medida**: leer instrumentos, escribir la
medida con su unidad y pasar de unas unidades a otras.

Pensada para **2.º de ESO**, ámbito científico-tecnológico, adaptación curricular. Sirve
igual para 1.º de ESO y para repasar en 3.º.

**▶ [Abrir el laboratorio](https://nesorct.github.io/laboratorio-en-pantalla/)**

Jaime Aniorte · [soytecnoteacher.com](https://soytecnoteacher.com)

---

## Qué hace

Cinco retos de ocho preguntas cada uno:

| | | |
|---|---|---|
| 🔎 | **¿Con qué se mide?** | Cada magnitud tiene su instrumento y su unidad |
| 📏 | **Lee el instrumento** | Regla, probeta, termómetro y balanza de aguja, dibujados |
| 🎯 | **Medir bien** | La media de tres medidas, pesar diez y dividir, regla contra calibre |
| ✍️ | **Con su unidad** | 32 mm, no 32 |
| 🪜 | **La escalera** | Conversiones con la escalera entera delante |

Con seis aciertos de ocho se gana la medalla del reto. Al terminar sale un parte en
pantalla que el alumno enseña al profesor o fotografía.

## Lo que la atraviesa entera

**Una medida es un número y una unidad.** El número y la unidad se piden por separado, y
si escribes el número sin tocar unidad no te deja pasar. Acertar el número con la unidad
equivocada cuenta como fallo, y lo explica.

No es un adorno: es el error que más se repite en el taller, y una pantalla puede decirlo
veinte veces seguidas sin cansarse.

## Cómo se usa en clase

**Por parejas**, aunque haya ordenadores de sobra: uno lee el instrumento en voz alta y el
otro teclea, y cambian cada dos preguntas. Así hablan, que es lo que la hace dinámica.

Mientras van, merece la pena pasearse mirando pantallas: **se ve quién falla el número y
quién falla la unidad, y son dos problemas distintos**. El que falla la unidad no sabe qué
está midiendo; el que falla el número no sabe leer la escala.

Si un día no van los ordenadores, el mismo fichero sirve proyectado con toda la clase.

## No guarda nada

Ni nombres, ni resultados, ni estadísticas. No hay servidor, no hay cuenta, no hay
cookies. Todo lo que pasa en la partida se pierde al cerrar la pestaña.

## Para usarla sin internet

Descarga [`index.html`](index.html) y ábrelo de un doble clic. Es un fichero suelto: los
instrumentos están dibujados dentro y no depende de nada externo salvo la tipografía, que
si no hay conexión se sustituye por otra sin que se rompa nada.

## Para tocarla

Todo está en ese único fichero, comentado en castellano. Después de cambiar cualquier
generador de preguntas:

```
node comprobar.js
```

Cuatro pruebas: cada pregunta suelta, tandas enteras de ocho buscando repeticiones, las
conversiones recalculadas leyendo el enunciado impreso, y el reparto de magnitudes y
saltos. Acaba diciendo si se puede llevar al aula o no.

---

El material impreso de la unidad —guion del profesor, hoja del alumno y tarjetas de los
cinco puestos— no está aquí: es material de trabajo del profesor y vive en un repositorio
privado. Este fichero es la única pieza pensada para que la abra el alumnado.
