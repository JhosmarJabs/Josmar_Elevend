namespace controller {
    export class eliminacion {
        private VentanaEliminacion: d3.Selection<HTMLDivElement, any, any, any>;
        private capaBloqueo: d3.Selection<HTMLDivElement, any, any, any>;
        private ventana: d3.Selection<HTMLDivElement, any, any, any>;
        private VentanaCreado: boolean = false;
        private onConfirmarCallback: ((confirma: boolean) => void) | null = null;

        public asignarPadre(ventanaPadre: d3.Selection<HTMLDivElement, any, any, any>): void {
            this.ventana = ventanaPadre
        }

        public crearVentana(): void {
            this.capaBloqueo = this.ventana.append("div")
                .attr("id", "Ventana-eliminacion")
                .style("position", "absolute")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0, 0, 0, 0.6)")
                .style("display", "none")
                .style("z-index", "9999");

            this.VentanaEliminacion = this.capaBloqueo
                .append("div")
                .attr("id", "confirmacion-content")
                .style("width", "400px")
                .style("max-width", "90%")
                .style("padding", "30px")
                .style("background-color", "#fff")
                .style("border-radius", "12px")
                .style("box-shadow", "0 8px 16px rgba(0, 0, 0, 0.3)")
                .style("position", "absolute")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("text-align", "center");

            this.VentanaEliminacion
                .append("div")
                .style("margin-bottom", "20px")
                .append("div")
                .style("width", "60px")
                .style("height", "60px")
                .style("margin", "0 auto")
                .style("background-color", "#dc3545")
                .style("border-radius", "50%")
                .style("display", "flex")
                .style("align-items", "center")
                .style("justify-content", "center")
                .style("color", "white")
                .style("font-size", "30px")
                .style("font-weight", "bold")
                .text("!");

            this.VentanaEliminacion
                .append("h3")
                .attr("id", "titulo-eliminacion")
                .text("Advertencia")
                .style("margin", "0 0 15px 0")
                .style("font-size", "22px")
                .style("color", "#333")
                .style("font-weight", "600");

            this.VentanaEliminacion
                .append("p")
                .attr("id", "mensaje-eliminacion")

                .style("margin", "0 0 30px 0")
                .style("font-size", "16px")
                .style("color", "#666")
                .style("line-height", "1.5");

            const contenedorBotones = this.VentanaEliminacion
                .append("div")
                .style("display", "flex")
                .style("gap", "15px")
                .style("justify-content", "center");

            contenedorBotones
                .append("button")
                .text("Cancelar")
                .style("padding", "12px 24px")
                .style("background-color", "#6c757d")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "6px")
                .style("cursor", "pointer")
                .style("font-size", "14px")
                .style("font-weight", "500")
                .style("min-width", "100px")
                .style("transition", "background-color 0.3s ease")
                .on("mouseover", function () {
                    d3.select(this).style("background-color", "#5a6268");
                })
                .on("mouseout", function () {
                    d3.select(this).style("background-color", "#6c757d");
                })
                .on("click", () => this.responder(false));

            contenedorBotones
                .append("button")
                .text("Eliminar")
                .style("padding", "12px 24px")
                .style("background-color", "#dc3545")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "6px")
                .style("cursor", "pointer")
                .style("font-size", "14px")
                .style("font-weight", "500")
                .style("min-width", "100px")
                .style("transition", "background-color 0.3s ease")
                .on("mouseover", function () {
                    d3.select(this).style("background-color", "#c82333");
                })
                .on("mouseout", function () {
                    d3.select(this).style("background-color", "#dc3545");
                })
                .on("click", () => this.responder(true));

            this.VentanaCreado = true;
        }

        public abrir(): void {
            if (this.capaBloqueo)
                this.capaBloqueo.style("display", "flex");
        }
        public cerrar(): void {
            if (this.capaBloqueo)
                this.capaBloqueo.style("display", "none");
        }
        
        public mostrarConfirmacion(nombre: string, callback: (confirma: boolean) => void): void {
            if (!this.VentanaCreado)
                this.crearVentana();

            this.abrir();

            var mensaje: string = `¿Estás seguro de eliminar ${nombre}?`;
            this.VentanaEliminacion.select("#mensaje-eliminacion").text(mensaje);

            this.onConfirmarCallback = callback;

            this.capaBloqueo.style("display", "flex");
        }

        private responder(confirma: boolean): void {
            this.cerrar();

            if (this.onConfirmarCallback)
                this.onConfirmarCallback(confirma);
        }
    }
}