var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var pantallaUsuarios;
(function (pantallaUsuarios_1) {
    let eColumna;
    (function (eColumna) {
        eColumna[eColumna["Nombre"] = 1] = "Nombre";
        eColumna[eColumna["APaterno"] = 2] = "APaterno";
        eColumna[eColumna["AMaterno"] = 3] = "AMaterno";
        eColumna[eColumna["Telefono"] = 4] = "Telefono";
        eColumna[eColumna["Fecha"] = 5] = "Fecha";
    })(eColumna = pantallaUsuarios_1.eColumna || (pantallaUsuarios_1.eColumna = {}));
    class pantallaUsuarios {
        constructor() {
            this.usuariosMapeados = new Map();
            this.usuariosOriginales = new Map(); // NUEVO: Copia de seguridad 
            this.usuariosHistorial = new Map(); // NUEVO: Historial de cambios
            this.usuarioAEliminar = null;
            this.mostrarVentanaPrincipal = false;
            this.ventanaEliminacionCreada = false;
            this.ventanaCreada = false;
            this.clickAnterior = { columna: 0, direccion: 0 };
            this.formatTime = d3.utcFormat("%d %B, %Y");
            this.crearVentanaPrincipal();
            this.crearTablaEncabezado();
            this.cargarUsuariosDesdeJSON();
        }
        // MODIFICADO: Cargar usuarios iniciales con copias de seguridad
        cargarUsuariosDesdeJSON() {
            return __awaiter(this, void 0, void 0, function* () {
                const respuesta = yield fetch("usuarios.json");
                const datos = yield respuesta.json();
                // Cargar datos principales
                this.usuariosMapeados = new Map(datos.map(usuario => [usuario.id, Object.assign(Object.assign({}, usuario), { fecha: new Date(usuario.fecha), eModificado: false })]));
                // NUEVO: Crear copias de seguridad
                this.crearCopiaSeguridadUsuarios();
                console.log(`✅ Cargados ${datos.length} usuarios iniciales`);
                this.actualizarArrayUsuarios();
            });
        }
        // NUEVO: Crear copia de seguridad de usuarios
        crearCopiaSeguridadUsuarios() {
            this.usuariosOriginales.clear();
            this.usuariosHistorial.clear();
            this.usuariosMapeados.forEach((usuario, id) => {
                // Copia para originales
                this.usuariosOriginales.set(id, Object.assign(Object.assign({}, usuario), { fecha: new Date(usuario.fecha.getTime()) }));
                // Inicializar historial
                this.usuariosHistorial.set(id, [Object.assign(Object.assign({}, usuario), { fecha: new Date(usuario.fecha.getTime()) })]);
            });
        }
        // NUEVO: Comparar si dos personas son iguales (datos principales)
        datosPersonaIguales(persona1, persona2) {
            return (persona1.id === persona2.id &&
                persona1.nombre === persona2.nombre &&
                persona1.aPaterno === persona2.aPaterno &&
                persona1.aMaterno === persona2.aMaterno &&
                persona1.telefono === persona2.telefono &&
                persona1.fecha.getTime() === persona2.fecha.getTime());
        }
        // NUEVO: Verificar si un usuario tiene cambios
        usuarioTieneCambios(usuarioExistente, usuarioNuevo) {
            return (usuarioExistente.nombre !== usuarioNuevo.nombre ||
                usuarioExistente.aPaterno !== usuarioNuevo.aPaterno ||
                usuarioExistente.aMaterno !== usuarioNuevo.aMaterno ||
                usuarioExistente.telefono !== usuarioNuevo.telefono ||
                usuarioExistente.fecha.getTime() !== usuarioNuevo.fecha.getTime());
        }
        // NUEVO: Agregar usuario completamente nuevo
        agregarUsuarioNuevo(usuario) {
            console.log(`➕ Agregando nuevo usuario: ${usuario.nombre} ${usuario.aPaterno} (ID: ${usuario.id})`);
            // Agregar al mapa principal
            this.usuariosMapeados.set(usuario.id, usuario);
            // Agregar a originales
            this.usuariosOriginales.set(usuario.id, Object.assign({}, usuario));
            // Inicializar historial
            this.usuariosHistorial.set(usuario.id, [Object.assign({}, usuario)]);
        }
        // NUEVO: Actualizar usuario existente
        actualizarUsuarioExistente(usuarioExistente, usuarioNuevo) {
            console.log(`🔄 Actualizando usuario: ${usuarioNuevo.nombre} ${usuarioNuevo.aPaterno} (ID: ${usuarioNuevo.id})`);
            // Agregar al historial antes de actualizar
            const historial = this.usuariosHistorial.get(usuarioExistente.id) || [];
            historial.push(Object.assign({}, usuarioExistente));
            this.usuariosHistorial.set(usuarioExistente.id, historial);
            // Mostrar cambios específicos
            this.mostrarCambiosEspecificos(usuarioExistente, usuarioNuevo);
            // Marcar como modificado
            usuarioNuevo.eModificado = true;
            // Actualizar en el mapa principal
            this.usuariosMapeados.set(usuarioNuevo.id, usuarioNuevo);
        }
        // NUEVO: Mostrar cambios específicos de un usuario
        mostrarCambiosEspecificos(anterior, nuevo) {
            const cambios = [];
            if (anterior.nombre !== nuevo.nombre) {
                cambios.push(`Nombre: "${anterior.nombre}" → "${nuevo.nombre}"`);
            }
            if (anterior.aPaterno !== nuevo.aPaterno) {
                cambios.push(`A.Paterno: "${anterior.aPaterno}" → "${nuevo.aPaterno}"`);
            }
            if (anterior.aMaterno !== nuevo.aMaterno) {
                cambios.push(`A.Materno: "${anterior.aMaterno}" → "${nuevo.aMaterno}"`);
            }
            if (anterior.telefono !== nuevo.telefono) {
                cambios.push(`Teléfono: ${anterior.telefono} → ${nuevo.telefono}`);
            }
            if (anterior.fecha.getTime() !== nuevo.fecha.getTime()) {
                cambios.push(`Fecha: ${this.formatTime(anterior.fecha)} → ${this.formatTime(nuevo.fecha)}`);
            }
            if (cambios.length > 0) {
                console.log(`   Cambios: ${cambios.join(', ')}`);
            }
        }
        // NUEVO: Procesar datos apilados (núcleo del sistema)
        procesarDatosApilados(datosNuevos) {
            const resultado = {
                nuevos: 0,
                actualizados: 0,
                sinCambios: 0,
                totalCambios: 0,
                detalles: {
                    nuevos: [],
                    actualizados: [],
                    sinCambios: []
                }
            };
            datosNuevos.forEach(usuarioNuevo => {
                const usuarioConFecha = Object.assign(Object.assign({}, usuarioNuevo), { fecha: new Date(usuarioNuevo.fecha), eModificado: false });
                const usuarioExistente = this.usuariosMapeados.get(usuarioNuevo.id);
                if (!usuarioExistente) {
                    // NUEVO: No existe, agregarlo
                    this.agregarUsuarioNuevo(usuarioConFecha);
                    resultado.nuevos++;
                    resultado.detalles.nuevos.push(usuarioConFecha);
                }
                else if (this.usuarioTieneCambios(usuarioExistente, usuarioConFecha)) {
                    // ACTUALIZAR: Existe pero tiene cambios
                    this.actualizarUsuarioExistente(usuarioExistente, usuarioConFecha);
                    resultado.actualizados++;
                    resultado.detalles.actualizados.push(usuarioConFecha);
                }
                else {
                    // SIN CAMBIOS: Existe y es igual
                    resultado.sinCambios++;
                    resultado.detalles.sinCambios.push(usuarioConFecha);
                }
            });
            resultado.totalCambios = resultado.nuevos + resultado.actualizados;
            return resultado;
        }
        // NUEVO: Mostrar resumen de cambios
        mostrarResumenCambios(resultado) {
            console.log('\n=== RESUMEN DE CAMBIOS ===');
            console.log(`✅ Usuarios nuevos: ${resultado.nuevos}`);
            console.log(`🔄 Usuarios actualizados: ${resultado.actualizados}`);
            console.log(`➖ Sin cambios: ${resultado.sinCambios}`);
            console.log(`📊 Total de cambios: ${resultado.totalCambios}`);
            // Mostrar detalles de nuevos
            if (resultado.detalles.nuevos.length > 0) {
                console.log('\n👥 USUARIOS NUEVOS:');
                resultado.detalles.nuevos.forEach((u) => {
                    console.log(`   • ${u.nombre} ${u.aPaterno} (ID: ${u.id})`);
                });
            }
            // Mostrar detalles de actualizados
            if (resultado.detalles.actualizados.length > 0) {
                console.log('\n📝 USUARIOS ACTUALIZADOS:');
                resultado.detalles.actualizados.forEach((u) => {
                    console.log(`   • ${u.nombre} ${u.aPaterno} (ID: ${u.id})`);
                });
            }
            // Mostrar mensaje visual
            this.mostrarMensajeEstado(`✅ ${resultado.totalCambios} cambios aplicados`, "success");
        }
        // NUEVO: Mostrar mensajes de estado
        mostrarMensajeEstado(mensaje, tipo) {
            const colores = {
                success: "#28a745",
                error: "#dc3545",
                info: "#17a2b8"
            };
            const mensajeDiv = this.ventanaPrincipal.append("div")
                .style("position", "absolute")
                .style("top", "60px")
                .style("right", "10px")
                .style("background-color", colores[tipo])
                .style("color", "white")
                .style("padding", "10px 15px")
                .style("border-radius", "4px")
                .style("font-size", "14px")
                .style("z-index", "1000")
                .style("box-shadow", "0 2px 5px rgba(0,0,0,0.2)")
                .text(mensaje);
            // Auto-eliminar después de 3 segundos
            setTimeout(() => {
                mensajeDiv.transition()
                    .duration(300)
                    .style("opacity", "0")
                    .remove();
            }, 3000);
        }
        // NUEVO: Obtener estadísticas del sistema
        obtenerEstadisticas() {
            const usuariosModificados = Array.from(this.usuariosMapeados.values())
                .filter(u => u.eModificado).length;
            return {
                totalUsuarios: this.usuariosMapeados.size,
                usuariosModificados: usuariosModificados,
                usuariosOriginales: this.usuariosOriginales.size,
                usuariosConHistorial: this.usuariosHistorial.size
            };
        }
        // MODIFICADO: Método sincronizarJson con sistema de apilado
        sincronizarJson() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log('🔄 Iniciando sincronización con apilado...');
                    const respuesta = yield fetch("usuarios.json?" + Date.now());
                    const datosNuevos = yield respuesta.json();
                    console.log(`📥 Procesando ${datosNuevos.length} registros del JSON...`);
                    // Procesar datos con sistema de apilado
                    const resultado = this.procesarDatosApilados(datosNuevos);
                    // Actualizar vista solo si hay cambios
                    if (resultado.totalCambios > 0) {
                        this.actualizarArrayUsuarios();
                        this.mostrarResumenCambios(resultado);
                        // Actualizar copia de seguridad
                        this.actualizarCopiaSeguridadApilada();
                    }
                    else {
                        this.mostrarMensajeEstado("ℹ️ Sin cambios nuevos", "info");
                    }
                    // Mostrar estadísticas finales
                    const stats = this.obtenerEstadisticas();
                    console.log('\n📊 ESTADÍSTICAS FINALES:');
                    console.log(`Total usuarios en sistema: ${stats.totalUsuarios}`);
                    console.log(`Usuarios modificados: ${stats.usuariosModificados}`);
                    console.log(`Usuarios con historial: ${stats.usuariosConHistorial}`);
                }
                catch (error) {
                    console.error("❌ Error al sincronizar:", error);
                    this.mostrarMensajeEstado("❌ Error al cargar datos", "error");
                }
            });
        }
        // NUEVO: Actualizar copia de seguridad después del apilado
        actualizarCopiaSeguridadApilada() {
            // Solo actualizar los que realmente cambiaron
            this.usuariosMapeados.forEach((usuario, id) => {
                if (usuario.eModificado || !this.usuariosOriginales.has(id)) {
                    this.usuariosOriginales.set(id, Object.assign(Object.assign({}, usuario), { eModificado: false // Reset flag en la copia
                     }));
                }
            });
        }
        // NUEVO: Obtener historial de cambios de un usuario
        obtenerHistorialUsuario(id) {
            return this.usuariosHistorial.get(id) || [];
        }
        // NUEVO: Verificar si existe usuario por ID
        existeUsuario(id) {
            return this.usuariosMapeados.has(id);
        }
        // NUEVO: Restaurar usuario a versión anterior
        restaurarUsuario(id, versionIndex = -2) {
            const historial = this.usuariosHistorial.get(id);
            if (!historial || historial.length < 2) {
                console.log(`No hay historial suficiente para restaurar usuario ID: ${id}`);
                return false;
            }
            // -2 porque -1 es la versión actual, -2 es la anterior
            const versionAnterior = historial[historial.length + versionIndex];
            if (versionAnterior) {
                this.usuariosMapeados.set(id, Object.assign({}, versionAnterior));
                console.log(`Usuario ID: ${id} restaurado a versión anterior`);
                this.actualizarArrayUsuarios();
                return true;
            }
            return false;
        }
        // RESTO DEL CÓDIGO ORIGINAL (sin cambios)...
        crearVentanaPrincipal() {
            this.ventanaPrincipal = d3.select("body")
                .append("div")
                .attr("id", "ventana")
                .style("width", "800px")
                .style("height", "700px")
                .style("overflow", "auto")
                .style("padding", "10px")
                .style("background-color", "#f0f0f0")
                .style("border", "1px solid #ccc")
                .style("position", "relative");
            this.ventanaPrincipal.append("h3")
                .text("Directorio de Personas")
                .style("margin-top", "0");
            const contSuperior = this.ventanaPrincipal.append("div")
                .style("display", "flex")
                .style("justify-content", "space-between")
                .style("align-items", "center")
                .style("gap", "10px")
                .style("margin", "10px 0");
            contSuperior.append("div")
                .style("flex-grow", "1")
                .style("margin-right", "20px")
                .call(div => {
                this.txtBusqueda = div.append("input")
                    .attr("type", "text")
                    .attr("id", "filtro-input")
                    .attr("placeholder", "Buscar persona...")
                    .style("width", "100%")
                    .style("padding", "10px 15px")
                    .style("border", "1px solid #ddd")
                    .style("border-radius", "6px")
                    .style("font-size", "14px")
                    .style("box-sizing", "border-box")
                    .style("transition", "border-color 0.3s ease")
                    .on("focus", function () {
                    d3.select(this).style("border-color", "#007BFF");
                })
                    .on("blur", function () {
                    d3.select(this).style("border-color", "#ddd");
                })
                    .on("keyup", () => {
                    this.actualizarArrayUsuarios();
                });
            });
            const contenedorBotones = contSuperior.append("div")
                .style("display", "flex")
                .style("gap", "12px")
                .style("align-items", "center");
            contenedorBotones.append("button")
                .html(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                            <path d="M8 16l-5 5v-5h5"/>
                        </svg>`)
                .style("padding", "10px 16px")
                .style("background-color", "#007BFF")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "6px")
                .style("cursor", "pointer")
                .style("font-size", "14px")
                .style("font-weight", "500")
                .style("display", "inline-flex")
                .style("align-items", "center")
                .style("gap", "8px")
                .style("transition", "background-color 0.3s ease")
                .on("mouseover", function () {
                d3.select(this).style("background-color", "#0056b3");
            })
                .on("mouseout", function () {
                d3.select(this).style("background-color", "#007BFF");
            })
                .on("click", () => this.sincronizarJson());
            contenedorBotones.append("button")
                .text("Agregar Persona")
                .style("padding", "10px 16px")
                .style("background-color", "#28a745")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "6px")
                .style("cursor", "pointer")
                .style("font-size", "14px")
                .style("font-weight", "500")
                .style("transition", "background-color 0.3s ease")
                .on("mouseover", function () {
                d3.select(this).style("background-color", "#218838");
            })
                .on("mouseout", function () {
                d3.select(this).style("background-color", "#28a745");
            })
                .on("click", () => this.AbrirFormulario(null));
            this.ventanaPrincipal.append("button")
                .text("X")
                .style("position", "absolute")
                .style("top", "5px")
                .style("right", "5px")
                .style("border", "none")
                .style("background", "transparent")
                .style("font-weight", "bold")
                .style("cursor", "pointer")
                .on("click", () => this.alternarVentanaPrincipal());
        }
        crearTablaEncabezado() {
            this.contenedorTabla = this.ventanaPrincipal.append("div")
                .attr("class", "tabla-container")
                .style("margin-top", "10px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "4px")
                .style("overflow", "hidden");
            const encabezado = this.contenedorTabla.append("div")
                .style("display", "grid")
                .style("grid-template-columns", "90px repeat(5, 1fr)")
                .style("border-bottom", "10px solid #f0f0f0")
                .style("padding", "10px")
                .style("color", "#fff")
                .style("background-color", "#454545");
            encabezado.append("div")
                .attr("class", "titulo-columna")
                .style("text-align", "center")
                .style("font-weight", "bold")
                .style("user-select", "none")
                .style("cursor", "default")
                .text("Acciones");
            encabezado.append("div")
                .attr("id", "columna-Nombre")
                .attr("class", "titulo-columna")
                .style("text-align", "center")
                .style("font-weight", "bold")
                .style("user-select", "none")
                .style("cursor", "pointer")
                .text("Nombre")
                .on("click", () => this.actualizarArrayUsuarios(1));
            encabezado.append("div")
                .attr("id", "columna-aPaterno")
                .attr("class", "titulo-columna")
                .style("text-align", "center")
                .style("font-weight", "bold")
                .style("user-select", "none")
                .style("cursor", "pointer")
                .text("Apellido Paterno")
                .on("click", () => this.actualizarArrayUsuarios(2));
            encabezado.append("div")
                .attr("id", "columna-aMaterno")
                .attr("class", "titulo-columna")
                .style("text-align", "center")
                .style("font-weight", "bold")
                .style("user-select", "none")
                .style("cursor", "pointer")
                .text("Apellido Materno")
                .on("click", () => this.actualizarArrayUsuarios(3));
            encabezado.append("div")
                .attr("id", "columna-telefono")
                .attr("class", "titulo-columna")
                .style("text-align", "center")
                .style("font-weight", "bold")
                .style("user-select", "none")
                .style("cursor", "pointer")
                .text("Teléfono")
                .on("click", () => this.actualizarArrayUsuarios(4));
            encabezado.append("div")
                .attr("id", "columna-fecha")
                .attr("class", "titulo-columna")
                .style("text-align", "center")
                .style("font-weight", "bold")
                .style("user-select", "none")
                .style("cursor", "pointer")
                .text("Fecha")
                .on("click", () => this.actualizarArrayUsuarios(5));
        }
        crearCamposFormulario() {
            const grupoNombre = this.formularioPersona.append("div")
                .style("margin-bottom", "15px");
            grupoNombre.append("label")
                .attr("for", "input-nombre")
                .text("Nombre:")
                .style("display", "block")
                .style("font-weight", "bold")
                .style("margin-bottom", "5px");
            this.txtNombre = grupoNombre.append("input")
                .attr("type", "text")
                .attr("id", "input-nombre")
                .attr("placeholder", "Ingrese el nombre")
                .style("width", "98%")
                .attr("required", true)
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "4px")
                .attr("value", "");
            const grupoPaterno = this.formularioPersona.append("div")
                .style("margin-bottom", "15px");
            grupoPaterno.append("label")
                .attr("for", "input-aPaterno")
                .text("Apellido Paterno:")
                .style("display", "block")
                .style("font-weight", "bold")
                .style("margin-bottom", "5px");
            this.txtAPaterno = grupoPaterno.append("input")
                .attr("type", "text")
                .attr("id", "input-aPaterno")
                .attr("placeholder", "Ingrese el apellido paterno")
                .style("width", "98%")
                .attr("required", true)
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .attr("value", "")
                .style("border-radius", "4px");
            const grupoMaterno = this.formularioPersona.append("div")
                .style("margin-bottom", "15px");
            grupoMaterno.append("label")
                .attr("for", "input-aMaterno")
                .text("Apellido Materno:")
                .style("display", "block")
                .style("font-weight", "bold")
                .style("margin-bottom", "5px");
            this.txtAMaterno = grupoMaterno.append("input")
                .attr("type", "text")
                .attr("id", "input-aMaterno")
                .attr("placeholder", "Ingrese el apellido materno")
                .style("width", "98%")
                .attr("required", true)
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .attr("value", "")
                .style("border-radius", "4px");
            const grupoTelefono = this.formularioPersona.append("div")
                .style("margin-bottom", "15px");
            grupoTelefono.append("label")
                .attr("for", "input-telefono")
                .text("Teléfono:")
                .style("display", "block")
                .style("font-weight", "bold")
                .style("margin-bottom", "5px");
            this.txtTelefono = grupoTelefono.append("input")
                .attr("type", "text")
                .attr("id", "input-telefono")
                .attr("placeholder", "Ingrese el teléfono")
                .style("width", "98%")
                .attr("required", true)
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .attr("value", "")
                .style("border-radius", "4px");
            const grupoFecha = this.formularioPersona.append("div")
                .style("margin-bottom", "20px");
            grupoFecha.append("label")
                .attr("for", "input-fecha")
                .text("Fecha:")
                .style("display", "block")
                .style("font-weight", "bold")
                .style("margin-bottom", "5px");
            this.txtFecha = grupoFecha.append("input")
                .attr("type", "date")
                .attr("id", "input-fecha")
                .style("width", "98%")
                .attr("required", true)
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .attr("value", "")
                .style("border-radius", "4px");
            this.formularioPersona.append("button")
                .text("Guardar")
                .style("padding", "10px 20px")
                .style("background-color", "#007BFF")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "4px")
                .style("cursor", "pointer")
                .on("click", () => {
                this.GuardarFormulario();
            });
        }
        crearFormularioPersona() {
            this.ventanaCreada = true;
            this.CapaBloqueo = this.ventanaPrincipal.append("div")
                .attr("id", "modal-editar")
                .style("position", "absolute")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0, 0, 0, 0.6)")
                .style("display", "none")
                .style("z-index", "999");
            this.formularioPersona = this.CapaBloqueo
                .append("div")
                .attr("id", "formulario")
                .style("width", "500px")
                .style("max-width", "90%")
                .style("padding", "24px")
                .style("background-color", "#fff")
                .style("border-radius", "12px")
                .style("box-shadow", "0 8px 16px rgba(0, 0, 0, 0.2)")
                .style("position", "absolute")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("display", "flex")
                .style("flex-direction", "column");
            this.formularioPersona.append("h3")
                .text("Agregar Personas")
                .style("margin", "0 0 20px 0")
                .style("font-size", "22px")
                .style("color", "#333")
                .style("text-align", "center");
            this.formularioPersona.append("button")
                .text("X")
                .style("position", "absolute")
                .style("top", "10px")
                .style("right", "15px")
                .style("background", "transparent")
                .style("border", "none")
                .style("font-size", "20px")
                .style("font-weight", "bold")
                .style("color", "#999")
                .style("cursor", "pointer")
                .on("click", () => this.CerrarFormulario());
            this.crearCamposFormulario();
        }
        crearVentanaEliminacion() {
            this.ventanaEliminacionCreada = true;
            if (!this.CapaBloqueo) {
                this.CapaBloqueo = this.ventanaPrincipal.append("div")
                    .attr("id", "overlay-modal")
                    .style("position", "absolute")
                    .style("top", "0")
                    .style("left", "0")
                    .style("width", "100%")
                    .style("height", "100%")
                    .style("background-color", "rgba(0, 0, 0, 0.6)")
                    .style("display", "none")
                    .style("z-index", "999");
            }
            this.ventanaEliminacion = this.ventanaPrincipal.append("div")
                .attr("id", "modal-eliminacion")
                .style("position", "absolute")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("background-color", "#fff")
                .style("padding", "24px")
                .style("border-radius", "12px")
                .style("box-shadow", "0 8px 16px rgba(0,0,0,0.25)")
                .style("z-index", "1001")
                .style("width", "350px")
                .style("text-align", "center")
                .style("display", "none");
            this.ventanaEliminacion.append("h3")
                .text("Confirmar Eliminación")
                .style("margin", "0 0 15px 0")
                .style("color", "#dc3545")
                .style("font-size", "18px");
            this.ventanaEliminacion.append("p")
                .attr("id", "texto-confirmacion")
                .style("margin-bottom", "25px")
                .style("font-size", "16px")
                .style("color", "#333")
                .style("line-height", "1.4");
            const contenedorBotones = this.ventanaEliminacion.append("div")
                .style("display", "flex")
                .style("justify-content", "space-around")
                .style("gap", "15px");
            contenedorBotones.append("button")
                .text("Cancelar")
                .style("background-color", "#6c757d")
                .style("color", "white")
                .style("border", "none")
                .style("padding", "10px 20px")
                .style("border-radius", "6px")
                .style("cursor", "pointer")
                .style("font-size", "14px")
                .style("min-width", "80px")
                .style("transition", "background-color 0.3s")
                .on("mouseover", function () {
                d3.select(this).style("background-color", "#5a6268");
            })
                .on("mouseout", function () {
                d3.select(this).style("background-color", "#6c757d");
            })
                .on("click", () => {
                this.cerrarVentanaEliminacion();
            });
            contenedorBotones.append("button")
                .text("Eliminar")
                .style("background-color", "#dc3545")
                .style("color", "white")
                .style("border", "none")
                .style("padding", "10px 20px")
                .style("border-radius", "6px")
                .style("cursor", "pointer")
                .style("font-size", "14px")
                .style("min-width", "80px")
                .style("transition", "background-color 0.3s")
                .on("mouseover", function () {
                d3.select(this).style("background-color", "#c82333");
            })
                .on("mouseout", function () {
                d3.select(this).style("background-color", "#dc3545");
            })
                .on("click", () => {
                this.confirmarEliminacion();
            });
            this.ventanaEliminacion.append("button")
                .text("×")
                .style("position", "absolute")
                .style("top", "10px")
                .style("right", "15px")
                .style("background", "transparent")
                .style("border", "none")
                .style("font-size", "20px")
                .style("font-weight", "bold")
                .style("color", "#999")
                .style("cursor", "pointer")
                .style("line-height", "1")
                .on("mouseover", function () {
                d3.select(this).style("color", "#333");
            })
                .on("mouseout", function () {
                d3.select(this).style("color", "#999");
            })
                .on("click", () => {
                this.cerrarVentanaEliminacion();
            });
            this.CapaBloqueo.on("click", (event) => {
                if (event.target === this.CapaBloqueo.node()) {
                    this.cerrarVentanaEliminacion();
                }
            });
        }
        alternarVentanaPrincipal() {
            this.mostrarVentanaPrincipal = !this.mostrarVentanaPrincipal;
            this.ventanaPrincipal.style("display", this.mostrarVentanaPrincipal ? "block" : "none");
        }
        AbrirFormulario(_Usuario) {
            if (!this.ventanaCreada) {
                this.crearFormularioPersona();
            }
            this.limpiarFormularioPersona();
            this.formularioPersona.style("display", "flex");
            this.CapaBloqueo.style("display", "flex");
            this._UsuarioEdita = _Usuario;
            if (_Usuario) {
                this.txtNombre.property("value", _Usuario.nombre);
                this.txtAPaterno.property("value", _Usuario.aPaterno);
                this.txtAMaterno.property("value", _Usuario.aMaterno);
                this.txtTelefono.property("value", _Usuario.telefono);
                this.txtFecha.property("value", _Usuario.fecha.toISOString().split("T")[0]);
            }
        }
        abrirVentanaEliminacion(usuario) {
            if (!this.ventanaEliminacionCreada) {
                this.crearVentanaEliminacion();
            }
            this.usuarioAEliminar = usuario;
            this.ventanaEliminacion.select("#texto-confirmacion")
                .text(`¿Deseas eliminar a ${usuario.nombre} ${usuario.aPaterno}?`);
            this.ventanaEliminacion.style("display", "block");
            this.CapaBloqueo.style("display", "flex");
        }
        CerrarFormulario() {
            this.formularioPersona.style("display", "none");
            this.CapaBloqueo.style("display", "none");
            this.limpiarFormularioPersona();
        }
        cerrarVentanaEliminacion() {
            this.ventanaEliminacion.style("display", "none");
            this.CapaBloqueo.style("display", "none");
            this.usuarioAEliminar = null;
        }
        actualizarArrayUsuarios(_columna = -1) {
            var usuariosVisibles = Array.from(this.usuariosMapeados.values());
            const busqueda = String(this.txtBusqueda.property("value")).toLowerCase();
            if (busqueda != "") {
                usuariosVisibles = usuariosVisibles.filter(p => p.nombre.toLowerCase().includes(busqueda) ||
                    p.aPaterno.toLowerCase().includes(busqueda) ||
                    p.aMaterno.toLowerCase().includes(busqueda));
            }
            if (this.clickAnterior.columna > 0 || _columna > -1) {
                let indicador = "";
                let direccion = this.clickAnterior.direccion;
                let columna = _columna;
                if (columna > 0) {
                    columna = _columna;
                    if (columna === this.clickAnterior.columna) {
                        direccion++;
                        if (direccion > 2)
                            direccion = 0;
                    }
                    else {
                        direccion = 1;
                    }
                }
                else
                    columna = this.clickAnterior.columna;
                this.clickAnterior = { columna, direccion };
                switch (columna) {
                    case eColumna.Nombre:
                        indicador = "Nombre";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.nombre.localeCompare(b.nombre));
                        }
                        else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.nombre.localeCompare(a.nombre));
                        }
                        break;
                    case eColumna.APaterno:
                        indicador = "aPaterno";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.aPaterno.localeCompare(b.aPaterno));
                        }
                        else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.aPaterno.localeCompare(a.aPaterno));
                        }
                        break;
                    case eColumna.AMaterno:
                        indicador = "aMaterno";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.aMaterno.localeCompare(b.aMaterno));
                        }
                        else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.aMaterno.localeCompare(a.aMaterno));
                        }
                        break;
                    case eColumna.Telefono:
                        indicador = "telefono";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.telefono - b.telefono);
                        }
                        else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.telefono - a.telefono);
                        }
                        break;
                    case eColumna.Fecha:
                        indicador = "fecha";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
                        }
                        else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
                        }
                        break;
                }
                let rotacion = "";
                if (direccion === 0)
                    d3.selectAll(".icono-indicador").remove();
                else {
                    if (direccion === 1)
                        rotacion = "rotate(90deg)";
                    else
                        rotacion = "rotate(270deg)";
                    d3.selectAll(".icono-indicador").remove();
                    d3.select(`#columna-${indicador}`)
                        .append("img")
                        .attr("class", "icono-indicador")
                        .attr("src", "images/indicador.svg")
                        .attr("width", 16)
                        .attr("height", 16)
                        .style("display", "inline-block")
                        .style("transform", `${rotacion}`)
                        .style("margin-left", "5px");
                }
            }
            this.actualizarTabla(usuariosVisibles);
        }
        actualizarTabla(_arrayUsuarios) {
            this.contenedorTabla.selectAll(".fila")
                .data(_arrayUsuarios, d => d.id)
                .join(enter => {
                const filaEnter = enter.append("div")
                    .attr("class", "fila")
                    .style("display", "grid")
                    .style("grid-template-columns", "90px repeat(5, 1fr)")
                    .style("border-bottom", "1px solid #ccc")
                    .style("padding", "10px")
                    .style("opacity", "0")
                    .style("background-color", (_, i) => i % 2 === 0 ? "#f0f0f0" : "#ffffff");
                const acciones = filaEnter.append("div")
                    .style("display", "flex")
                    .style("justify-content", "space-around")
                    .style("align-items", "center")
                    .style("gap", "10px");
                acciones.append("button")
                    .text("+")
                    .style("background-color", "#4CAF50")
                    .style("color", "white")
                    .style("border", "none")
                    .style("border-radius", "50%")
                    .style("width", "28px")
                    .style("height", "28px")
                    .style("font-size", "18px")
                    .style("cursor", "pointer")
                    .on("click", (_, d) => this.AbrirFormulario(d));
                acciones.append("button")
                    .text("-")
                    .style("background-color", "#dc3545")
                    .style("color", "white")
                    .style("border", "none")
                    .style("border-radius", "50%")
                    .style("width", "28px")
                    .style("height", "28px")
                    .style("font-size", "18px")
                    .style("cursor", "pointer")
                    .on("click", (_, d) => this.abrirVentanaEliminacion(d));
                filaEnter.append("div")
                    .attr("id", "txtNombre")
                    .attr("class", "celda")
                    .style("text-align", "center")
                    .style("padding", "5px")
                    .style("border-left", "1px solid #ccc")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .text(d => String(d.nombre));
                filaEnter.append("div")
                    .attr("id", "txtAPaterno")
                    .attr("class", "celda")
                    .style("text-align", "center")
                    .style("padding", "5px")
                    .style("border-left", "1px solid #ccc")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .text(d => String(d.aPaterno));
                filaEnter.append("div")
                    .attr("id", "txtAMaterno")
                    .attr("class", "celda")
                    .style("text-align", "center")
                    .style("padding", "5px")
                    .style("border-left", "1px solid #ccc")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .text(d => String(d.aMaterno));
                filaEnter.append("div")
                    .attr("id", "txtTelefono")
                    .attr("class", "celda")
                    .style("text-align", "center")
                    .style("padding", "5px")
                    .style("border-left", "1px solid #ccc")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .text(d => String(d.telefono));
                filaEnter.append("div")
                    .attr("id", "txtFecha")
                    .attr("class", "celda")
                    .style("text-align", "center")
                    .style("padding", "5px")
                    .style("border-left", "1px solid #ccc")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .text(d => String(this.formatTime(d.fecha)));
                return filaEnter.transition().duration(300).style("opacity", "1");
            }, update => {
                update.select("#txtNombre").text(d => String(d.nombre));
                update.select("#txtAPaterno").text(d => String(d.aPaterno));
                update.select("#txtAMaterno").text(d => String(d.aMaterno));
                update.select("#txtTelefono").text(d => String(d.telefono));
                update.select("#txtFecha").text(d => String(this.formatTime(d.fecha)));
                // NUEVO: Destacar registros modificados
                update.style("background-color", (d, i) => {
                    if (d.eModificado) {
                        return "#fff3cd"; // Amarillo claro para modificados
                    }
                    return i % 2 === 0 ? "#f0f0f0" : "#ffffff";
                });
                update.transition()
                    .duration(300)
                    .style("opacity", "1");
                return update;
            }, exit => {
                return exit.transition()
                    .duration(200)
                    .style("opacity", "0")
                    .remove();
            });
        }
        GuardarFormulario() {
            const nombre = this.txtNombre.property("value");
            const aPaterno = this.txtAPaterno.property("value");
            const aMaterno = this.txtAMaterno.property("value");
            const telefono = parseInt(this.txtTelefono.property("value"));
            const fecha = new Date(this.txtFecha.property("value"));
            if (this._UsuarioEdita) {
                let _usuarioE = this.usuariosMapeados.get(this._UsuarioEdita.id);
                _usuarioE.nombre = nombre;
                _usuarioE.aPaterno = aPaterno;
                _usuarioE.aMaterno = aMaterno;
                _usuarioE.telefono = telefono;
                _usuarioE.fecha = fecha;
                _usuarioE.eModificado = true; // NUEVO: Marcar como modificado
            }
            else {
                let _usuario = {
                    id: this.usuariosMapeados.size + 1,
                    nombre,
                    aPaterno,
                    aMaterno,
                    telefono,
                    fecha,
                    eModificado: false
                };
                this.usuariosMapeados.set(_usuario.id, _usuario);
            }
            this.actualizarArrayUsuarios();
            this.CerrarFormulario();
        }
        confirmarEliminacion() {
            if (this.usuarioAEliminar) {
                this.eliminarUsuarioConfirmado(this.usuarioAEliminar);
                this.cerrarVentanaEliminacion();
            }
        }
        eliminarUsuarioConfirmado(usuario) {
            this.usuariosMapeados.delete(usuario.id);
            console.log("eliminado " + usuario.id);
            this.actualizarArrayUsuarios();
        }
        limpiarFormularioPersona() {
            this.txtNombre.property("value", "");
            this.txtAPaterno.property("value", "");
            this.txtAMaterno.property("value", "");
            this.txtTelefono.property("value", "");
            this.txtFecha.property("value", "");
        }
    }
    pantallaUsuarios_1.pantallaUsuarios = pantallaUsuarios;
})(pantallaUsuarios || (pantallaUsuarios = {}));
