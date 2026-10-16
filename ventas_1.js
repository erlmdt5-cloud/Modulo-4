/**
 * ventas.js — Módulo de Lógica de Ventas
 * Responsabilidad: SOLO reglas de negocio sobre ventas.
 * Sin tablas. Sin localStorage.
 */

const Ventas = (() => {

  // ── Creación ───────────────────────────────────────────────
  /** Construye un objeto de venta a partir de un producto y precio de venta. */
  function crear(producto, precioVenta) {
    const ahora = new Date();
    const pv    = parseFloat(precioVenta);
    return {
      id      : Date.now(),
      cod     : producto.codigo,
      nombre  : producto.nombre,
      talla   : producto.talla,
      costo   : producto.precio,
      venta   : pv,
      ganancia: parseFloat((pv - producto.precio).toFixed(2)),
      fecha   : ahora.toLocaleDateString('es-GT'),
      hora    : ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // ── Búsqueda ───────────────────────────────────────────────
  function buscarPorId(lista, id) {
    return lista.find(v => v.id === id) || null;
  }

  function eliminarPorId(lista, id) {
    return lista.filter(v => v.id !== id);
  }

  // ── Contador de unidades vendidas ──────────────────────────
  function _talla(t) { return String(t == null ? '' : t).trim().replace(/\s+/g, ' ').toUpperCase(); }

  /**
   * Unidades vendidas de un producto. Con talla: solo esa variante;
   * sin talla: todas las tallas del código. Las ventas anuladas ya no
   * están en la lista, así que no cuentan.
   */
  function contarVendidos(lista, codigo, talla) {
    const c = String(codigo || '').trim();
    const t = talla === undefined ? null : _talla(talla);
    return lista.filter(v =>
      String(v.cod).trim() === c && (t === null || _talla(v.talla) === t)
    ).length;
  }

  // ── Cálculo de totales ─────────────────────────────────────
  function calcularTotales(lista) {
    return lista.reduce(
      (acc, v) => ({
        totalVentas  : acc.totalVentas   + v.venta,
        totalCosto   : acc.totalCosto    + v.costo,
        totalGanancia: acc.totalGanancia + v.ganancia
      }),
      { totalVentas: 0, totalCosto: 0, totalGanancia: 0 }
    );
  }

  // ── Ticket de texto ────────────────────────────────────────
  function generarTicketTexto(venta) {
    return [
      '╔══════════════════════════════╗',
      '║       TICKET DE VENTA        ║',
      '╚══════════════════════════════╝',
      `  Fecha   : ${venta.fecha}`,
      `  Hora    : ${venta.hora}`,
      '  ──────────────────────────────',
      `  Producto : ${venta.nombre}`,
      `  Talla    : ${venta.talla}`,
      `  Precio   : $${venta.venta.toFixed(2)}`,
      '  ──────────────────────────────',
      '       ¡Gracias por su compra!  ',
      ''
    ].join('\n');
  }

  return { crear, buscarPorId, eliminarPorId, contarVendidos, calcularTotales, generarTicketTexto };
})();
