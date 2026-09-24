/* Comprueba «El laboratorio de la pantalla» antes de llevarlo al aula.
 *
 *     node comprobar.js
 *
 * Son cuatro pruebas, y cada una nació de un fallo que se coló de verdad:
 *
 *   1 CADA PREGUNTA        que la respuesta correcta esté entre las opciones,
 *                          que la unidad buena esté entre las que se ofrecen,
 *                          que no salga NaN, y que el número que se imprime se
 *                          pueda teclear tal cual.
 *
 *   2 LAS TANDAS           se simulan partidas enteras de ocho, como las juega
 *                          un alumno, y se mira si alguna pregunta sale dos
 *                          veces. Había diez situaciones para ocho preguntas
 *                          sacadas al azar con reemplazo: se repetía en
 *                          cuarenta y nueve de cada cincuenta partidas, y el
 *                          banco de pruebas no lo veía porque medía las
 *                          preguntas de una en una.
 *
 *   3 LAS CONVERSIONES     se lee el enunciado impreso —«¿Cuántos X son N Y?»—
 *                          y se convierte aparte contando escalones. Que el
 *                          mismo código invente la pregunta y la respuesta no
 *                          prueba nada: si se equivoca, se equivoca dos veces
 *                          igual.
 *
 *   4 EL REPARTO           que salgan las tres magnitudes y los saltos en los
 *                          dos sentidos, no siempre lo mismo.
 *
 * Se lanza después de tocar cualquier generador, y desde luego antes de
 * ponerlo en los ordenadores del aula.
 */
const fs = require("fs");
const path = require("path");

const JUEGO = path.join(__dirname, "index.html");
const html = fs.readFileSync(JUEGO, "utf8");

/* La lógica del juego vive en un IIFE que toca el DOM al final. Se extrae
   todo lo anterior a la sección «portada», que es puro cálculo, y se ejecuta
   aquí con un document de mentira que no llega a usarse. */
const ini = html.indexOf('"use strict";');
const fin = html.indexOf("/* ---------------------------------------------------------- portada */");
if (ini < 0 || fin < 0) {
  console.error("No encuentro los límites del script dentro del HTML.\n" +
    "¿Le han cambiado los comentarios que los marcan?");
  process.exit(1);
}
const jaula = {};
new Function("o", "document",
  html.slice(ini + 13, fin) +
  "o.RETOS=RETOS;o.ESCALERAS=ESCALERAS;o.nf=nf;o.leerNumero=leerNumero;" +
  "o.vaciarBolsas=vaciarBolsas;o.RONDAS=RONDAS;"
)(jaula, { getElementById: () => ({}) });
const { RETOS, ESCALERAS, nf, leerNumero, vaciarBolsas, RONDAS } = jaula;

const POR_RETO = 4000, TANDAS = 3000;
const limpio = t => String(t).replace(/<[^>]+>/g, "");
const malo = v => {
  const t = String(v);
  return t.includes("NaN") || t.includes("undefined") || t.trim() === "";
};

let algoMal = false;
function informe(titulo, hechas, fallos) {
  const u = [...new Set(fallos)];
  if (!u.length) {
    console.log(titulo.padEnd(26) + String(hechas).padStart(7) + "  comprobaciones, sin fallos");
    return;
  }
  algoMal = true;
  console.log(titulo.padEnd(26) + String(hechas).padStart(7) + "  comprobaciones, " + fallos.length + " FALLOS");
  u.slice(0, 12).forEach(f => console.log("     x " + f));
  if (u.length > 12) console.log("     ... y " + (u.length - 12) + " más");
}

console.log("Comprobando el laboratorio de la pantalla\n");

/* ---------------------------------------------- 1 · cada pregunta suelta */
let fallos = [], hechas = 0;
for (const r of RETOS) {
  for (let i = 0; i < POR_RETO; i++) {
    hechas++;
    let q;
    try { q = r.gen(); } catch (e) { fallos.push(r.id + ": excepción " + e.message); continue; }
    if (malo(q.texto)) fallos.push(r.id + ": enunciado malo");

    if (q.tipo === "opciones") {
      if (q.opciones.indexOf(q.correcta) < 0) fallos.push(r.id + ": la correcta no está entre las opciones");
      if (new Set(q.opciones).size !== q.opciones.length) fallos.push(r.id + ": opciones repetidas");
      if (q.opciones.length < 2) fallos.push(r.id + ": menos de dos opciones");
      q.opciones.forEach(o => { if (malo(o)) fallos.push(r.id + ": opción mala"); });
    } else {
      if (!isFinite(q.valor)) fallos.push(r.id + ": valor no numérico");
      if (q.unidades.indexOf(q.unidad) < 0) fallos.push(r.id + ": «" + q.unidad + "» no está entre las unidades ofrecidas");
      if (new Set(q.unidades).size !== q.unidades.length) fallos.push(r.id + ": unidades repetidas");
      /* lo que se imprime tiene que poder teclearse y dar el mismo número */
      if (Math.abs(leerNumero(nf(q.valor, q.dec)) - q.valor) >= 0.001)
        fallos.push(r.id + ": vale " + q.valor + " pero se muestra «" + nf(q.valor, q.dec) + "»");
      const mult = Math.pow(10, q.dec);
      if (Math.abs(q.valor * mult - Math.round(q.valor * mult)) > 1e-9)
        fallos.push(r.id + ": " + q.valor + " tiene más decimales que los " + q.dec + " que declara");
      if (q.svg && !/^<svg /.test(q.svg)) fallos.push(r.id + ": el dibujo no es un svg");
    }
  }
}
informe("1 · Cada pregunta", hechas, fallos);

