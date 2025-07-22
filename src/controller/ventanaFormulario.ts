namespace controller {
    export class VentanaFormulario {
        private formularioModal: d3.Selection<HTMLDivElement, any, any, any>;
        private capaBloqueo: d3.Selection<HTMLDivElement, any, any, any>;
        private contenidoFormulario: d3.Selection<HTMLDivElement, any, any, any>;
        private ventanaPadre: d3.Selection<HTMLDivElement, any, any, any>;
        private formularioCreado: boolean = false;
        private onCerrarCallback: (() => void) | null = null;

        public formCreate() {
            if (this.formularioCreado == false)
                this.crearFormulario("", "500px");

            this.abrir();
        }

        public crearFormulario(titulo: string, ancho: string = "500px"): d3.Selection<HTMLDivElement, any, any, any> {
            this.capaBloqueo = this.ventanaPadre.append("div")
                .attr("id", "modal-formulario")
                .style("position", "absolute")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0, 0, 0, 0.6)")
                .style("display", "none")
                .style("z-index", "999");

            this.formularioModal = this.capaBloqueo
                .append("div")
                .attr("id", "formulario-content")
                .style("width", ancho)
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

            this.formularioModal.append("h3")
                .text(titulo)
                .style("margin", "0 0 20px 0")
                .style("font-size", "22px")
                .style("color", "#333")
                .style("text-align", "center");

            this.formularioModal.append("button")
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
                .on("click", () => this.cerrar());

            this.contenidoFormulario = this.formularioModal
                .append("div")
                .attr("class", "campos-formulario")
                .style("flex", "1");

            this.formularioCreado = true;
            return this.contenidoFormulario;
        }

        public abrir(): void {
            if (this.capaBloqueo && this.formularioModal) {
                this.capaBloqueo.style("display", "flex");
                this.formularioModal.style("display", "flex");
            }
        }

        public cerrar(): void {
            if (this.capaBloqueo && this.formularioModal) {
                this.capaBloqueo.style("display", "none");
                this.formularioModal.style("display", "none");

                if (this.onCerrarCallback) {
                    this.onCerrarCallback();
                }
            }
        }

        public cambiarTitulo(nuevoTitulo: string): void {
            if (this.formularioModal) {
                this.formularioModal.select("h3").text(nuevoTitulo);
            }
        }

        public setOnCerrar(callback: () => void): void {
            this.onCerrarCallback = callback;
        }

        public obtenerContenido(): d3.Selection<HTMLDivElement, any, any, any> | null {
            return this.contenidoFormulario;
        }
    }
}