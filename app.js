// Clave que uso a usar para guardar los usuarios en localStorage
const STORAGE_KEY = "usuariosParcialP3";

// Capturo los formularios del DOM
const formRegistro = document.getElementById("formRegistro");
const formLogin = document.getElementById("formLogin");

// Capturo los botones
const btnRegistro = document.getElementById("btnRegistro");
const btnLogin = document.getElementById("btnLogin");

// Función que simula una petición a un servidor(fake request)
function fakeRequest(data) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1000);
    });
}

// Obtiene los usuarios guardados en localStorage
function obtenerUsuarios() {
    const usuariosGuardados = localStorage.getItem(STORAGE_KEY);

    if (usuariosGuardados === null) {
        return [];
    }

    return JSON.parse(usuariosGuardados);
}

// Guarda usuarios en localStorage
function guardarUsuarios(usuarios) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

// Muestra errores debajo de los campos
function mostrarError(idElemento, mensaje) {
    document.getElementById(idElemento).textContent = mensaje;
}

// Limpia todos los errores del formulario de registro
function limpiarErroresRegistro() {
    mostrarError("errorNombre", "");
    mostrarError("errorEmailRegistro", "");
    mostrarError("errorPasswordRegistro", "");
    mostrarError("errorConfirmarPassword", "");
    mostrarError("errorFechaNacimiento", "");
    mostrarError("errorTerminos", "");

    const mensaje = document.getElementById("mensajeRegistro");
    mensaje.textContent = "";
    mensaje.className = "mensaje";
}

// Limpia todos los errores del formulario de login
function limpiarErroresLogin() {
    mostrarError("errorEmailLogin", "");
    mostrarError("errorPasswordLogin", "");

    const mensaje = document.getElementById("mensajeLogin");
    mensaje.textContent = "";
    mensaje.className = "mensaje";
}

// Valida formato de email
function emailValido(email) {
    const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresion.test(email);
}

// Calcula si el usuario es mayor de 18 años
function esMayorDeEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mesActual = hoy.getMonth();
    const mesNacimiento = nacimiento.getMonth();

    if (
        mesActual < mesNacimiento ||
        (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())
    ) {
        edad--;
    }

    return edad >= 18;
}

// Valida todos los campos del registro
function validarRegistro(datos) {
    let valido = true;

    if (datos.nombre === "") {
        mostrarError("errorNombre", "El nombre y apellido es obligatorio.");
        valido = false;
    }

    if (datos.email === "") {
        mostrarError("errorEmailRegistro", "El email es obligatorio.");
        valido = false;
    } else if (!emailValido(datos.email)) {
        mostrarError("errorEmailRegistro", "El formato del email no es válido.");
        valido = false;
    }

    if (datos.password === "") {
        mostrarError("errorPasswordRegistro", "La contraseña es obligatoria.");
        valido = false;
    } else if (datos.password.length < 8) {
        mostrarError("errorPasswordRegistro", "La contraseña debe tener al menos 8 caracteres.");
        valido = false;
    } else if (!/\d/.test(datos.password)) {
        mostrarError("errorPasswordRegistro", "La contraseña debe incluir al menos un número.");
        valido = false;
    }

    if (datos.confirmarPassword === "") {
        mostrarError("errorConfirmarPassword", "Debe confirmar la contraseña.");
        valido = false;
    } else if (datos.password !== datos.confirmarPassword) {
        mostrarError("errorConfirmarPassword", "Las contraseñas no coinciden.");
        valido = false;
    }

    if (datos.fechaNacimiento === "") {
        mostrarError("errorFechaNacimiento", "La fecha de nacimiento es obligatoria.");
        valido = false;
    } else if (!esMayorDeEdad(datos.fechaNacimiento)) {
        mostrarError("errorFechaNacimiento", "El usuario debe ser mayor de 18 años.");
        valido = false;
    }

    if (!datos.terminos) {
        mostrarError("errorTerminos", "Debe aceptar los términos y condiciones.");
        valido = false;
    }

    return valido;
}

// Valida campos básicos del login
function validarLogin(datos) {
    let valido = true;

    if (datos.email === "") {
        mostrarError("errorEmailLogin", "El email es obligatorio.");
        valido = false;
    } else if (!emailValido(datos.email)) {
        mostrarError("errorEmailLogin", "El formato del email no es válido.");
        valido = false;
    }

    if (datos.password === "") {
        mostrarError("errorPasswordLogin", "La contraseña es obligatoria.");
        valido = false;
    }

    return valido;
}

