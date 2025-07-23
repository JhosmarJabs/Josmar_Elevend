var pantallaUsuarios;
(function (pantallaUsuarios_1) {
    class pantallaUsuarios {
        constructor() {
            // Acces a controles
            this.userData = new data.datoUsuarios();
            this.viewForm = new controller.formulario();
            this.controllerDelete = new controller.eliminacion();
            this.windowController = new controller.ventana();
            this.clickAnterior = { columna: 0, direccion: 0 };
            // formatos
            this.formatTime = d3.utcFormat("%d %B, %Y");
            this.crearVentanaPrincipal();
            this.crearTablaEncabezado();
            this.cargarUsuariosPU();
        }
        // Area de Usuarios
        cargarUsuariosPU() {
            this.userData.loadUsersAPI((resp) => {
                if (resp > 0)
                    this.actualizarArrayUsuarios();
            });
        }
        eliminarPersonaPU(user) {
            this.controllerDelete.asignarPadre(this.ventanaPadre);
            this.controllerDelete.mostrarConfirmacion(user.nombre, (confirmar) => {
                if (confirmar) {
                    this.userData.deleteUserAPI(user.id);
                    this.cargarUsuariosPU();
                }
            });
        }
        llamarFormularioUP(persona) {
            this.viewForm.asignarPadre(this.ventanaPadre);
            this.viewForm.mostrarFormulario(persona, () => {
                this.cargarUsuariosPU();
            });
        }
        actualizarArrayUsuarios(_columna = -1) {
            var usuariosVisibles = Array.from(this.userData.getUsersArray());
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
                    case entidades.eColumna.Nombre:
                        indicador = "Nombre";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.nombre.localeCompare(b.nombre));
                        }
                        else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.nombre.localeCompare(a.nombre));
                        }
                        break;
                    case entidades.eColumna.APaterno:
                        indicador = "aPaterno";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.aPaterno.localeCompare(b.aPaterno));
                        }
                        else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.aPaterno.localeCompare(a.aPaterno));
                        }
                        break;
                    case entidades.eColumna.AMaterno:
                        indicador = "aMaterno";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.aMaterno.localeCompare(b.aMaterno));
                        }
                        else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.aMaterno.localeCompare(a.aMaterno));
                        }
                        break;
                    case entidades.eColumna.Telefono:
                        indicador = "telefono";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.telefono - b.telefono);
                        }
                        else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.telefono - a.telefono);
                        }
                        break;
                    case entidades.eColumna.Fecha:
                        indicador = "fechaNacimiento";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.fechaNacimiento.getTime() - b.fechaNacimiento.getTime());
                        }
                        else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.fechaNacimiento.getTime() - a.fechaNacimiento.getTime());
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
        // Pantalla ventana Principal
        verPantalla() {
            this.windowController.mostrar();
        }
        crearVentanaPrincipal() {
            this.ventanaPadre = this.windowController.asignarPadre("Usuarios", this.ventanaPadre);
            const contSuperior = this.ventanaPadre.append("div")
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
                .on("click", () => {
                this.cargarUsuariosPU();
            });
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
                .on("click", () => this.llamarFormularioUP(null));
        }
        crearTablaEncabezado() {
            this.contenedorTabla = this.ventanaPadre.append("div")
                .attr("class", "tabla-container")
                .style("margin-top", "10px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "4px")
                .style("overflow", "hidden");
            const encabezado = this.contenedorTabla.append("div")
                .style("display", "grid")
                .style("grid-template-columns", "90px repeat(7, 1fr)")
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
                .attr("id", "columna-email")
                .attr("class", "titulo-columna")
                .style("text-align", "center")
                .style("font-weight", "bold")
                .style("user-select", "none")
                .style("cursor", "pointer")
                .text("Email")
                .on("click", () => this.actualizarArrayUsuarios(3));
            encabezado.append("div")
                .attr("id", "columna-direccion")
                .attr("class", "titulo-columna")
                .style("text-align", "center")
                .style("font-weight", "bold")
                .style("user-select", "none")
                .style("cursor", "pointer")
                .text("Usuario")
                .on("click", () => this.actualizarArrayUsuarios(4));
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
        actualizarTabla(_arrayUsuarios) {
            this.contenedorTabla.selectAll(".fila")
                .data(_arrayUsuarios, d => d.id)
                .join(enter => {
                const filaEnter = enter.append("div")
                    .attr("class", "fila")
                    .style("display", "grid")
                    .style("grid-template-columns", "90px repeat(7, 1fr)")
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
                    .on("click", (_, d) => this.llamarFormularioUP(d));
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
                    .on("click", (_, d) => this.eliminarPersonaPU(d));
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
                    .attr("id", "txtCorreo")
                    .attr("class", "celda")
                    .style("text-align", "center")
                    .style("padding", "5px")
                    .style("border-left", "1px solid #ccc")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .style("word-break", "break-all")
                    .style("line-height", "1.2")
                    .text(d => String(d.correo));
                filaEnter.append("div")
                    .attr("id", "txtUserName")
                    .attr("class", "celda")
                    .style("text-align", "center")
                    .style("padding", "5px")
                    .style("border-left", "1px solid #ccc")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .text(d => String(d.nameTag));
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
                    .text(d => String(this.formatTime(d.fechaNacimiento)));
                return filaEnter.transition().duration(300).style("opacity", "1");
            }, update => {
                update.select("#txtNombre").text(d => String(d.nombre));
                update.select("#txtAPaterno").text(d => String(d.aPaterno));
                update.select("#txtAMaterno").text(d => String(d.aMaterno));
                update.select("#txtCorreo").text(d => String(d.correo));
                update.select("#txtUserName").text(d => String(d.nameTag));
                update.select("#txtTelefono").text(d => String(d.telefono));
                update.select("#txtFecha").text(d => String(this.formatTime(d.fechaNacimiento)));
                update.style("background-color", (d, i) => {
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
    }
    pantallaUsuarios_1.pantallaUsuarios = pantallaUsuarios;
})(pantallaUsuarios || (pantallaUsuarios = {}));
//# sourceMappingURL=pantallaUsuarios.js.map