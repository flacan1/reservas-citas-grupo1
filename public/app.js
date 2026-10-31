// =====================================================================
// Sistema de Reservas de Citas — Grupo 1
// Datos guardados en localStorage. Sin frameworks: HTML, CSS y JS puro.
// =====================================================================

// Credenciales fijas (requisito del proyecto)
const USUARIO_VALIDO = 'admin';
const PASSWORD_VALIDO = 'admin123';

// Claves de localStorage
const CLAVE_SESION = 'reservas_sesion';
const CLAVE_CITAS = 'reservas_citas';

// Horario de atención (validación adicional)
const HORA_APERTURA = '08:00';
const HORA_CIERRE = '17:00';

// ---------- Referencias al DOM ----------
const vistaLogin = document.getElementById('vista-login');
const panel = document.getElementById('panel');
const formLogin = document.getElementById('form-login');
const inputUsuario = document.getElementById('usuario');
const inputPassword = document.getElementById('password');
const loginError = document.getElementById('login-error');
const usuarioActual = document.getElementById('usuario-actual');
const btnLogout = document.getElementById('btn-logout');

const formCita = document.getElementById('form-cita');
const inputCliente = document.getElementById('cliente');
const inputFecha = document.getElementById('fecha');
const inputHora = document.getElementById('hora');
const mensaje = document.getElementById('mensaje');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const sinCitas = document.getElementById('sin-citas');
const contador = document.getElementById('contador-citas');

// ---------- Persistencia ----------
function leerCitas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CITAS)) || [];
  } catch (e) {
    return [];
  }
}

function guardarCitas(citas) {
  localStorage.setItem(CLAVE_CITAS, JSON.stringify(citas));
}

// ---------- Sesión ----------
function haySesion() {
  return localStorage.getItem(CLAVE_SESION) !== null;
}

function mostrarVista() {
  if (haySesion()) {
    vistaLogin.classList.add('oculto');
    panel.classList.remove('oculto');
    usuarioActual.textContent = 'Usuario: ' + localStorage.getItem(CLAVE_SESION);
    renderizarTabla();
  } else {
    panel.classList.add('oculto');
    vistaLogin.classList.remove('oculto');
  }
}

formLogin.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const usuario = inputUsuario.value.trim();
  const password = inputPassword.value;

  if (usuario === USUARIO_VALIDO && password === PASSWORD_VALIDO) {
    localStorage.setItem(CLAVE_SESION, usuario);
    loginError.classList.add('oculto');
    formLogin.reset();
    mostrarVista();
  } else {
    loginError.textContent = 'Usuario o contraseña incorrectos';
    loginError.classList.remove('oculto');
  }
});

btnLogout.addEventListener('click', () => {
  localStorage.removeItem(CLAVE_SESION);
  ocultarMensaje();
  mostrarVista();
});

// ---------- Mensajes ----------
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = 'mensaje ' + (tipo === 'error' ? 'mensaje-error' : 'mensaje-exito');
}

function ocultarMensaje() {
  mensaje.textContent = '';
  mensaje.className = 'mensaje oculto';
}

// ---------- Validación y regla de negocio ----------
// Devuelve un texto de error, o null si la cita es válida.
function validarCita(cliente, fecha, hora, citas) {
  if (cliente === '') return 'El nombre del cliente es obligatorio';
  if (cliente.length < 3) return 'El nombre del cliente debe tener al menos 3 caracteres';
  if (fecha === '') return 'La fecha es obligatoria';
  if (hora === '') return 'La hora es obligatoria';
  if (hora < HORA_APERTURA || hora > HORA_CIERRE) {
    return 'La hora debe estar dentro del horario de atención (08:00 a 17:00)';
  }

  // REGLA DE NEGOCIO: no se permiten dos citas con la misma fecha y hora (traslape)
  // const ocupado = citas.some((c) => c.fecha === fecha && c.hora === hora);
  // if (ocupado) return 'Ya existe una cita para esa fecha y hora';

  return null;
}

formCita.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const cliente = inputCliente.value.trim();
  const fecha = inputFecha.value;
  const hora = inputHora.value;
  const citas = leerCitas();

  const error = validarCita(cliente, fecha, hora, citas);
  if (error) {
    mostrarMensaje(error, 'error');
    return;
  }

  citas.push({ id: Date.now().toString(), cliente, fecha, hora });
  guardarCitas(citas);
  formCita.reset();
  mostrarMensaje('Cita agendada correctamente', 'exito');
  renderizarTabla();
});

// ---------- Cancelar ----------
function cancelarCita(id) {
  const citas = leerCitas().filter((c) => c.id !== id);
  guardarCitas(citas);
  mostrarMensaje('Cita cancelada', 'exito');
  renderizarTabla();
}

// ---------- Tabla ----------
function renderizarTabla() {
  const citas = leerCitas().sort((a, b) =>
    (a.fecha + a.hora).localeCompare(b.fecha + b.hora)
  );

  cuerpoTabla.innerHTML = '';

  citas.forEach((cita) => {
    const fila = document.createElement('tr');
    fila.className = 'fila-cita';
    fila.dataset.id = cita.id;

    const tdCliente = document.createElement('td');
    tdCliente.className = 'col-cliente';
    tdCliente.textContent = cita.cliente;

    const tdFecha = document.createElement('td');
    tdFecha.className = 'col-fecha';
    tdFecha.textContent = cita.fecha;

    const tdHora = document.createElement('td');
    tdHora.className = 'col-hora';
    tdHora.textContent = cita.hora;

    const tdAccion = document.createElement('td');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-cancelar';
    btn.textContent = 'Cancelar';
    btn.addEventListener('click', () => cancelarCita(cita.id));
    tdAccion.appendChild(btn);

    fila.append(tdCliente, tdFecha, tdHora, tdAccion);
    cuerpoTabla.appendChild(fila);
  });

  contador.textContent = citas.length;
  sinCitas.classList.toggle('oculto', citas.length > 0);
}

// Al cargar la página
mostrarVista();