// Proceso de registro
async function registrarUsuario(evento) {
    evento.preventDefault();

    limpiarErroresRegistro();

    const datosRegistro = {
        nombre: document.getElementById("nombre").value.trim(),
        email: document.getElementById("emailRegistro").value.trim().toLowerCase(),
        password: document.getElementById("passwordRegistro").value,
        confirmarPassword: document.getElementById("confirmarPassword").value,
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        terminos: document.getElementById("terminos").checked
    };

    const formularioValido = validarRegistro(datosRegistro);

    if (!formularioValido) {
        return;
    }

    const mensaje = document.getElementById("mensajeRegistro");

    mensaje.textContent = "Cargando...";
    mensaje.className = "mensaje cargando";
    btnRegistro.disabled = true;

    const datosProcesados = await fakeRequest(datosRegistro);

    const usuarios = obtenerUsuarios();

    const emailDuplicado = usuarios.some(usuario => usuario.email === datosProcesados.email);

    if (emailDuplicado) {
        mostrarError("errorEmailRegistro", "Ya existe un usuario registrado con ese email.");
        mensaje.textContent = "No se pudo registrar el usuario.";
        mensaje.className = "mensaje error";
        btnRegistro.disabled = false;
        return;
    }

    const nuevoUsuario = {
        nombre: datosProcesados.nombre,
        email: datosProcesados.email,
        password: datosProcesados.password,
        fechaNacimiento: datosProcesados.fechaNacimiento,
        fechaRegistro: new Date().toISOString()
    };

// Crea un usuario de prueba si todavía no existe
function crearUsuarioDePrueba() {
    const usuarios = obtenerUsuarios();

    const existeUsuarioPrueba = usuarios.some(usuario => usuario.email === "prueba@correo.com");

    if (!existeUsuarioPrueba) {
        const usuarioPrueba = {
            nombre: "Usuario de Prueba",
            email: "prueba@correo.com",
            password: "Prueba123",
            fechaNacimiento: "2000-01-01",
            fechaRegistro: new Date().toISOString()
        };

        usuarios.push(usuarioPrueba);
        guardarUsuarios(usuarios);
    }
}

// Ejecuta la creación del usuario de prueba al cargar la página
crearUsuarioDePrueba();   

    usuarios.push(nuevoUsuario);

    guardarUsuarios(usuarios);

    mensaje.textContent = "Usuario registrado correctamente.";
    mensaje.className = "mensaje exito";

    formRegistro.reset();
    btnRegistro.disabled = false;
}

// Proceso de login
async function iniciarSesion(evento) {
    evento.preventDefault();

    limpiarErroresLogin();

    const datosLogin = {
        email: document.getElementById("emailLogin").value.trim().toLowerCase(),
        password: document.getElementById("passwordLogin").value
    };

    const formularioValido = validarLogin(datosLogin);

    if (!formularioValido) {
        return;
    }

    const mensaje = document.getElementById("mensajeLogin");

    mensaje.textContent = "Cargando...";
    mensaje.className = "mensaje cargando";
    btnLogin.disabled = true;

    const datosProcesados = await fakeRequest(datosLogin);

    const usuarios = obtenerUsuarios();

    const usuarioEncontrado = usuarios.find(usuario => usuario.email === datosProcesados.email);

    if (!usuarioEncontrado) {
        mostrarError("errorEmailLogin", "No existe un usuario con ese email.");
        mensaje.textContent = "Acceso incorrecto.";
        mensaje.className = "mensaje error";
        btnLogin.disabled = false;
        return;
    }

    if (usuarioEncontrado.password !== datosProcesados.password) {
        mostrarError("errorPasswordLogin", "La contraseña no coincide.");
        mensaje.textContent = "Acceso incorrecto.";
        mensaje.className = "mensaje error";
        btnLogin.disabled = false;
        return;
    }

    mensaje.textContent = "Acceso correcto. Bienvenido/a " + usuarioEncontrado.nombre + ".";
    mensaje.className = "mensaje exito";

    formLogin.reset();
    btnLogin.disabled = false;
}

// Eventos principales
formRegistro.addEventListener("submit", registrarUsuario);
formLogin.addEventListener("submit", iniciarSesion);