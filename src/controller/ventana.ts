namespace controller {
    export class ventana {
        private modal: d3.Selection<HTMLDivElement, any, any, any>;
        private capaBloqueo: d3.Selection<HTMLDivElement, any, any, any>;
        private ventana: d3.Selection<HTMLDivElement, any, any, any>;
        private contenidoModal: d3.Selection<HTMLDivElement, any, any, any>;
        private tituloElemento: d3.Selection<HTMLHeadingElement, any, any, any>;
        private tituloActual: string = "";
        private esVisible: boolean = false;
        private esModal: boolean = false;

        public createWindow(titulo: string, ventanaPadre: d3.Selection<HTMLDivElement, any, any, any>): d3.Selection<HTMLDivElement, any, any, any> {
            this.ventana = ventanaPadre;
            this.esModal = false;
            this.tituloActual = titulo;
            this.drawWindow();
            return this.ventana;
        }

        public createModal(titulo: string, ventanaPadre: d3.Selection<HTMLDivElement, any, any, any>, callback: () => void): d3.Selection<HTMLDivElement, any, any, any> {
            this.esModal = true;
            this.ventana = ventanaPadre;
            this.tituloActual = titulo;
            this.drawModal();
            return this.contenidoModal;
        }

        private drawWindow(): void {
            this.ventana = d3.select("body")
                .append("div")
                .attr("id", "ventana")
                .style("width", "1100px")
                .style("height", "700px")
                .style("overflow", "auto")
                .style("padding", "10px")
                .style("background-color", "#f0f0f0")
                .style("border", "1px solid #ccc")
                .style("position", "relative");

            this.tituloElemento = this.ventana.append("h3")
                .text(this.tituloActual)
                .style("margin-top", "0");

            this.closeBtn(this.ventana);
        }

        private drawModal(): void {
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

            this.modal = this.capaBloqueo
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

            this.tituloElemento = this.modal.append("h3")
                .attr("id", "formulario-titulo")
                .text(this.tituloActual)
                .style("margin", "0 0 20px 0")
                .style("font-size", "22px")
                .style("color", "#333")
                .style("text-align", "center");

            this.closeBtn(this.modal);

            this.contenidoModal = this.modal.append("div")
                .style("flex", "1");
        }

        private closeBtn(container: d3.Selection<HTMLDivElement, any, any, any>): void {
            container.append("button")
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
                .style("width", "30px")
                .style("height", "30px")
                .style("border-radius", "50%")
                .on("click", () => this.cerrar());
        } 
        
        public mostrar(): void {
            if (this.esModal && this.capaBloqueo) {
                this.capaBloqueo.style("display", "flex");
                this.esVisible = true;
            } else if (!this.esModal && this.ventana) {
                this.ventana.style("display", "block");
                this.esVisible = true;
            }
        }

        public cerrar(): void {
            if (this.esModal && this.capaBloqueo) {
                this.capaBloqueo.style("display", "none");
                this.esVisible = false;
            } else if (!this.esModal && this.ventana) {
                this.ventana.style("display", "none");
                this.esVisible = false;
            }
        }

        public cambiarTitulo(nuevoTitulo: string): void {
            this.tituloActual = nuevoTitulo;
            if (this.tituloElemento) {
                this.tituloElemento.text(nuevoTitulo);
            }
        }

        public obtenerContenedor(): d3.Selection<HTMLDivElement, any, any, any> {
            if (this.esModal) {
                return this.contenidoModal;
            } else {
                return this.ventana;
            }
        }

        public estaVisible(): boolean {
            return this.esVisible;
        }
    }
}