/* ------------------------------------------------------- 2 · las tandas */
fallos = []; hechas = 0;
/* una pregunta es su enunciado MÁS lo que hay que contestar: dos lecturas de
   la regla con longitudes distintas no son una repetición aunque el
   enunciado sea el mismo; la misma situación dos veces, sí */
const huella = q => String(q.texto) + " || " + (q.tipo === "opciones" ? q.correcta : q.valor);
for (const r of RETOS) {
  for (let t = 0; t < TANDAS; t++) {
    hechas++;
    vaciarBolsas();
    const vistas = [];
    for (let k = 0; k < RONDAS; k++) {
      /* el mismo bucle que hace siguiente(): generar y volver a tirar si esa
         pregunta ya ha salido en la tanda */
      let q, intentos = 0;
      do { q = r.gen(); intentos++; } while (vistas.indexOf(huella(q)) >= 0 && intentos < 40);
      vistas.push(huella(q));
    }
    const repes = vistas.filter((x, i) => vistas.indexOf(x) !== i);
    if (repes.length) fallos.push(r.id + ": se repite «" + limpio(repes[0]).slice(0, 60) + "»");
  }
}
informe("2 · Tandas de " + RONDAS, hechas, fallos);

/* -------------------------------------------------- 3 · las conversiones */
fallos = []; hechas = 0;
const saltos = {}, magnitudes = {};
const reto = RETOS.find(r => r.id === "escalera");
for (let i = 0; i < 20000; i++) {
  const q = reto.gen();
  const m = limpio(q.texto).match(/¿Cuántos (\S+) son ([\d,]+) (\S+)\?/);
  if (!m) { fallos.push("no entiendo el enunciado: " + limpio(q.texto)); continue; }
  const [, destino, cantidad, origen] = m;
  const esc = Object.values(ESCALERAS).find(e => e.us.includes(origen) && e.us.includes(destino));
  if (!esc) { fallos.push("unidades de escaleras distintas: " + origen + " y " + destino); continue; }

  const n = esc.us.indexOf(destino) - esc.us.indexOf(origen);   // + hacia abajo
  const esperado = Math.round(Number(cantidad.replace(",", ".")) * Math.pow(10, n) * 1000) / 1000;
  hechas++;
  if (Math.abs(esperado - q.valor) > 1e-9)
    fallos.push(cantidad + " " + origen + " → " + destino + ": dice " + q.valor + ", sale " + esperado);
  if (q.unidad !== destino) fallos.push("pide " + destino + " y la unidad correcta es " + q.unidad);
  if (q.valor <= 0 || q.valor > 100000) fallos.push("resultado fuera de rango: " + q.valor);

  const clave = Math.abs(n) + (n > 0 ? " abajo" : " arriba");
  saltos[clave] = (saltos[clave] || 0) + 1;
  magnitudes[esc.nombre] = (magnitudes[esc.nombre] || 0) + 1;
}
informe("3 · Conversiones", hechas, fallos);

/* ----------------------------------------------------- 4 · el reparto */
fallos = [];
for (const m of Object.keys(ESCALERAS)) {
  const parte = (magnitudes[m] || 0) / hechas;
  if (parte < 0.2) fallos.push("la magnitud «" + m + "» sale sólo el " + (parte * 100).toFixed(0) + " %");
}
["1 abajo", "1 arriba", "2 abajo", "2 arriba", "3 abajo", "3 arriba"].forEach(k => {
  if (!saltos[k]) fallos.push("nunca sale un salto de «" + k + "»");
});
informe("4 · Reparto", Object.keys(saltos).length + Object.keys(magnitudes).length, fallos);
console.log("     saltos: " + Object.entries(saltos).sort()
  .map(([k, v]) => k + " " + (v * 100 / hechas).toFixed(0) + "%").join(" · "));
console.log("     magnitudes: " + Object.entries(magnitudes)
  .map(([k, v]) => k + " " + (v * 100 / hechas).toFixed(0) + "%").join(" · "));

console.log();
if (algoMal) {
  console.log("HAY FALLOS. No lo lleves al aula todavía.");
  process.exit(1);
}
console.log("Todo cuadra. Se puede llevar al aula.");
