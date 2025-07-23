namespace controller {
    export class VentanaFormulario {
        private formularioModal: d3.Selection<HTMLDivElement, any, any, any>;
        private capaBloqueo: d3.Selection<HTMLDivElement, any, any, any>;
        private contenidoFormulario: d3.Selection<HTMLDivElement, any, any, any>;
        private ventana: d3.Selection<HTMLDivElement, any, any, any>;
        private formularioCreado: boolean = false;
        private tituloActual: string = "";

        public asignarPadre(ventanaPadre: d3.Selection<HTMLDivElement, any, any, any>): d3.Selection<HTMLDivElement, any, any, any> {
            this.ventana = ventanaPadre;
            return this.contenidoFormulario || this.ventana;
        }

        public formAcces(): void {
            if (!this.formularioCreado) {
                this.crearFormulario("");
            }
            this.abrir();
        }

        public crearFormulario(titulo: string): d3.Selection<HTMLDivElement, any, any, any> {
            if (this.formularioCreado) {
                return this.contenidoFormulario;
            }
            
            this.tituloActual = titulo;

            this.capaBloqueo = this.ventana.append("div")
                .attr("id", "modal-formulario")
                .style("position", "absolute")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0, 0, 0, 0.6)")
                .style("display", "none")
                .style("z-index", "999")
                .on("click", (event) => {
                    if (event.target === this.capaBloqueo.node()) {
                        this.cerrar();
                    }
                });

            this.formularioModal = this.capaBloqueo
                .append("div")
                .attr("id", "formulario-content")
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
                .style("flex-direction", "column")
                .style("max-height", "90vh")
                .style("overflow-y", "auto");

            this.formularioModal.append("h3")
                .attr("id", "formulario-titulo")
                .text(titulo)
                .style("margin", "0 0 20px 0")
                .style("font-size", "22px")
                .style("color", "#333")
                .style("text-align", "center");

            this.formularioModal.append("button")
                .attr("id", "btn-cerrar-formulario")
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
                .style("width", "30px")
                .style("height", "30px")
                .style("border-radius", "50%")
                .style("transition", "background-color 0.3s ease, color 0.3s ease")
                .on("mouseover", function() {
                    d3.select(this)
                        .style("background-color", "#f0f0f0")
                        .style("color", "#333");
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .style("background-color", "transparent")
                        .style("color", "#999");
                })
                .on("click", () => this.cerrar());

            this.contenidoFormulario = this.formularioModal
                .append("div")
                .attr("class", "campos-formulario")
                .style("flex", "1")
                .style("overflow-y", "auto");

            this.formularioCreado = true;
            return this.contenidoFormulario;
        }

        public abrir(): void {
            this.capaBloqueo.style("display", "flex");
            this.formularioModal.style("display", "flex");

        }

        public cerrar(): void {
            this.capaBloqueo.style("display", "none");
            this.formularioModal.style("display", "none");
        }

        public cambiarTitulo(nuevoTitulo: string): void {
            if (this.formularioModal) {
                this.tituloActual = nuevoTitulo;
                this.formularioModal.select("#formulario-titulo").text(nuevoTitulo);
            }
        }


        public estaAbierto(): boolean {
            if (!this.formularioCreado || !this.capaBloqueo) {
                return false;
            }
            return this.capaBloqueo.style("display") === "flex";
        }


        public obtenerContenido(): d3.Selection<HTMLDivElement, any, any, any> {
            return this.contenidoFormulario;
        }


        public mostrarCargando(mostrar: boolean = true): void {
            if (!this.formularioModal) return;

            if (mostrar) {
                if (this.formularioModal.select(".loading-overlay").empty()) {
                    const Overlay = this.formularioModal
                        .append("div")
                        .attr("class", "loading-overlay")
                        .style("position", "absolute")
                        .style("top", "0")
                        .style("left", "0")
                        .style("width", "100%")
                        .style("height", "100%")
                        .style("background-color", "rgba(255, 255, 255, 0.8)")
                        .style("display", "flex")
                        .style("align-items", "center")
                        .style("justify-content", "center")
                        .style("z-index", "1000");

                    Overlay.append("div")
                        .style("text-align", "center")
                        .html(`
                            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 0 auto 10px;"></div>
                            <p style="margin: 0; color: #666;">Procesando...</p>
                        `);
                }
                this.formularioModal.select(".loading-overlay").style("display", "flex");
            } else {
                this.formularioModal.select(".loading-overlay").style("display", "none");
            }
        }
    }
}