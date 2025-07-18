namespace pantallaUsuarios {
    export enum eColumna {
        Nombre = 1,
        APaterno = 2,
        AMaterno = 3,
        Telefono = 4,
        Fecha = 5,
    }


    export class pantallaUsuarios {
        // Acces a la api
        private userData = new data.datoUsuarios();
        private empresaData = new data.datoEmpresas();




        private empresas: entidades.IEmpresa[] = [];
        private _UsuarioEdita: entidades.IPersona | null;


        private ventanaPrincipal: d3.Selection<HTMLDivElement, any, any, any>;

        private txtBusqueda: d3.Selection<HTMLInputElement, any, any, any>;

        private contenedorTabla: d3.Selection<HTMLDivElement, any, any, any>;
        private formularioPersona: d3.Selection<HTMLDivElement, any, any, any>;
        private txtNombre: d3.Selection<HTMLInputElement, any, any, any>;
        private txtAPaterno: d3.Selection<HTMLInputElement, any, any, any>;
        private txtAMaterno: d3.Selection<HTMLInputElement, any, any, any>;
        private txtTelefono: d3.Selection<HTMLInputElement, any, any, any>;
        private txtFechaNacimiento: d3.Selection<HTMLInputElement, any, any, any>;
        private txtCorreo: d3.Selection<HTMLInputElement, any, any, any>;
        private txtUserName: d3.Selection<HTMLInputElement, any, any, any>;
        private selectEmpresa: d3.Selection<HTMLSelectElement, any, any, any>;

        private CapaBloqueo: d3.Selection<HTMLDivElement, any, any, any>;

        private mostrarVentanaPrincipal: boolean = false;
        private ventanaCreada: boolean = false;
        private clickAnterior: { columna: number, direccion: number } = { columna: 0, direccion: 0 };







        formatTime = d3.utcFormat("%d %B, %Y");

        constructor() {
            this.crearVentanaPrincipal();
            this.crearTablaEncabezado();
            this.userData.loadUsersAPI();
        }

        private llenarSelectEmpresas(): void {
            this.selectEmpresa.selectAll("option:not(:first-child)").remove();

            this.selectEmpresa.selectAll("option.empresa-option")
                .data(this.empresas)
                .enter()
                .append("option")
                .attr("class", "empresa-option")
                .attr("value", d => d.id.toString())
                .text(d => d.nombre);
        }

        private mostrarErrorEmpresa(mensaje: string): void {
            this.selectEmpresa.append("option")
                .attr("value", "")
                .attr("disabled", true)
                .text(mensaje)
                .style("color", "red");
        }

        private obtenerEmpresaSeleccionada(): number | null {
            const valorSeleccionado = this.selectEmpresa.property("value");
            return valorSeleccionado ? parseInt(valorSeleccionado) : null;
        }

        private establecerEmpresa(empresaId: number): void {
            this.selectEmpresa.property("value", empresaId.toString());
        }

        private limpiarSelectEmpresa(): void {
            this.selectEmpresa.property("value", "");
        }

        private crearVentanaPrincipal(): void {
            this.ventanaPrincipal = d3.select("body")
                .append("div")
                .attr("id", "ventana")
                .style("width", "1100px")
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
                .on("click", () => this.userData.loadUsersAPI());

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
                .on("click", () => this.alternarVentanaPrincipal())
        }

        private crearTablaEncabezado(): void {
            this.contenedorTabla = this.ventanaPrincipal.append("div")
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

        private crearCamposFormulario() {
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

            const grupoCorreo = this.formularioPersona.append("div")
                .style("margin-bottom", "15px");

            grupoCorreo.append("label")
                .attr("for", "input-correo")
                .text("Correo:")
                .style("display", "block")
                .style("font-weight", "bold")
                .style("margin-bottom", "5px");

            this.txtCorreo = grupoCorreo.append("input")
                .attr("type", "email")
                .attr("id", "input-correo")
                .attr("placeholder", "Ingrese el correo electrónico")
                .style("width", "98%")
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .attr("value", "")
                .style("border-radius", "4px");

            const grupoUserName = this.formularioPersona.append("div")
                .style("margin-bottom", "15px");

            grupoUserName.append("label")
                .attr("for", "input-username")
                .text("Nombre de Usuario:")
                .style("display", "block")
                .style("font-weight", "bold")
                .style("margin-bottom", "5px");

            this.txtUserName = grupoUserName.append("input")
                .attr("type", "text")
                .attr("id", "input-username")
                .attr("placeholder", "Ingrese el nombre de usuario")
                .style("width", "98%")
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
                .text("Fecha de Nacimiento:")
                .style("display", "block")
                .style("font-weight", "bold")
                .style("margin-bottom", "5px");

            this.txtFechaNacimiento = grupoFecha.append("input")
                .attr("type", "date")
                .attr("id", "input-fecha")
                .style("width", "98%")
                .attr("required", true)
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .attr("value", "")
                .style("border-radius", "4px");

            const grupoEmpresa = this.formularioPersona.append("div")
                .style("margin-bottom", "15px");

            grupoEmpresa.append("label")
                .attr("for", "select-empresa")
                .text("Empresa:")
                .style("display", "block")
                .style("font-weight", "bold")
                .style("margin-bottom", "5px");

            this.selectEmpresa = grupoEmpresa.append("select")
                .attr("id", "select-empresa")
                .attr("required", true)
                .style("width", "100%")
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "4px")
                .style("background-color", "#fff")
                .style("font-size", "14px");

            this.selectEmpresa.append("option")
                .attr("value", "")
                .attr("selected", true)
                .attr("disabled", true)
                .text("Seleccione una empresa...");

            this.consultarEmpresasAPI();

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

        private crearFormularioPersona(): void {
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
                .style("z-i", "999");

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

        public alternarVentanaPrincipal(): void {
            this.mostrarVentanaPrincipal = !this.mostrarVentanaPrincipal;
            this.ventanaPrincipal.style("display", this.mostrarVentanaPrincipal ? "block" : "none");
        }

        private AbrirFormularioPorId(usuarioId: number): void {

            const usuario = this.userData.usuariosMapeados.get(usuarioId);

            if (usuario) {
                this.AbrirFormulario(usuario);
            } else {
                console.error('Usuario no encontrado:', usuarioId);

            }
        }

        private AbrirFormulario(_Usuario: entidades.IPersona) {
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
                this.txtCorreo.property("value", _Usuario.correo);
                this.txtUserName.property("value", _Usuario.nameTag);
                this.txtTelefono.property("value", _Usuario.telefono);
                this.txtFechaNacimiento.property("value", _Usuario.fechaNacimiento.toISOString().split("T")[0]);
                this.establecerEmpresa(_Usuario.empresa);
            }
        }

        private CerrarFormulario() {
            this.formularioPersona.style("display", "none");
            this.CapaBloqueo.style("display", "none");
            this.limpiarFormularioPersona();
        }

        private actualizarArrayUsuarios(_columna: number = -1): void {
            var usuariosVisibles: Array<entidades.IPersona> = Array.from(this.userData.usuariosMapeados.values());

            const busqueda = String(this.txtBusqueda.property("value")).toLowerCase();

            if (busqueda != "") {
                usuariosVisibles = usuariosVisibles.filter(p =>
                    p.nombre.toLowerCase().includes(busqueda) ||
                    p.aPaterno.toLowerCase().includes(busqueda) ||
                    p.aMaterno.toLowerCase().includes(busqueda)
                );
            }

            if (this.clickAnterior.columna > 0 || _columna > -1) {
                let indicador: String = "";
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
                        } else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.nombre.localeCompare(a.nombre));
                        }
                        break;

                    case eColumna.APaterno:
                        indicador = "aPaterno";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.aPaterno.localeCompare(b.aPaterno));
                        } else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.aPaterno.localeCompare(a.aPaterno));
                        }
                        break;

                    case eColumna.AMaterno:
                        indicador = "aMaterno";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.aMaterno.localeCompare(b.aMaterno));
                        } else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.aMaterno.localeCompare(a.aMaterno));
                        }
                        break;

                    case eColumna.Telefono:
                        indicador = "telefono";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.telefono - b.telefono);
                        } else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.telefono - a.telefono);
                        }
                        break;

                    case eColumna.Fecha:
                        indicador = "fechaNacimiento";
                        if (direccion === 1) {
                            usuariosVisibles.sort((a, b) => a.fechaNacimiento.getTime() - b.fechaNacimiento.getTime());
                        } else if (direccion === 2) {
                            usuariosVisibles.sort((a, b) => b.fechaNacimiento.getTime() - a.fechaNacimiento.getTime());
                        }
                        break;
                }

                let rotacion: string = "";

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

        private actualizarTabla(_arrayUsuarios?: Array<entidades.IPersona>): void {
            this.contenedorTabla.selectAll<HTMLDivElement, entidades.IPersona>(".fila")
                .data(_arrayUsuarios, d => d.id)
                .join(
                    enter => {
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
                            .on("click", (_, d: entidades.IPersona) => this.AbrirFormularioPorId(d.id));

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
                            .on("click", (_, d: entidades.IPersona) => this.confirmarEliminarPersona(d));

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
                    },

                    update => {
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
                            .style("opacity", "1")
                        return update;
                    },

                    exit => {
                        return exit.transition()
                            .duration(200)
                            .style("opacity", "0")
                            .remove();
                    }
                );
        }

        private limpiarFormularioPersona(): void {
            this.txtNombre.property("value", "");
            this.txtAPaterno.property("value", "");
            this.txtAMaterno.property("value", "");
            this.txtCorreo.property("value", "");
            this.txtUserName.property("value", "");
            this.txtTelefono.property("value", "");
            this.txtFechaNacimiento.property("value", "");
            this.limpiarSelectEmpresa();
        }



        private consultarEmpresasAPI(): void {
            const url = config.ApiConfig.API_EMPRESAS;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Empresas recibidas:', data);

                    const empresas: entidades.IEmpresa[] = data;
                    this.empresas = empresas;
                    this.llenarSelectEmpresas();


                    if (data.length > 0) {
                        
                    }
                })
                .catch(error => {
                    console.error("Error al consultar empresas:", error);
                    this.mostrarErrorEmpresa("No se pudieron cargar las empresas");



                });
        }

        private CrearPersonaPU(persona: entidades.IPersona) {
            this.userData.createUserAPI(persona);
            // si la respuesta fue correcta que se ejecute esto
            this.userData.loadUsersAPI();
            this.CerrarFormulario();
        }

        private actualizarPersonaPU(persona: entidades.IPersona) {
            this.userData.updateUserAPI(persona);
            // si la respuesta fue correcta que se ejecute esto
            this.userData.loadUsersAPI();
            this.CerrarFormulario();
        }

        private eliminarPersonaPU(id: number) {
            this.userData.deleteUserAPI(id);
            // si la respuesta fue correcta que se ejecute esto
            this.userData.loadUsersAPI();
        }





        private guardarPersonaAPI(persona: entidades.IPersona): void {
            const esNuevo = persona.id === 0;

            if (esNuevo) {
                this.userData.createUserAPI(persona);
            } else {
                this.userData.updateUserAPI(persona);
            }
        }

        private GuardarFormulario(): void {
            const nombre = this.txtNombre.property("value");
            const aPaterno = this.txtAPaterno.property("value");
            const aMaterno = this.txtAMaterno.property("value");
            const telefono = parseInt(this.txtTelefono.property("value"));
            const fechaNacimiento = new Date(this.txtFechaNacimiento.property("value"));
            const correo = this.txtCorreo.property("value");
            const nameTag = this.txtUserName.property("value");
            const empresa = this.obtenerEmpresaSeleccionada();


            if (!empresa) {

                return;
            }


            if (!nombre.trim()) {

                this.txtNombre.node()?.focus();
                return;
            }

            if (!aPaterno.trim()) {
                
                return;
            }

            if (isNaN(telefono) || telefono <= 0) {
                
                return;
            }

            const persona: entidades.IPersona = {
                id: this._UsuarioEdita ? this._UsuarioEdita.id : 0,
                nombre,
                aPaterno,
                aMaterno,
                telefono,
                fechaNacimiento,
                correo,
                nameTag,
                empresa
            };

            this.guardarPersonaAPI(persona);
            this.actualizarArrayUsuarios();
        }

        private confirmarEliminarPersona(usuario: entidades.IPersona): void {
            
            
        }



    }
}