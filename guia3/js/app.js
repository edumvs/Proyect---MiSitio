// ===== 1. Conexión =====
console.log('app.js conectado');

// ===== 2. Funciones de validación =====
function validarNombre(nombre) {
  const limpio = nombre.trim();
  if (limpio === '') return 'Escribe tu nombre.';
  if (limpio.length < 2) return 'Tu nombre debe tener al menos 2 letras.';
  return '';
}

function validarCelular(celular) {
  const limpio = celular.replace(/\s/g, '');
  if (limpio === '') return 'Escribe tu número de celular.';
  if (!/^9\d{8}$/.test(limpio)) {
    return 'El celular debe tener 9 dígitos y empezar con 9. Ejemplo: 987 654 321.';
  }
  return '';
}

function validarProducto(producto) {
  return producto === '' ? 'Elige un producto.' : '';
}

function validarCantidad(valor) {
  const cantidad = Number(valor);
  if (valor === '' || !Number.isInteger(cantidad) || cantidad < 1) {
    return 'La cantidad debe ser un número entero mayor que 0.';
  }
  if (cantidad > 100) return 'Para más de 100 unidades, llámanos por teléfono.';
  return '';
}

function validarFecha(fecha) {
  if (fecha === '') return 'Elige la fecha de recojo.';
  // Reto de autonomía: Validar que la fecha no sea pasada
  const hoyStr = new Date().toISOString().split('T')[0];
  if (fecha < hoyStr) {
    return 'La fecha de recojo no puede ser anterior a hoy.';
  }
  return '';
}

// ===== 4. Mostrar u ocultar un error =====
function mostrarError(id, mensaje) {
  const campo = document.getElementById(id);
  const error = document.getElementById('error-' + id);
  if (!error || !campo) return;
  
  error.textContent = mensaje;
  if (mensaje) {
    campo.setAttribute('aria-invalid', 'true');
  } else {
    campo.removeAttribute('aria-invalid');
  }
}

// ===== 5. Escuchar el envío del formulario =====
const formulario = document.querySelector('form');
const estado = document.getElementById('estado');

const reglas = [
  ['nombre', validarNombre],
  ['celular', validarCelular],
  ['producto', validarProducto],
  ['cantidad', validarCantidad],
  ['fecha', validarFecha],
];

if (formulario) {
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    let primerError = null;

    for (const [id, validar] of reglas) {
      const elemento = document.getElementById(id);
      const mensaje = validar(elemento ? elemento.value : '');
      mostrarError(id, mensaje);
      if (mensaje && primerError === null) primerError = id;
    }

    const acepta = document.getElementById('consentimiento').checked;
    const avisoConsentimiento = 'Necesitamos tu autorización para atender el pedido.';
    mostrarError('consentimiento', acepta ? '' : avisoConsentimiento);
    if (!acepta && primerError === null) primerError = 'consentimiento';

    if (primerError !== null) {
      estado.textContent = 'Revisa los campos marcados para continuar.';
      const campoError = document.getElementById(primerError);
      if (campoError) campoError.focus();
      return;
    }

    // Datos correctos y cálculo de precios (Reto de autonomía)
    const nombre = document.getElementById('nombre').value.trim();
    const producto = document.getElementById('producto').value;
    const cantidad = Number(document.getElementById('cantidad').value);
    const fecha = document.getElementById('fecha').value;

    const precios = {
      'Pan francés': 0.30,
      'Pan de yema': 0.50,
      'Chancay': 0.60,
      'Torta de chocolate': 45.00
    };

    const precioUnitario = precios[producto] || 0;
    const total = (precioUnitario * cantidad).toFixed(2);

    estado.textContent = `Gracias, ${nombre}. Recibimos tu pedido de ${cantidad} × ${producto} para el ${fecha}. Total a pagar: S/ ${total}. Te confirmaremos por WhatsApp.`;
    formulario.reset();
    
    reglas.forEach(([id]) => mostrarError(id, ''));
    mostrarError('consentimiento', '');
    const contador = document.getElementById('contador-caracteres');
    if (contador) contador.textContent = 'Te quedan 200 caracteres';
  });
}

// Reto de autonomía: Contador de caracteres
const notas = document.getElementById('notas');
const contador = document.getElementById('contador-caracteres');

if (notas && contador) {
  notas.addEventListener('input', function() {
    const restantes = 200 - notas.value.length;
    contador.textContent = `Te quedan ${restantes} caracteres`;
  });
}