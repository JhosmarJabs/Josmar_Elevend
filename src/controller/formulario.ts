namespace controller {
    export class formulario {
        private controllerForm = new controller.VentanaFormulario();
        private empresaData = new data.datoEmpresas();
        private contenidoFormulario: d3.Selection<HTMLDivElement, any, any, any>;

        // Campos de Texto
        private txtNombre: d3.Selection<HTMLInputElement, any, any, any>;
        private txtAPaterno: d3.Selection<HTMLInputElement, any, any, any>;
        private txtAMaterno: d3.Selection<HTMLInputElement, any, any, any>;
        private txtTelefono: d3.Selection<HTMLInputElement, any, any, any>;
        private txtFechaNacimiento: d3.Selection<HTMLInputElement, any, any, any>;
        private txtCorreo: d3.Selection<HTMLInputElement, any, any, any>;
        private txtUserName: d3.Selection<HTMLInputElement, any, any, any>;

        private selectEmpresa: d3.Selection<HTMLSelectElement, any, any, any>;

        private _UsuarioEdita: entidades.IPersona | null;

        private empresas: entidades.IEmpresa[] = this.empresaData.getEmpresas();

        public llamarFormulario(ventanaPadre: d3.Selection<HTMLDivElement, any, any, any>, tipo: number): void {
            this.controllerForm.formCreate()

            if (tipo > 0) {
                // this.controllerForm.callbackView(ventanaPadre, tipo);
                this.controllerForm.cambiarTitulo("Crear Usuario");
            }else{
                // this.controllerForm.callbackView(ventanaPadre, tipo);
                this.controllerForm.cambiarTitulo("Actualizar Usuario");
            }
        }

        public PasarDatosUsuario(data: entidades.IPersona) {

        }

        public PasarDatosEmpresa(data: entidades.IEmpresa) {
            this.llenarSelectEmpresas();
        }

        private consultarEmpresasAPI(): void {
            this.empresaData.loaderEmpresasAPI();

        }

        private crearCamposFormulario(): void {
            const grupoNombre = this.contenidoFormulario.append("div")
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

            const grupoPaterno = this.contenidoFormulario.append("div")
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

            const grupoMaterno = this.contenidoFormulario.append("div")
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

            const grupoCorreo = this.contenidoFormulario.append("div")
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

            const grupoUserName = this.contenidoFormulario.append("div")
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

            const grupoTelefono = this.contenidoFormulario.append("div")
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

            const grupoFecha = this.contenidoFormulario.append("div")
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

            const grupoEmpresa = this.contenidoFormulario.append("div")
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

            // Cargar empresas
            // this.consultarEmpresasAPI();

            this.contenidoFormulario.append("button")
                .text("Guardar")
                .style("padding", "10px 20px")
                .style("background-color", "#007BFF")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "4px")
                .style("cursor", "pointer")
                .style("margin-top", "10px")
                .on("click", () => {
                    this.GuardarFormulario();
                });
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


            if (!empresa)
                return;


            if (!nombre.trim()) {
                this.txtNombre.node()?.focus();
                return;
            }

            if (!aPaterno.trim())
                return;


            if (isNaN(telefono) || telefono <= 0)
                return;


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
            // this.actualizarArrayUsuarios();
        }

        private guardarPersonaAPI(persona: entidades.IPersona): void {
            const esNuevo = persona.id === 0;

            if (esNuevo) {
                // this.userData.createUserAPI(persona);
            } else {
                // this.userData.updateUserAPI(persona);
            }
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

        private limpiarSelectEmpresa(): void {
            this.selectEmpresa.property("value", "");
        }

        private obtenerEmpresaSeleccionada(): number | null {
            const valorSeleccionado = this.selectEmpresa.property("value");
            return valorSeleccionado ? parseInt(valorSeleccionado) : null;
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
    }
}